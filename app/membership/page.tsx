import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { DonateBand } from "@/components/sections/DonateBand";
import { membershipTiers, links, org } from "@/content/site";

export const metadata: Metadata = {
  title: "Membership · Santa's Knights",
  description:
    "Six membership tiers, from free class registration to corporate sponsorship. Paid memberships help fund gifts, equipment, and classes.",
};

export default function MembershipPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Be part of something{" "}
            <em className="font-serif font-medium italic text-red">bigger</em>.
          </>
        }
        intro="Choose free class registration or a paid membership that funds gifts, equipment, and classes."
      >
        <Button href={links.donate} variant="red" arrow>
          Donate instead
        </Button>
        <Button href={links.adoptLetter} variant="ghost">
          Adopt a letter
        </Button>
      </PageHero>

      {/* Membership tiers */}
      <section className="py-section">
        <Container>
          <SectionHeading
            title="Choose a membership"
            intro="The free tier gives you access to class registration. Paid tiers fund gifts, foam swords, equipment, and program costs."
            introClassName="max-w-[56ch]"
          />

          <div className="mt-10 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {membershipTiers.map((tier) => (
              <Card
                key={tier.name}
                hover
                className="flex flex-col p-[30px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`text-[11px] font-bold tracking-[0.14em] uppercase ${tier.isFree ? "text-green" : "text-red"}`}>
                    {tier.isFree ? "Free" : "Monthly"}
                  </span>
                  <span className="text-[22px] font-black tracking-[-0.03em] text-ink">
                    {tier.priceLabel}
                  </span>
                </div>
                <h2 className="mt-3 text-[19px] font-extrabold tracking-[-0.02em]">
                  {tier.name}
                </h2>
                <p className="mt-2 flex-1 text-[15px] text-muted">{tier.description}</p>
                <div className="mt-6">
                  <Button
                    href={tier.href}
                    variant={tier.isFree ? "green" : "red"}
                    arrow={!tier.isFree}
                    className="w-full justify-center px-5 py-3 text-[14.5px]"
                  >
                    {tier.ctaLabel}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-center text-[13.5px] text-muted">
            Paid membership links go to our external payment processor.{" "}
            <a href={`mailto:${org.email}`} className="font-semibold text-ink underline">
              Email us
            </a>{" "}
            if you have questions about your tier.
          </p>
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
