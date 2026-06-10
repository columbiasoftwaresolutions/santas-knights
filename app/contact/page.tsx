import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { faqs, links, org, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact · Santa's Knights",
  description:
    "Get in touch with Santa's Knights in Harlem. Visit us at the Manhattanville Community Center, call (212) 873-5818, or send a message about classes, volunteering, or donating.",
};

const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(org.mapsQuery)}&output=embed`;
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

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
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
              eyebrow="Send a message"
              title="Drop us a line"
              intro="We read everything that comes in and usually write back within a few days. If it's about Santa's Letters, say so and we'll get you the details."
              introClassName="max-w-[46ch]"
            />
            <ContactForm />
          </div>

          <Card className="p-[34px]">
            <h2 className="text-h3">Reach us directly</h2>
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
              <DetailRow label="Training schedule">
                On the training site
                <span className="mt-1 block text-[14px] font-normal text-muted">
                  Classes run several days a week. The current schedule and booking live there.
                </span>
              </DetailRow>
            </div>

            <div className="mt-6">
              <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
                Follow along
              </div>
              <div className="mt-3 flex gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="grid h-10 w-10 place-items-center rounded-full bg-ink text-[14px] text-paper transition-colors hover:bg-red"
                  >
                    <span aria-hidden>{social.glyph}</span>
                  </a>
                ))}
              </div>
            </div>

            <p className="mt-6 flex items-center gap-2 rounded-[14px] bg-green-soft px-4 py-3 text-[14px] font-semibold text-green">
              <span aria-hidden>♥</span>
              501(c)(3) nonprofit · every class is 100% free
            </p>
          </Card>
        </Container>
      </section>

      {/* Map */}
      <section className="border-y border-line bg-paper-raised">
        <Container className="py-section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Find us"
              title="Manhattanville Community Center, Harlem"
              intro="We're at 530 West 133rd Street, between Broadway and Amsterdam."
              introClassName="max-w-[46ch]"
            />
            <Button href={mapLink} variant="ghost" className="px-5 py-3 text-[15px]">
              Get directions ↗
            </Button>
          </div>
          <div className="mt-8 overflow-hidden rounded-card border border-line shadow-card">
            <iframe
              title={`Map to ${org.venue}`}
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[420px] w-full border-0"
            />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-section">
        <Container className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-[54px]">
          <div className="md:sticky md:top-[110px]">
            <SectionHeading
              eyebrow="Before you ask"
              title="Common questions"
              intro="If it's not here, send a message above and we'll sort it out."
              introClassName="max-w-[40ch]"
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={links.adoptLetter} variant="red" arrow>
                Santa&apos;s Letters
              </Button>
              <Button href={links.getInvolved} variant="ghost">
                Get involved
              </Button>
            </div>
          </div>
          <dl className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.q} className="p-[26px]">
                <dt className="flex gap-3 text-[18px] font-extrabold tracking-[-0.02em] text-ink">
                  <span aria-hidden className="text-red">
                    ?
                  </span>
                  {faq.q}
                </dt>
                <dd className="mt-2 pl-[22px] text-muted">{faq.a}</dd>
              </Card>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
