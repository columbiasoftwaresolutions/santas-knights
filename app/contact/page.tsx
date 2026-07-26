import type { Metadata } from "next";
import { Arrow } from "@/components/ui/Arrow";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { PageHero } from "@/components/sections/PageHero";
import { VolunteerForm } from "@/components/sections/VolunteerForm";
import { org, waysToHelp } from "@/content/site";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Contact · Santa's Knights",
  description:
    "Get in touch with Santa's Knights in Harlem, or find a way to help — volunteer, adopt a letter, or give. Visit us at the Manhattanville Community Center or call (212) 873-5818.",
};

const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org.mapsQuery)}`;

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-4 last:border-b-0">
      <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className="mt-1 text-[16px] font-semibold text-ink">{children}</div>
    </div>
  );
}

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

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageHero
        title={
          <>
            Get in <em className="font-serif font-medium italic text-red">touch</em>.
          </>
        }
        intro="Adopting a letter, volunteering, donating, or asking about training? Send a message, give us a call, or stop by in Harlem."
      />

      {/* Form + details */}
      <section className="py-section">
        <Container className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-[54px]">
          <div>
            <SectionHeading
              className="mb-8"
              title="Drop us a line"
              intro="We read everything that comes in and usually write back within a few days. If it's about Santa's Letters, say so and we'll get you the details."
              introClassName="max-w-[46ch]"
            />
            <ContactForm defaultName={user?.name} defaultEmail={user?.email} />
          </div>

          <Card className="p-[34px]">
            <h2 className="text-h3 text-ink">Reach us directly</h2>
            <div className="mt-4">
              <DetailRow label="Visit">
                <a href={mapLink} className="transition-colors hover:text-red">
                  {org.venue}
                  <br />
                  {org.address1}
                  <br />
                  {org.address2}
                </a>
              </DetailRow>
              <DetailRow label="Call">
                <a href={org.phoneHref} className="transition-colors hover:text-red">
                  {org.phone}
                </a>
              </DetailRow>
              <DetailRow label="Email">
                <a href={`mailto:${org.email}`} className="transition-colors hover:text-red">
                  {org.email}
                </a>
              </DetailRow>
            </div>

            <div className="mt-6">
              <Photo
                src="/images/hero-community.jpg"
                alt="Santa's Knights members of all ages together"
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="aspect-[4/3] border border-line"
              />
            </div>
          </Card>
        </Container>
      </section>

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
          <div className="md:sticky md:top-[110px]">
            <SectionHeading
              title="Apply to volunteer"
              intro="Tell us who you are and where you'd like to help. Pick as many roles as you're open to — we'll follow up about what fits."
              introClassName="max-w-[44ch]"
            />
          </div>

          <div>
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

      {/* Newsletter */}
      <section className="py-section">
        <Container>
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
        </Container>
      </section>
    </>
  );
}
