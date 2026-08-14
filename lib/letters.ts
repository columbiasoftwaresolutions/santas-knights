import "server-only";

import { fetchAmazonImagePreviews } from "@/lib/amazonPreview";
import { isMissingColumnError } from "@/lib/pgError";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, LETTERS_BUCKET } from "@/lib/supabase/config";

export type PublicLetter = {
  id: string;
  childFirstName: string;
  childAge: number;
  wishNote: string;
  amazonUrls: string[];
  amazonImageUrls: string[];
  /** A single guardian-owned Amazon wishlist link, when they used one. */
  wishlistUrl: string | null;
  /** Short noun phrase for the gift, e.g. "LEGO Technic set". */
  giftSummary: string | null;
  /** Approximate dollar value, when the guardian gave one. */
  giftValueUsd: number | null;
  imageUrl: string | null;
};

export type LetterPool = {
  letters: PublicLetter[];
  /** Total live, unclaimed letters — may exceed `letters.length` (capped read). */
  total: number;
};

const SIGNED_URL_TTL_SECONDS = 60 * 60;
const MAX_LETTERS = 150;
/** Cap on how many letters get an Amazon preview backfill per request. */
const PREVIEW_BACKFILL_LIMIT = 12;

const BASE_COLUMNS =
  "id, child_first_name, child_age, wish_note, amazon_urls, wishlist_url, letter_image_path, created_at, amazon_image_urls";
const GIFT_COLUMNS = `${BASE_COLUMNS}, gift_summary, gift_value_usd`;

type LetterRow = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  amazon_urls: string[] | null;
  wishlist_url: string | null;
  letter_image_path: string | null;
  amazon_image_urls: string[] | null;
  gift_summary?: string | null;
  gift_value_usd?: number | string | null;
};

/**
 * The live, unclaimed pile.
 *
 * Reads the public-safe `public_letters` view, which projects only the columns
 * a stranger may see — a first name, an age, the wish, the gift links, and the
 * letter image path. Guardian contact and claim state never leave the base
 * table. The pile is PUBLIC: anonymous visitors read it, and only the *claim*
 * requires an account (see app/letters-to-santa/give/actions.ts).
 *
 * Returns null when Supabase isn't configured — the caller shows the
 * "drive isn't open yet" state rather than an error.
 */
export async function getLetterPool(): Promise<LetterPool | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const read = (columns: string) =>
    supabase
      .from("public_letters")
      .select(columns, { count: "exact" })
      .order("created_at", { ascending: true })
      .limit(MAX_LETTERS);

  // Prefer the columns added by sql/2026-08-gift-summary.sql; fall back to the
  // pre-migration set so a database that hasn't run it still serves the pile.
  let { data, error, count } = await read(GIFT_COLUMNS);

  if (error && isMissingColumnError(error.message)) {
    console.warn(
      "public_letters is missing gift_summary/gift_value_usd — apply sql/2026-08-gift-summary.sql.",
    );
    ({ data, error, count } = await read(BASE_COLUMNS));
  }

  if (error || !data) {
    console.error("Failed to load letters:", error?.message);
    return { letters: [], total: 0 };
  }

  const rows = data as unknown as LetterRow[];
  const [signedByPath, previewByLetterId] = await Promise.all([
    signLetterImages(supabase, rows),
    backfillAmazonPreviews(supabase, rows),
  ]);

  return {
    letters: rows.map((row) => ({
      id: row.id,
      childFirstName: row.child_first_name,
      childAge: row.child_age,
      wishNote: row.wish_note,
      amazonUrls: row.amazon_urls ?? [],
      amazonImageUrls: previewByLetterId.get(row.id) ?? row.amazon_image_urls ?? [],
      wishlistUrl: row.wishlist_url ?? null,
      giftSummary: row.gift_summary ?? null,
      giftValueUsd: row.gift_value_usd == null ? null : Number(row.gift_value_usd),
      imageUrl: row.letter_image_path ? (signedByPath.get(row.letter_image_path) ?? null) : null,
    })),
    total: count ?? rows.length,
  };
}

type AdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

/** Short-lived signed URLs — the letters bucket is private, so raw paths stay dark. */
async function signLetterImages(supabase: AdminClient, rows: LetterRow[]) {
  const byPath = new Map<string, string>();
  const paths = rows.map((row) => row.letter_image_path).filter(Boolean) as string[];
  if (paths.length === 0) return byPath;

  const { data: signed } = await supabase.storage
    .from(LETTERS_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
  signed?.forEach((entry) => {
    if (entry.signedUrl && entry.path) byPath.set(entry.path, entry.signedUrl);
  });
  return byPath;
}

/**
 * Opportunistically fetch and persist product thumbnails for letters that use
 * individual Amazon links. Bounded per request and self-terminating: once a
 * letter has its previews stored it never qualifies again, so this converges to
 * zero work even though the page is now public and uncached.
 */
async function backfillAmazonPreviews(supabase: AdminClient, rows: LetterRow[]) {
  const byLetterId = new Map<string, string[]>();

  const pending = rows
    .filter((row) => {
      const amazonUrls = row.amazon_urls ?? [];
      const previewUrls = row.amazon_image_urls ?? [];
      return amazonUrls.length > 0 && amazonUrls.some((_, i) => !previewUrls[i]);
    })
    .slice(0, PREVIEW_BACKFILL_LIMIT);

  await Promise.all(
    pending.map(async (row) => {
      const amazonUrls = row.amazon_urls ?? [];
      const previewUrls = row.amazon_image_urls ?? [];
      const fetched = await fetchAmazonImagePreviews(amazonUrls);
      const merged = amazonUrls.map((_, i) => previewUrls[i] || fetched[i] || "");
      if (!merged.some((url, i) => url && url !== previewUrls[i])) return;

      byLetterId.set(row.id, merged);
      const { error } = await supabase
        .from("santa_letters")
        .update({ amazon_image_urls: merged })
        .eq("id", row.id);
      if (error) console.error("Failed to backfill Amazon previews:", error.message);
    }),
  );

  return byLetterId;
}

/** "LEGO Technic set · about $50" — omits whichever half the letter lacks. */
export function giftAskLine(letter: PublicLetter): string | null {
  const value = letter.giftValueUsd ? `about $${Math.round(letter.giftValueUsd)}` : null;
  return [letter.giftSummary, value].filter(Boolean).join(" · ") || null;
}
