import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { ImpactStrip } from "@/components/sections/ImpactStrip";
import { DonateBand } from "@/components/sections/DonateBand";
import { aboutStory, founder, letters, links, org, programs, values } from "@/content/site";

export const metadata: Metadata = {
  title: "About · Santa's Knights",
  description:
    "Santa's Knights is a Harlem 501(c)(3) nonprofit. We answer kids' letters to Santa every December and teach free martial arts and fitness all year.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={
          <>
            What Santa&apos;s Knights is, and{" "}
            <em className="font-serif font-medium italic text-red">why</em>.
          </>
        }
        media={
          <Photo
            src="/images/gallery/6b7494_da7cab87beee4becb1fa08dd5b8bb6b9_mv2.webp"
            alt="Kids training with foam weapons in the gym at a Santa's Knights class"
            sizes="(min-width: 1024px) 32vw, 100vw"
            className="aspect-[5/4]"
          />
        }
        intro="We're a 501(c)(3) nonprofit in Harlem. We answer kids' letters to Santa every December, and teach martial arts and fitness for free all year."
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
          <q className="block font-serif text-quote font-medium leading-[1.3] tracking-[-0.01em] [quotes:none]">
            Santa&apos;s Knights brings <b className="font-semibold italic text-red">free</b>{" "}martial
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
              title="It started with a letter."
              intro="Two threads run through the organization: the giving Damion grew up doing, and the training he built as an adult. Here's how they ended up under one roof."
              introClassName="max-w-[42ch]"
            />
            <Photo
              src="/images/hero-community.jpg"
              alt="Santa's Knights members and families together"
              sizes="(min-width: 768px) 45vw, 100vw"
              className="mt-7 aspect-4/5"
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
                    <h3 className="text-h3 text-ink">{block.heading}</h3>
                    <p className="mt-2.5 text-ink/80">{block.body}</p>
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
              className="aspect-4/5"
            />
          </div>
          <div>
            <SectionHeading
              title={founder.name}
              intro={founder.role}
              introClassName="font-semibold text-ink"
            />
            <div className="mt-5 space-y-4 text-muted">
              {founder.bio.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Santa's Letters */}
      <section className="bg-paper-raised border-y border-line py-section">
        <Container>
          <div className="grid items-center gap-8 overflow-hidden bg-green p-[34px] text-[#eef4ef] md:grid-cols-[1.05fr_0.95fr] md:gap-[46px] md:p-[50px]">
            <div>
              <SectionHeading
                tone="onColor"
                size="band"
                title="Our holiday letter program"
                intro={letters.intro}
                introClassName="max-w-[44ch]"
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={links.adoptLetter} variant="cream">
                  How it works
                </Button>
                <Button href={links.getInvolved} variant="clear">
                  Volunteer
                </Button>
              </div>
            </div>
            <p className="font-serif text-[19px] italic leading-[1.5] text-[#eef4ef]/95">
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

      {/* Training overview */}
      <section className="bg-paper-raised border-y border-line py-section">
        <Container className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-[54px]">
          <SectionHeading
            title="Gladiators NYC"
            intro="The other half of what we do: full-contact armored combat and fitness, taught free in Harlem. Damion started it in 2013, and it's the oldest league of its kind in the city. Class pages and booking live on gladiators.nyc."
            introClassName="max-w-[46ch]"
          />
          <div>
            <div className="grid border-t border-line sm:grid-cols-2">
              {programs.map((program) => (
                <div
                  key={program.name}
                  className="border-r border-b border-line bg-card px-4 py-3 text-[14.5px] font-semibold text-ink even:border-r-0"
                >
                  {program.name}
                  <span className="ml-2 text-[13px] font-normal text-muted">{program.audience}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={links.training} variant="red" arrow>
                See the classes
              </Button>
              <Button href={links.online} variant="ghost">
                Online classes
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
