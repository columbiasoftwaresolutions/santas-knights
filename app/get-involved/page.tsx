import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { PageHero } from "@/components/sections/PageHero";
import { links, volunteerRoles, waysToGive, waysToHelp } from "@/content/site";

export const metadata: Metadata = {
  title: "Get Involved · Santa's Knights",
  description:
    "Adopt a kid's letter to Santa, volunteer, or donate. Santa's Knights is a Harlem 501(c)(3); everything we run is free to the people we serve and paid for by people who chip in.",
};

/** Accent classes per "way to help" card, keeping color roles consistent. */
const ACCENT: Record<(typeof waysToHelp)[number]["variant"], { chip: string; rule: string }> = {
  red: { chip: "bg-red/10 text-red", rule: "bg-red" },
  green: { chip: "bg-green-soft text-green", rule: "bg-green" },
  gold: { chip: "bg-gold-soft text-[#8a6420]", rule: "bg-gold" },
};

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title={
          <>
            Ways to <em className="font-serif font-medium italic text-red">help out</em>.
          </>
        }
        intro="The most direct thing you can do is adopt a kid's letter at Christmas. There's plenty else too: volunteering through the year, donating, or coming to train yourself."
      >
        <Button href={links.adoptLetter} variant="red" arrow>
          Adopt a letter
        </Button>
        <Button href="#volunteer" variant="ghost">
          Volunteer
        </Button>
      </PageHero>

      {/* Three ways to help */}
      <section className="py-section">
        <Container className="grid gap-[22px] md:grid-cols-3">
          {waysToHelp.map((way) => (
            <Card key={way.title} hover className="flex flex-col p-[32px]">
              <span
                aria-hidden
                className={`mb-5 h-1 w-12 rounded-pill ${ACCENT[way.variant].rule}`}
              />
              <Eyebrow
                className={
                  way.variant === "green"
                    ? "text-green"
                    : way.variant === "gold"
                      ? "text-gold"
                      : "text-red"
                }
              >
                {way.eyebrow}
              </Eyebrow>
              <h2 className="mt-3 text-h3">{way.title}</h2>
              <p className="mt-2.5 flex-1 text-muted">{way.body}</p>
              <div className="mt-6">
                <Button
                  href={way.href}
                  variant={way.variant === "green" ? "green" : way.variant === "gold" ? "ink" : "red"}
                  arrow
                >
                  {way.cta}
                </Button>
              </div>
            </Card>
          ))}
        </Container>
      </section>

      {/* Volunteer roles */}
      <section id="volunteer" className="scroll-mt-24 bg-paper-raised border-y border-line py-section">
        <Container className="grid items-start gap-10 md:grid-cols-[1fr_1fr] md:gap-[54px]">
          <div className="md:sticky md:top-[110px]">
            <SectionHeading
              eyebrow="Volunteer"
              title="You don't have to fight to be useful"
              intro="People sort the holiday letters, run the gift event, keep the books, handle the social accounts, and coach classes. Pick what fits. Most of it works around a job."
              introClassName="max-w-[44ch]"
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={links.contact} variant="ink" arrow>
                Apply to volunteer
              </Button>
              <Button href={links.donate} variant="ghost">
                Or donate instead
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-[14.5px] text-muted">
              <span aria-hidden className="text-green">
                ♥
              </span>
              Most roles ask for time, not experience.
            </p>
          </div>

          <Card className="p-[34px]">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">
              Roles we&apos;re looking for
            </h3>
            <ul className="mt-5 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {volunteerRoles.map((role) => (
                <li
                  key={role}
                  className="flex items-center gap-3 border-b border-line py-3 text-[15.5px] font-semibold text-ink last:border-b-0"
                >
                  <span aria-hidden className="text-red">
                    ✦
                  </span>
                  {role}
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>

      {/* Letters to Santa highlight */}
      <section className="py-section">
        <Container>
          <div className="relative grid items-center gap-8 overflow-hidden rounded-card-lg bg-green bg-[linear-gradient(160deg,var(--color-green),#22483540)] p-[34px] text-[#eef4ef] md:grid-cols-[1.1fr_0.9fr] md:gap-[46px] md:p-[50px]">
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
                title="Adopt a letter this December"
                intro="Pick a kid's wish off the pile and send the gift they asked for. We keep the child's details private the whole way through. You just make sure the present shows up."
                introClassName="max-w-[42ch]"
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={links.adoptLetter} variant="cream">
                  How it works
                </Button>
                <Button href={links.contact} variant="clear">
                  Help sort letters
                </Button>
              </div>
            </div>
            <Photo
              src="/images/hero-community.jpg"
              alt="Santa's Knights members of all ages together"
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[4/3] rounded-2xl"
            />
          </div>
        </Container>
      </section>

      {/* Ways to give */}
      <section id="give" className="scroll-mt-24 bg-paper-raised border-y border-line py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            eyebrow="Donate"
            title="Where your money goes"
            intro="We're a 501(c)(3), so every gift is tax-deductible. It pays for the holiday presents, the free classes, and the events that keep the neighborhood showing up."
            introClassName="max-w-[52ch]"
          />
          <div className="mt-10 grid gap-[18px] md:grid-cols-3">
            {waysToGive.map((way) => (
              <Card key={way.label} className="flex flex-col p-[28px]">
                <h3 className="text-[20px] font-extrabold tracking-[-0.02em]">{way.label}</h3>
                <p className="mt-2 flex-1 text-[15.5px] text-muted">{way.body}</p>
                <div className="mt-5">
                  <Button href={way.href} variant="ghost" className="px-5 py-3 text-[15px]">
                    {way.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-section">
        <Container>
          <Card tone="goldSoft" className="grid items-center gap-8 p-[38px] md:grid-cols-[1.1fr_0.9fr] md:p-[46px]">
            <SectionHeading
              eyebrow="Stay in the loop"
              eyebrowClassName="text-gold"
              title="News, and ways to help"
              intro="A short email when there's something worth passing on, like the letter drive opening. We don't send much."
            />
            <NewsletterForm />
          </Card>
        </Container>
      </section>
    </>
  );
}
