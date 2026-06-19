import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { SubmitLetterForm } from "@/components/letters/SubmitLetterForm";
import { giftGuidance, privacyInstruction } from "@/content/site";

export const metadata: Metadata = {
  title: "Write a Letter · Santa's Letters · Santa's Knights",
  description:
    "Parents and guardians: submit your child's letter to Santa. We review every letter, protect the child's identity, and post the wish so a donor can send the gift.",
};

const expectations: { title: string; body: string }[] = [
  {
    title: "You submit, we review",
    body: "Every letter is checked by a real person before it appears anywhere. We'll email you if something needs a tweak.",
  },
  {
    title: "Identity stays private",
    body: "Donors only ever see a first name, an age, the wish, and the letter itself. Everything else stays with us.",
  },
  {
    title: "Gifts come via Amazon",
    body: "Donors buy from the link you provide. We never handle the money, and nobody gets anyone's address.",
  },
];

export default function SubmitLetterPage() {
  return (
    <>
      <PageHero
        eyebrow="Write a Letter"
        title={
          <>
            Send us your child&apos;s{" "}
            <em className="font-serif font-medium italic text-red">letter</em>.
          </>
        }
        intro="This form is for parents and guardians. It takes about five minutes: a photo of the handwritten letter, the wish, and an Amazon link for the gift. No account needed."
      />

      <section className="py-section">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.62fr_0.38fr] lg:gap-[54px]">
          <Card className="p-[34px] md:p-[42px]">
            <SubmitLetterForm />
          </Card>

          <div className="grid gap-7 lg:sticky lg:top-[110px]">
            {/* Per-gift value guidance (Plan v2 §C1/E5) */}
            <div className="rounded-card border border-green/30 bg-green-soft/40 p-6 text-[14.5px] text-[#1f4a2f]">
              <strong className="font-extrabold">Gift value guidance:</strong>{" "}
              {giftGuidance.submit}
            </div>

            {/* Privacy instruction (Plan v2 §E5) */}
            <div className="rounded-card border border-red/20 bg-red/5 p-6 text-[14.5px] text-[#6b1a1a]">
              <strong className="font-extrabold">Privacy reminder:</strong>{" "}
              {privacyInstruction}
            </div>

            {expectations.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span aria-hidden className="mt-1 text-[18px] text-green">
                  ✦
                </span>
                <div>
                  <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">{item.title}</h2>
                  <p className="mt-1 text-[15px] text-muted">{item.body}</p>
                </div>
              </div>
            ))}
            <div className="rounded-card border border-line bg-gold-soft/50 p-6 text-[14.5px] text-[#6c5418]">
              <strong className="font-extrabold">Before you upload:</strong>{" "}check the letter
              photo for identifying details such as last names, addresses, school names, or phone
              numbers. Crop or cover them before uploading. We will check the image again during review.
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
