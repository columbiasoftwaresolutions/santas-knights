import type { Metadata } from "next";
import Image from "next/image";
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
    "The sponsors who keep Santa's Knights free — and how your business can back the letter drive, the classes, or a season.",
};

const tiers: { title: string; body: string }[] = [
  {
    title: "Back the letter drive",
    body: "Cover gifts and shipping for a batch of letters in December. The most visible season of the year, with press and social reach to match.",
  },
  {
    title: "Sponsor a season of classes",
    body: "Keep the training free for a session of participants — equipment, space, and insurance for the program that runs all year.",
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
        eyebrow="Sponsors"
        title={
          <>
            The people who <em className="font-serif font-medium italic text-red">make it free</em>.
          </>
        }
        intro="Everything Santa's Knights runs is free to the people we serve. Sponsors are a big part of why. If your business wants Harlem kids to wake up to presents and train for free all year, we'd love to talk."
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
            eyebrow="Our sponsors"
            title="Thank you"
            intro="Organizations currently backing the programs."
          />
          <div className="mt-10 grid grid-cols-2 gap-[18px] sm:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((sponsor) => {
              const tile = (
                <Card
                  hover
                  className="flex h-[120px] items-center justify-center p-6"
                  key={sponsor.name}
                  {...(sponsor.href ? { href: sponsor.href } : {})}
                >
                  {sponsor.logo ? (
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={180}
                      height={60}
                      className="h-[52px] w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
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
              className="flex h-[120px] items-center justify-center rounded-card border-[1.5px] border-dashed border-gold bg-gold-soft/40 p-6 text-center text-[14.5px] font-bold text-[#8a6420] transition-transform duration-150 hover:-translate-y-0.5"
            >
              Your logo here — sponsor us
            </a>
          </div>
        </Container>
      </section>

      {/* Ways to sponsor */}
      <section className="border-y border-line bg-paper-raised py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            eyebrow="Sponsorship"
            title="Ways a business can help"
            intro="Sponsorships are flexible — these are the shapes they usually take. All of it is tax-deductible, and all of it gets publicly thanked."
            introClassName="max-w-[54ch]"
          />
          <div className="mt-10 grid gap-[22px] md:grid-cols-3">
            {tiers.map((tier) => (
              <Card key={tier.title} hover className="p-[32px]">
                <span aria-hidden className="mb-5 block h-1 w-12 rounded-pill bg-gold" />
                <h2 className="text-h3">{tier.title}</h2>
                <p className="mt-2.5 text-muted">{tier.body}</p>
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
              Or call {org.phone} — we&apos;ll put a package together.
            </span>
          </div>
        </Container>
      </section>

      <Press />
    </>
  );
}
