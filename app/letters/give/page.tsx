import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SwipeDeck, type SwipeLetter } from "@/components/letters/SwipeDeck";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, LETTERS_BUCKET } from "@/lib/supabase/config";
import { DONOR_TERMS_SUMMARY } from "@/content/consent";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Adopt a Letter · Santa's Letters · Santa's Knights",
  description:
    "Read kids' letters to Santa one at a time. When one gets you, gift the wish on Amazon — the child stays anonymous, and you make a Christmas.",
};

// The pool changes as letters are approved and fulfilled — render per-request.
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
    .select("id, child_first_name, child_age, wish_note, amazon_url, letter_image_path, created_at")
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
    amazonUrl: row.amazon_url,
    imageUrl: row.letter_image_path ? (signedByPath.get(row.letter_image_path) ?? null) : null,
  }));
}

/**
 * Sample letters for `?demo=1` — lets the team review the swipe experience on
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
    amazonUrl: "https://www.amazon.com/s?k=watercolor+paint+set+kids",
    imageUrl: null,
  },
  {
    id: "demo-2",
    childFirstName: "Jaylen",
    childAge: 10,
    wishNote:
      "Hi Santa! My sneakers are too small now. Size 5 please, any color but mostly blue. Thank you and say hi to the reindeer.",
    amazonUrl: "https://www.amazon.com/s?k=kids+sneakers+size+5",
    imageUrl: null,
  },
  {
    id: "demo-3",
    childFirstName: "Sofia",
    childAge: 5,
    wishNote: "deer santa. a stuffed dog pleese. a big one. i wil name him biscit.",
    amazonUrl: "https://www.amazon.com/s?k=large+stuffed+dog+plush",
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
      <section className="border-b border-line pt-[46px] pb-[34px]">
        <Container className="max-w-[820px] text-center">
          <Eyebrow>Santa&apos;s Letters</Eyebrow>
          <h1 className="mt-3 text-h2 font-black tracking-[-0.03em]">
            Pick a letter off the{" "}
            <em className="font-serif font-medium italic text-red">pile</em>.
          </h1>
          <p className="mx-auto mt-3 max-w-[52ch] text-muted">
            One letter at a time, the way it&apos;s always worked. Swipe right (or tap{" "}
            <strong className="font-bold text-ink">Gift this</strong>) to grant the wish on
            Amazon. Swipe left to read the next one.
          </p>
        </Container>
      </section>

      <section className="py-[46px]">
        <Container className="max-w-[640px]">
          {letters === null ? (
            <EmptyState
              title="The letter drive isn't open yet"
              body="We're getting the system ready for the season. Check back soon — or leave your email on the homepage and we'll tell you the moment letters go up."
            />
          ) : letters.length === 0 ? (
            <EmptyState
              title="The pile is empty"
              body="Every posted letter has been adopted — which is the best possible problem. New letters appear as families submit them and we approve them, so check back soon."
            />
          ) : (
            <>
              {demo && (
                <p className="mb-6 rounded-[14px] border border-gold bg-gold-soft/60 px-5 py-3 text-center text-[14px] font-bold text-[#6c5418]">
                  Demo mode — these are sample letters, not real kids.
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
    <div className="rounded-card-lg border border-line bg-card p-[42px] text-center">
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
