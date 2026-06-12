import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { letters, links, org } from "@/content/site";

export const metadata: Metadata = {
  title: "Santa's Letters · Santa's Knights",
  description:
    "Kids write to Santa. We protect their identities and post the wishes so anyone can adopt a letter and send the gift. Submit a letter or grant a wish.",
};

const privacyPoints: { title: string; body: string }[] = [
  {
    title: "First names only",
    body: "A donor sees a first name, an age, and a wish. Never a last name, address, school, phone number, or social handle.",
  },
  {
    title: "Every letter is reviewed",
    body: "A real person checks each submission before it goes live, and anything identifying gets taken off first.",
  },
  {
    title: "No contact, either way",
    body: "Families and donors stay anonymous to each other. Gifts route through Amazon — nobody exchanges addresses with a stranger.",
  },
  {
    title: "Gifts are vetted",
    body: "Wishes have to be age-appropriate, legal, and safe. Anything else doesn't make it onto the pile.",
  },
];

export default function LettersLandingPage() {
  return (
    <>
      <PageHero
        eyebrow={letters.eyebrow}
        title={
          <>
            Every kid deserves an{" "}
            <em className="font-serif font-medium italic text-red">answer</em>.
          </>
        }
        intro={letters.intro}
      >
        <Button href={links.adoptLetter} variant="red" arrow>
          Adopt a letter
        </Button>
        <Button href={links.submitLetter} variant="ghost">
          Submit your child&apos;s letter
        </Button>
      </PageHero>

      {/* How it works */}
      <section className="py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            eyebrow="How it works"
            title="Three steps, start to finish"
          />
          <div className="mt-10 grid gap-[22px] md:grid-cols-3">
            {letters.steps.map((step, index) => (
              <Card key={step.title} className="p-[32px]">
                <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-green-soft text-[17px] font-extrabold text-green">
                  {index + 1}
                </span>
                <h2 className="mt-5 text-h3">{step.title}</h2>
                <p className="mt-2.5 text-muted">{step.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Two doors: families / donors */}
      <section className="border-y border-line bg-paper-raised py-section">
        <Container className="grid gap-[22px] md:grid-cols-2">
          <Card hover className="flex flex-col p-[34px]">
            <span aria-hidden className="mb-5 block h-1 w-12 rounded-pill bg-green" />
            <SectionHeading
              size="h3"
              eyebrow="For families"
              eyebrowClassName="text-green"
              title="Send us your child's letter"
              intro="A parent or guardian submits on the child's behalf: a photo of the handwritten letter, their first name and age, and a link to the gift on Amazon. No account needed. We review it, protect their identity, and put the wish up for adoption."
            />
            <div className="mt-6 flex-1" />
            <div>
              <Button href={links.submitLetter} variant="green" arrow>
                Submit a letter
              </Button>
            </div>
          </Card>
          <Card hover className="flex flex-col p-[34px]">
            <span aria-hidden className="mb-5 block h-1 w-12 rounded-pill bg-red" />
            <SectionHeading
              size="h3"
              eyebrow="For gift-givers"
              title="Adopt a wish"
              intro="Flip through the letters one at a time, the way Damion once picked one off a pile. When one gets you, swipe right and buy the gift on Amazon — it ships to us, the child stays anonymous, and you've made a Christmas."
            />
            <div className="mt-6 flex-1" />
            <div>
              <Button href={links.adoptLetter} variant="red" arrow>
                Start reading letters
              </Button>
            </div>
          </Card>
        </Container>
      </section>

      {/* Origin story */}
      <section className="py-section">
        <Container className="grid items-center gap-10 md:grid-cols-[1fr_1fr] md:gap-[54px]">
          <div>
            <SectionHeading
              eyebrow="Where it comes from"
              title="An idea older than any of us"
              intro={letters.origin}
              introClassName="max-w-[54ch]"
            />
          </div>
          <Photo
            src="/images/hero-community.jpg"
            alt="Santa's Knights volunteers and families at the holiday gift event"
            sizes="(min-width: 768px) 45vw, 100vw"
            className="aspect-[4/3] rounded-card"
          />
        </Container>
      </section>

      {/* Privacy & safety */}
      <section className="border-y border-line bg-paper-raised py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            eyebrow="Privacy & safety"
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
                  <h2 className="text-[19px] font-extrabold tracking-[-0.02em]">{point.title}</h2>
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

      {/* Closing CTA band */}
      <section className="py-section">
        <Container>
          <div className="relative overflow-hidden rounded-card-lg bg-green bg-[linear-gradient(160deg,var(--color-green),#22483540)] p-[40px] text-center text-[#eef4ef] md:p-[56px]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[30px] -right-5 text-[200px] leading-none text-white/[0.06]"
            >
              ✶
            </span>
            <h2 className="mx-auto max-w-[24ch] text-h2-band text-white">
              One letter. One gift. One very good morning.
            </h2>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button href={links.adoptLetter} variant="cream" arrow>
                Adopt a letter
              </Button>
              <Button href={links.submitLetter} variant="clear">
                Submit a letter
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
