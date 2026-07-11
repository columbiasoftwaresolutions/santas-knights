import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LettersPortal } from "@/components/letters/LettersPortal";
import type { SwipeLetter } from "@/components/letters/SwipeDeck";
import { getCurrentUser } from "@/lib/auth";
import { fetchAmazonImagePreviews } from "@/lib/amazonPreview";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, LETTERS_BUCKET } from "@/lib/supabase/config";
import { org } from "@/content/site";

export const metadata: Metadata = {
  title: "Santa's Letters · Santa's Knights",
  description:
    "Read kids' letters to Santa and adopt a wish, or submit your child's letter — all on one page. We protect every child's identity, and here's exactly how we keep them safe.",
};

// Render per request because submissions, claims, and fulfillment change the pool.
export const dynamic = "force-dynamic";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

/**
 * Live unclaimed letters via the public-safe view, with short-lived signed URLs
 * for the letter images (the bucket is private so raw uploads stay dark).
 * Returns null when Supabase isn't configured yet.
 */
async function getLetters(): Promise<SwipeLetter[] | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("public_letters")
    .select("id, child_first_name, child_age, wish_note, amazon_urls, letter_image_path, created_at, amazon_image_urls")
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

  const previewByLetterId = new Map<string, string[]>();
  await Promise.all(
    data
      .filter((row) => {
        const amazonUrls: string[] = row.amazon_urls ?? [];
        const previewUrls: string[] = row.amazon_image_urls ?? [];
        return amazonUrls.length > 0 && amazonUrls.some((_, i) => !previewUrls[i]);
      })
      .slice(0, 12)
      .map(async (row) => {
        const amazonUrls: string[] = row.amazon_urls ?? [];
        const previewUrls: string[] = row.amazon_image_urls ?? [];
        const fetched = await fetchAmazonImagePreviews(amazonUrls);
        const merged = amazonUrls.map((_, i) => previewUrls[i] || fetched[i] || "");
        if (!merged.some((url, i) => url && url !== previewUrls[i])) return;

        previewByLetterId.set(row.id, merged);
        const { error: updateError } = await supabase
          .from("santa_letters")
          .update({ amazon_image_urls: merged })
          .eq("id", row.id);
        if (updateError) console.error("Failed to backfill Amazon previews:", updateError.message);
      }),
  );

  return data.map((row) => ({
    id: row.id,
    childFirstName: row.child_first_name,
    childAge: row.child_age,
    wishNote: row.wish_note,
    amazonUrls: row.amazon_urls ?? [],
    amazonImageUrls: previewByLetterId.get(row.id) ?? row.amazon_image_urls ?? [],
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
      "Dear Santa, I have been very good this year. I would love this LEGO car set because I want to build something big with my dad.",
    amazonUrls: [
      "https://www.amazon.com/LEGO-Technic-Lamborghini-Advanced-Building/dp/B0CPQ54PQ5/ref=sr_1_9?crid=1G8XMOFGVLN5C&dib=eyJ2IjoiMSJ9.cEtfmrGy_T40hphH4Ih9xNRkh7R263UBsFqsEwGXZ4FbI6hrZ7rS6lMS--6s_NeSDPdXr0WwqgLX9bpuD3jPTF6Q63sGM1RyATMaey8NJX24H7q24IOhtu749uxaqNCko6lPvIfiSt4hT6RAGN9AsLXppWceNXkb22YT3pQ7MyuFAFUTU_74unWBSLMzHbOOobkk-0aQ66nc_H7xRvxNUt9I_VapITm_3UE55CYTEmCuresm3flZwANr80N5jeF8KhvWRzSmNPCzY3K5QWwLmhHOtoN5pW_yg5L7ZEAJYwo.BEXCwJldfrIU8QcIHzu3XSdrOLzeA9R5mXiqaOV8kZA&dib_tag=se&keywords=lego&qid=1782588029&sprefix=lego+set%2Caps%2C339&sr=8-9&ufe=app_do%3Aamzn1.fos.9fe8cbfa-bf43-43d1-a707-3f4e65a4b666",
    ],
    amazonImageUrls: ["https://m.media-amazon.com/images/I/81w4luhxYqL._AC_SL1500_.jpg"],
    imageUrl: null,
  },
  {
    id: "demo-2",
    childFirstName: "Jaylen",
    childAge: 10,
    wishNote:
      "Hi Santa! My sneakers are too small now. Size 5 please, any color but mostly blue. Thank you and say hi to the reindeer.",
    amazonUrls: ["https://www.amazon.com/s?k=kids+sneakers+size+5"],
    amazonImageUrls: [],
    imageUrl: null,
  },
  {
    id: "demo-3",
    childFirstName: "Sofia",
    childAge: 5,
    wishNote: "deer santa. a stuffed dog pleese. a big one. i wil name him biscit.",
    amazonUrls: ["https://www.amazon.com/s?k=large+stuffed+dog+plush"],
    amazonImageUrls: [],
    imageUrl: null,
  },
];

/** Trust content kept on this page for visitors and for SEO. */
const privacyPoints: { title: string; body: string }[] = [
  {
    title: "First names only",
    body: "A donor sees a first name, an age, and a wish. Never a last name, address, school, phone number, or social handle.",
  },
  {
    title: "Admins can remove issues",
    body: "Letters go live immediately, and admins can delete anything that should not stay in the gift pool.",
  },
  {
    title: "No contact, either way",
    body: "Families and donors stay anonymous to each other. Amazon handles shipping, so addresses are never exchanged.",
  },
  {
    title: "Gifts are vetted",
    body: "Wishes have to be age-appropriate, legal, and safe. Anything else doesn't make it onto the pile.",
  },
];

export default async function LettersPage({
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
    <>
      <LettersPortal
        initialView={initialView}
        signedIn={!!user}
        defaultEmail={user?.email ?? undefined}
        defaultName={user?.name ?? undefined}
        letters={letters}
        demo={demo}
      />

      {/* Privacy & safety — kept on the page for visitors and for SEO. */}
      <section className="border-t border-line bg-paper-raised py-section text-ink">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            title="How we protect the kids"
            intro="The whole program is built so that generosity never costs a family their privacy."
            introClassName="max-w-[52ch]"
          />
          <div className="mt-10 grid gap-x-[54px] gap-y-8 sm:grid-cols-2">
            {privacyPoints.map((point) => (
              <div key={point.title} className="flex gap-4">
                <span aria-hidden className="mt-1 text-[18px] text-green">
                  ✦
                </span>
                <div>
                  <h2 className="text-[19px] font-extrabold tracking-[-0.02em] text-ink">
                    {point.title}
                  </h2>
                  <p className="mt-1.5 text-[15.5px] text-muted">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[14.5px] text-muted">
            Questions about the program? Email{" "}
            <a href={`mailto:${org.email}`} className="font-semibold text-ink underline">
              {org.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
