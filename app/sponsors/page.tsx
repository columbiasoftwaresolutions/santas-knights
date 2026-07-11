import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { Press } from "@/components/sections/Press";
import { org, sponsors } from "@/content/site";

export const metadata: Metadata = {
  title: "Sponsors · Santa's Knights",
  description:
    "Meet the sponsors who help keep Santa's Knights free and learn how your business can help.",
};

const tiers: { title: string; body: string }[] = [
  {
    title: "Back the letter drive",
    body: "Cover gifts and shipping for a batch of letters in December. The most visible season of the year, with press and social reach to match.",
  },
  {
    title: "Sponsor a season of classes",
    body: "Cover equipment, space, and insurance for a session of free training.",
  },
  {
    title: "Sponsor an event",
    body: "Put your name on the holiday gift event or a public demo. Family crowds, cameras, and a story worth being part of.",
  },
];

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        title={
          <>
            The people who <em className="font-serif font-medium italic text-red">make it free</em>.
          </>
        }
        intro="Santa's Knights programs are free to participants. Business sponsors help pay for gifts, classes, equipment, and events."
      >
        <Button
          href={`mailto:${org.email}?subject=Sponsoring%20Santa%27s%20Knights`}
          variant="red"
          arrow
        >
          Become a sponsor
        </Button>
      </PageHero>

      {/* Sponsor logo grid */}
      <section className="py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            title="Thank you"
            intro="Organizations currently backing the programs."
          />
          <div className="mt-10 grid grid-cols-2 gap-[18px] sm:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((sponsor) => {
              const tile = (
                <Card
                  hover
                  className="group flex h-[120px] items-center justify-center p-6"
                  key={sponsor.name}
                  {...(sponsor.href ? { href: sponsor.href } : {})}
                >
                  {sponsor.logo ? (
                    // Logos come from Supabase Storage (remote) or /public; plain img avoids remote-domain config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-[52px] w-auto object-contain opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-center text-[15.5px] font-extrabold tracking-[-0.01em] text-ink">
                      {sponsor.name}
                    </span>
                  )}
                </Card>
              );
              return tile;
            })}
            {/* Standing invitation slot */}
            <a
              href={`mailto:${org.email}?subject=Sponsoring%20Santa%27s%20Knights`}
              className="flex h-[120px] items-center justify-center border-[1.5px] border-dashed border-gold bg-gold-soft/40 p-6 text-center text-[14.5px] font-bold text-[#8a6420] transition-colors duration-150"
            >
              Sponsor Santa&apos;s Knights
            </a>
          </div>
        </Container>
      </section>

      {/* Ways to sponsor */}
      <section className="border-y border-line bg-paper-raised py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            title="Ways a business can help"
            intro="Sponsors can support the letter drive, a class season, or a public event. Sponsorships are tax-deductible and publicly recognized."
            introClassName="max-w-[54ch]"
          />
          <div className="mt-10 grid gap-[22px] md:grid-cols-3">
            {tiers.map((tier) => (
              <Card key={tier.title} hover className="p-[32px]">
                <span aria-hidden className="mb-5 block h-1 w-12 bg-gold" />
                <h2 className="text-h3 text-ink">{tier.title}</h2>
                <p className="mt-2.5 text-ink/80">{tier.body}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              href={`mailto:${org.email}?subject=Sponsoring%20Santa%27s%20Knights`}
              variant="ink"
              arrow
            >
              Email {org.email}
            </Button>
            <span className="text-[14.5px] text-muted">
              Or call {org.phone} to discuss a sponsorship.
            </span>
          </div>
        </Container>
      </section>

      <Press />
    </>
  );
}
