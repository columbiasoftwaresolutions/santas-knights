import type { Metadata } from "next";
import { LettersPortal } from "@/components/letters/LettersPortal";
import type { SwipeLetter } from "@/components/letters/SwipeDeck";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, LETTERS_BUCKET } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Santa's Letters · Santa's Knights",
  description:
    "Read kids' letters to Santa and adopt a wish, or submit your child's letter — one page, two sides. Identities stay private throughout.",
};

// Render per request because approvals and fulfillment change the pool.
export const dynamic = "force-dynamic";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

/**
 * Approved letters via the public-safe view, with short-lived signed URLs for
 * the letter images (the bucket is private so unapproved uploads stay dark).
 * Returns null when Supabase isn't configured yet.
 */
async function getLetters(): Promise<SwipeLetter[] | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("public_letters")
    .select("id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path, created_at")
    .order("created_at", { ascending: true })
    .limit(150);

  if (error || !data) {
    console.error("Failed to load letters:", error?.message);
    return [];
  }

  const paths = data.map((row) => row.letter_image_path).filter(Boolean) as string[];
  const signedByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from(LETTERS_BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
    signed?.forEach((entry) => {
      if (entry.signedUrl && entry.path) signedByPath.set(entry.path, entry.signedUrl);
    });
  }

  return data.map((row) => ({
    id: row.id,
    childFirstName: row.child_first_name,
    childAge: row.child_age,
    wishNote: row.wish_note,
    amazonUrls: row.amazon_urls ?? [],
    imageUrl: row.letter_image_path ? (signedByPath.get(row.letter_image_path) ?? null) : null,
  }));
}

/**
 * Sample letters for `?demo=1` let the team review the swipe experience on
 * the beta before real submissions exist. Clearly labeled, never mixed with
 * real data, and the beta is noindex so this never reaches search.
 */
const DEMO_LETTERS: SwipeLetter[] = [
  {
    id: "demo-1",
    childFirstName: "Maya",
    childAge: 7,
    wishNote:
      "Dear Santa, I have been very good this year. I would love a watercolor paint set so I can paint the park near my building.",
    amazonUrls: [
      "https://www.amazon.com/s?k=watercolor+paint+set+kids",
      "https://www.amazon.com/s?k=sketch+pad+kids",
    ],
    imageUrl: null,
  },
  {
    id: "demo-2",
    childFirstName: "Jaylen",
    childAge: 10,
    wishNote:
      "Hi Santa! My sneakers are too small now. Size 5 please, any color but mostly blue. Thank you and say hi to the reindeer.",
    amazonUrls: ["https://www.amazon.com/s?k=kids+sneakers+size+5"],
    imageUrl: null,
  },
  {
    id: "demo-3",
    childFirstName: "Sofia",
    childAge: 5,
    wishNote: "deer santa. a stuffed dog pleese. a big one. i wil name him biscit.",
    amazonUrls: ["https://www.amazon.com/s?k=large+stuffed+dog+plush"],
    imageUrl: null,
  },
];

export default async function LettersPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ do?: string; demo?: string }>;
}) {
  const params = await searchParams;
  const demo = params.demo === "1";
  // Always defaults to adopt; only an explicit ?do=submit opens the submit side.
  const initialView = params.do === "submit" ? "submit" : "adopt";
  const user = await getCurrentUser();
  // Adopting requires an account: the gift is linked to the donor so we can
  // coordinate handoff, send a tax acknowledgment, and block self-dealing.
  const letters = user ? (demo ? DEMO_LETTERS : await getLetters()) : null;

  return (
    <LettersPortal
      initialView={initialView}
      signedIn={!!user}
      defaultEmail={user?.email ?? undefined}
      letters={letters}
      demo={demo}
    />
  );
}
