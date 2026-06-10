import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { ImpactStrip } from "@/components/sections/ImpactStrip";
import { DonateBand } from "@/components/sections/DonateBand";
import {
  aboutStory,
  founder,
  letters,
  links,
  org,
  programs,
  values,
  TRAINING_HREF,
} from "@/content/site";

export const metadata: Metadata = {
  title: "About · Santa's Knights",
  description:
    "Santa's Knights is a Harlem 501(c)(3) nonprofit founded by Air Force veteran Damion DiGrazia. We answer kids' letters to Santa every December and teach free martial arts and fitness all year.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Santa's Knights"
        title={
          <>
            What Santa&apos;s Knights is, and{" "}
            <em className="font-serif font-medium italic text-red">why</em>.
          </>
        }
        intro="We're a 501(c)(3) nonprofit in Harlem. We answer kids' letters to Santa every December, and teach martial arts and fitness for free all year. Damion DiGrazia started it, and still runs it."
      >
        <Button href={links.adoptLetter} variant="red" arrow>
          See Santa&apos;s Letters
        </Button>
        <Button href={links.getInvolved} variant="ghost">
          Get involved
        </Button>
      </PageHero>

      <ImpactStrip />

      {/* Mission */}
      <section className="py-section">
        <Container className="max-w-[1000px]">
          <Eyebrow className="mb-6">Our mission</Eyebrow>
          <q className="block font-serif text-quote font-medium leading-[1.3] tracking-[-0.01em] [quotes:none]">
            Santa&apos;s Knights brings <b className="font-semibold italic text-red">free</b> martial
            arts, fitness, and activities to everyone, equitably, transcending socioeconomic, racial,
            and location boundaries, positively changing children&apos;s and adults&apos; lives
            through exposure and lifestyle enhancement.
          </q>
          <div className="mt-[22px] flex items-center gap-3 text-[15px] font-semibold text-muted before:h-0.5 before:w-[34px] before:bg-gold before:content-['']">
            {org.legalName} · a registered 501(c)(3) nonprofit
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="bg-paper-raised border-y border-line py-section">
        <Container className="grid items-start gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-[54px]">
          <div className="md:sticky md:top-[110px]">
            <SectionHeading
              eyebrow="Our story"
              title="It started with a letter."
              intro="Two threads run through the organization: the giving Damion grew up doing, and the training he built as an adult. Here's how they ended up under one roof."
              introClassName="max-w-[42ch]"
            />
            <Photo
              src="/images/hero-community.jpg"
              alt="Santa's Knights members and families together"
              sizes="(min-width: 768px) 45vw, 100vw"
              className="mt-7 aspect-4/5 rounded-[20px]"
            />
          </div>
          <ol className="grid gap-6">
            {aboutStory.map((block, i) => (
              <li key={block.heading}>
                <Card className="flex gap-5 p-[30px]">
                  <span className="flex-none font-serif text-[34px] font-medium italic leading-none text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-h3">{block.heading}</h3>
                    <p className="mt-2.5 text-muted">{block.body}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Founder */}
      <section className="py-section">
        <Container className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-[54px]">
          <div className="relative">
            <Photo
              src="/images/headshot.png"
              alt={`${founder.name}, founder of Santa's Knights`}
              sizes="(min-width: 768px) 32vw, 100vw"
              className="aspect-4/5 rounded-[20px]"
            />
            <div className="absolute -bottom-5 left-4 max-w-[230px] rounded-[18px] border border-line bg-card p-[16px_20px] shadow-card md:-right-6 md:left-auto">
              <div className="text-[15px] font-extrabold text-ink">Air Force veteran</div>
              <div className="mt-0.5 text-[13.5px] font-semibold text-muted">
                Columbia &amp; Harvard · left Wall Street to build this
              </div>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="The founder"
              title={founder.name}
              intro={founder.role}
              introClassName="font-semibold text-ink"
            />
            <div className="mt-5 space-y-4 text-muted">
              {founder.bio.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <blockquote className="mt-7 border-l-2 border-red pl-5">
              <q className="font-serif text-[22px] font-medium italic leading-[1.35] text-ink [quotes:none]">
                {founder.quote}
              </q>
              <cite className="mt-3 block text-[14px] font-semibold not-italic text-muted">
                — {founder.quoteAttribution}
              </cite>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* Santa's Letters */}
      <section className="bg-paper-raised border-y border-line py-section">
        <Container>
          <div className="relative grid items-center gap-8 overflow-hidden rounded-card-lg bg-green bg-[linear-gradient(160deg,var(--color-green),#22483540)] p-[34px] text-[#eef4ef] md:grid-cols-[1.05fr_0.95fr] md:gap-[46px] md:p-[50px]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[30px] -right-5 text-[200px] leading-none text-white/[0.06]"
            >
              ✶
            </span>
            <div className="relative">
              <SectionHeading
                tone="onColor"
                size="band"
                eyebrow="Santa's Letters"
                title="The program at the heart of it"
                intro={letters.intro}
                introClassName="max-w-[44ch]"
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={links.adoptLetter} variant="cream">
                  How it works
                </Button>
                <Button href={links.getInvolved} variant="clear">
                  Help out
                </Button>
              </div>
            </div>
            <p className="relative font-serif text-[19px] italic leading-[1.5] text-[#eef4ef]/95">
              {letters.origin}
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            eyebrow="What we stand for"
            title="Four things we don't bend on"
          />
          <div className="mt-10 grid gap-[22px] sm:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title} className="p-[30px]">
                <h3 className="flex items-center gap-3 text-h3">
                  <span aria-hidden className="text-[20px] text-red">
                    ♔
                  </span>
                  {value.title}
                </h3>
                <p className="mt-2.5 text-muted">{value.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Training — overview, lives on its own site */}
      <section className="bg-paper-raised border-y border-line py-section">
        <Container className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-[54px]">
          <SectionHeading
            eyebrow="The training side"
            title="Gladiators NYC"
            intro="The other half of what we do: full-contact armored combat and fitness, taught free in Harlem. Damion started it in 2013, and it's the oldest league of its kind in the city. The schedule and booking live on its own site."
            introClassName="max-w-[46ch]"
          />
          <div>
            <div className="flex flex-wrap gap-2.5">
              {programs.map((program) => (
                <span
                  key={program.name}
                  className="rounded-pill border border-line bg-card px-4 py-2 text-[14.5px] font-semibold text-ink"
                >
                  {program.name}
                  <span className="ml-2 text-[13px] font-normal text-muted">{program.audience}</span>
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={TRAINING_HREF} variant="red" arrow>
                Go to the training site
              </Button>
              <Button href={links.contact} variant="ghost">
                Ask us a question
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
