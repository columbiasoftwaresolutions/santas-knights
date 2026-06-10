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
  links,
  missionStatement,
  org,
  programs,
  values,
  GLADIATORS_HREF,
} from "@/content/site";

export const metadata: Metadata = {
  title: "About · Santa's Knights",
  description:
    "Santa's Knights is a 501(c)(3) nonprofit founded by Air Force veteran Damion DiGrazia, bringing free martial arts, fitness, and community to Harlem. Home of Gladiators NYC.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Santa's Knights"
        title={
          <>
            Strength, purpose, and belonging, <em className="font-serif font-medium italic text-red">given away</em> for free.
          </>
        }
        intro="We're a Harlem-based 501(c)(3) nonprofit bringing free martial arts, fitness, and community to everyone, and the home of Gladiators NYC, the city's oldest armored combat league."
      >
        <Button href={GLADIATORS_HREF} variant="red" arrow>
          Find a free class
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
            {org.legalName} · 501(c)(3) nonprofit · {org.trademark}
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="bg-paper-raised border-y border-line py-section">
        <Container className="grid items-start gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-[54px]">
          <div className="md:sticky md:top-[110px]">
            <SectionHeading
              eyebrow="Our story"
              title="How a fighting sport became a free program for Harlem"
              intro="What started as a niche combat club grew into a nonprofit built on one belief: the things that change a life shouldn't depend on what you can pay."
              introClassName="max-w-[42ch]"
            />
            <Photo
              src="/images/gladiators-sparring.jpg"
              alt="Gladiators NYC fighters sparring in full armor"
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
              alt={`${founder.name}, founder of Santa's Knights and Gladiators NYC`}
              sizes="(min-width: 768px) 32vw, 100vw"
              className="aspect-4/5 rounded-[20px]"
            />
            <div className="absolute -bottom-5 left-4 max-w-[230px] rounded-[18px] border border-line bg-card p-[16px_20px] shadow-card md:-right-6 md:left-auto">
              <div className="text-[15px] font-extrabold text-ink">U.S. Air Force veteran</div>
              <div className="mt-0.5 text-[13.5px] font-semibold text-muted">
                Columbia &amp; Harvard · ex-Morgan Stanley · founder of armored combat in NYC
              </div>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Meet the founder"
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

      {/* Values */}
      <section className="bg-paper-raised border-y border-line py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            eyebrow="What we stand for"
            title="The values behind every free class"
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

      {/* Programs */}
      <section className="py-section">
        <Container>
          <SectionHeading
            className="max-w-[680px]"
            eyebrow="Free programs"
            title="Classes for every age and level"
            intro="All taught free at the Manhattanville Community Center in Harlem. Gladiators NYC is our flagship combat program; the full steel experience lives on its own site."
            introClassName="max-w-[52ch]"
          />
          <div className="mt-10 grid gap-[18px] md:grid-cols-3">
            {programs.map((program) => (
              <Card key={program.name} className="flex flex-col p-[26px]">
                <span className="self-start rounded-pill bg-green-soft px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-green">
                  {program.audience}
                </span>
                <h3 className="mt-3.5 text-[20px] font-extrabold tracking-[-0.02em]">
                  {program.name}
                </h3>
                <p className="mt-2 text-[15.5px] text-muted">{program.body}</p>
              </Card>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={GLADIATORS_HREF} variant="red" arrow>
              Enter Gladiators NYC
            </Button>
            <Button href={links.contact} variant="ghost">
              Ask about the schedule
            </Button>
          </div>
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
