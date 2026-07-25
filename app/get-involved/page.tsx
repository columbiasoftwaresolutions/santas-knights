import type { Metadata } from "next";
import { Arrow } from "@/components/ui/Arrow";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImpactStrip } from "@/components/sections/ImpactStrip";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { VolunteerForm } from "@/components/sections/VolunteerForm";
import { waysToGive, waysToHelp } from "@/content/site";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Get Involved · Santa's Knights",
  description:
    "Adopt a kid's letter to Santa, volunteer, or donate. Santa's Knights is a Harlem 501(c)(3); everything we run is free to the people we serve and paid for by people who chip in.",
};

/**
 * Full-bleed poster panels (one per way to help), ported from the Gladiators
 * NYC "ways to use the site" band: big title anchored to the bottom, with body
 * copy that expands into view on hover (desktop) / sits open (mobile). Recolored
 * to the three brand accents — green / red / gold — one per panel.
 */
const PANEL: Record<
  (typeof waysToHelp)[number]["variant"],
  { bg: string; hover: string; text: string; sub: string }
> = {
  green: { bg: "bg-green", hover: "hover:bg-[#284f3b]", text: "text-paper", sub: "text-paper/75" },
  red: { bg: "bg-red", hover: "hover:bg-[#a82a18]", text: "text-paper", sub: "text-paper/85" },
  gold: { bg: "bg-gold", hover: "hover:bg-[#b0841f]", text: "text-ink", sub: "text-ink/70" },
};

export default async function GetInvolvedPage() {
  const user = await getCurrentUser();

  return (
    <>
      {/* Hero — title + lede on the left, photo on the right */}
      <section className="border-b border-line bg-paper py-[clamp(56px,8vw,104px)] text-ink">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(52px,8vw,116px)] leading-[0.86] font-black tracking-[-0.04em] uppercase [&_em]:font-serif [&_em]:font-normal [&_em]:normal-case [&_em]:italic [&_em]:text-red">
                Ways to <em>take part</em>.
              </h1>
              <p className="mt-7 max-w-[46ch] text-[clamp(17px,1.6vw,20px)] leading-[1.6] text-muted">
                The most direct thing you can do is adopt a kid&apos;s letter at Christmas.
                There&apos;s plenty else too: volunteering through the year, donating, or coming to
                train yourself.
              </p>
            </div>
            <div data-reveal className="reveal-zoom">
              <Photo
                src="/images/hero-community.jpg"
                alt="Santa's Knights members of all ages together"
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="aspect-[4/3] border border-line shadow-card"
              />
            </div>
          </div>
        </Container>
      </section>

      <ImpactStrip />

      {/* Three ways in — full-bleed poster panels (GNYC pattern, brand-colored) */}
      <section className="border-y border-line">
        <div className="grid md:grid-cols-3">
          {waysToHelp.map((way) => {
            const p = PANEL[way.variant];
            return (
              <a
                key={way.title}
                href={way.href}
                className={`group relative flex min-h-[260px] flex-col justify-end overflow-hidden px-8 py-10 transition-colors duration-300 md:min-h-[58vh] md:px-12 md:py-14 ${p.bg} ${p.hover} ${p.text}`}
              >
                <h2 className="font-display text-[clamp(34px,3.4vw,52px)] font-black uppercase leading-[0.95] tracking-[-0.02em] transition-transform duration-300 group-hover:-translate-y-1">
                  {way.title}
                </h2>
                <div className="transition-all duration-300 ease-out md:max-h-0 md:translate-y-2 md:overflow-hidden md:opacity-0 md:group-hover:max-h-52 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <p className={`mt-4 max-w-[34ch] text-[15px] leading-7 md:mt-5 ${p.sub}`}>
                    {way.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em]">
                    {way.cta} <Arrow />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Volunteer application */}
      <section id="volunteer" className="scroll-mt-24 bg-paper-raised border-y border-line py-section">
        <Container className="grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-[54px]">
          <div data-reveal className="md:sticky md:top-[110px]">
            <SectionHeading
              title="Apply to volunteer"
              intro="Tell us who you are and where you'd like to help. Pick as many roles as you're open to — we'll follow up about what fits."
              introClassName="max-w-[44ch]"
            />
          </div>

          <div data-reveal style={{ transitionDelay: "120ms" }}>
            <Card className="p-[34px]">
              <VolunteerForm
                defaultName={user?.name}
                defaultEmail={user?.email}
                defaultPhone={user?.phone}
              />
            </Card>
          </div>
        </Container>
      </section>

      {/* Ways to give */}
      <section id="give" className="scroll-mt-24 py-section">
        <Container>
          <div data-reveal>
            <SectionHeading
              className="max-w-[640px]"
              title="Where your money goes"
              intro="We're a 501(c)(3), so every gift is tax-deductible. It pays for the holiday presents, the free classes, and the events that keep the neighborhood showing up."
              introClassName="max-w-[52ch]"
            />
          </div>
          <div data-reveal className="mt-10 border-t border-line">
            {waysToGive.map((way) => (
              <a
                key={way.label}
                href={way.href}
                className="group grid gap-2 border-b border-line py-6 transition-colors hover:bg-paper-raised sm:grid-cols-[220px_1fr_auto] sm:items-center"
              >
                <span className="font-display text-[21px] font-black uppercase tracking-[-0.02em] text-ink">
                  {way.label}
                </span>
                <span className="max-w-[58ch] text-[15.5px] text-muted">{way.body}</span>
                <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.04em] text-red">
                  {way.cta} <Arrow />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-section">
        <Container>
          <div data-reveal>
            <Card
              tone="goldSoft"
              className="grid items-center gap-8 p-[38px] md:grid-cols-[1.1fr_0.9fr] md:p-[46px]"
            >
              <SectionHeading
                title="News, and ways to help"
                intro="We send occasional updates about the letter drive, events, and volunteer needs."
              />
              <NewsletterForm defaultEmail={user?.email} />
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
