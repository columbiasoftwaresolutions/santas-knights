import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SwipeDeck, type SwipeLetter } from "@/components/letters/SwipeDeck";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, LETTERS_BUCKET } from "@/lib/supabase/config";
import { DONOR_TERMS_SUMMARY } from "@/content/consent";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Adopt a Letter · Santa's Letters · Santa's Knights",
  description:
    "Read kids' letters to Santa one at a time. Choose a wish and buy the gift on Amazon while the child's identity stays private.",
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

export default async function GiveLettersPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;
  const demo = params.demo === "1";
  const letters = demo ? DEMO_LETTERS : await getLetters();

  return (
    <>
      <section className="border-b border-line bg-paper py-[clamp(64px,8vw,100px)] text-ink">
        <Container>
          <h1 className="max-w-[980px] font-display text-[clamp(54px,9vw,128px)] leading-[0.84] font-black tracking-[-0.04em] uppercase">
            Pick a letter off the{" "}
            <em className="font-serif font-normal normal-case italic text-red">pile</em>.
          </h1>
          <p className="mt-8 max-w-[52ch] text-[19px] text-muted">
            One letter at a time, the way it&apos;s always worked. Swipe right (or tap{" "}
            <strong className="font-bold">Gift this</strong>) to grant the wish on
            Amazon. Swipe left to read the next one.
          </p>
          <p className="mt-3 max-w-[46ch] text-[13.5px] font-semibold tracking-[0.04em] text-red uppercase">
            Suggested gift value: $20–50 per child/person.
          </p>
        </Container>
      </section>

      <section className="bg-paper py-[46px] text-ink">
        <Container className="max-w-[640px]">
          {letters === null ? (
            <EmptyState
              title="The letter drive isn't open yet"
              body="The letter drive is not open yet. Join the email list on the homepage to hear when approved letters are available."
            />
          ) : letters.length === 0 ? (
            <EmptyState
              title="The pile is empty"
              body="Every approved letter has been adopted. New letters will appear after families submit them and a moderator approves them."
            />
          ) : (
            <>
              {demo && (
                <p className="mb-6 border border-amber bg-gold-soft/60 px-5 py-3 text-center text-[14px] font-bold text-[#6c5418]">
                  Demo mode. These are sample letters, not real submissions.
                </p>
              )}
              <SwipeDeck letters={letters} />
            </>
          )}

          <p className="mx-auto mt-10 max-w-[58ch] text-center text-[13.5px] leading-relaxed text-muted">
            <strong className="font-bold">The fine print:</strong> {DONOR_TERMS_SUMMARY}
          </p>
        </Container>
      </section>
    </>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-line bg-paper-raised p-[42px] text-center">
      <div aria-hidden className="text-[40px] text-green">
        ✶
      </div>
      <h2 className="mt-3 text-h3">{title}</h2>
      <p className="mx-auto mt-2.5 max-w-[46ch] text-muted">{body}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button href={links.submitLetter} variant="green">
          Submit a child&apos;s letter
        </Button>
        <Button href={links.donate} variant="ghost">
          Donate instead
        </Button>
      </div>
    </div>
  );
}
