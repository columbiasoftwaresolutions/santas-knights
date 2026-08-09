import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { DonateBand } from "@/components/sections/DonateBand";
import { membershipTiers, org } from "@/content/site";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Membership · Santa's Knights",
  description:
    "Six membership tiers, from free class registration to corporate sponsorship. Paid memberships help fund gifts, equipment, and classes.",
};

export default function MembershipPage() {
  return (
    <>
      <section className="border-b border-line bg-paper py-[clamp(38px,5vw,66px)] text-ink">
        <Container>
          <header className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
            <h1 className="font-display text-[clamp(42px,6vw,82px)] leading-[0.88] font-black tracking-[-0.04em] uppercase">
              Membership
            </h1>
            <div className="max-w-[38rem] lg:justify-self-end">
              <p className="text-[clamp(17px,1.45vw,20px)] leading-[1.55] text-muted">
                Classes stay free. Paid memberships put gifts and equipment directly into kids&apos; hands.
              </p>
            </div>
          </header>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {membershipTiers.map((tier) => (
              <Card
                key={tier.name}
                hover
                className={cn(
                  "relative flex min-h-[250px] flex-col p-6",
                  tier.featured && "border-red",
                )}
              >
                {tier.featured && (
                  <span className="absolute top-0 right-4 -translate-y-1/2 bg-red px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-white">
                    Recommended
                  </span>
                )}
                <div className="flex items-start justify-between gap-4">
                  <span className={cn("text-[12px] font-bold", tier.isFree ? "text-green" : "text-red")}>
                    {tier.isFree ? "Free" : "Monthly"}
                  </span>
                  <strong className="text-[22px] tracking-[-0.03em]">{tier.priceLabel}</strong>
                </div>
                <h2 className="mt-5 text-[20px] font-extrabold tracking-[-0.02em]">{tier.name}</h2>
                <p className="mt-2 flex-1 text-[14.5px] leading-6 text-muted">{tier.description}</p>
                <Button
                  href={tier.href}
                  variant={tier.isFree ? "green" : "red"}
                  arrow={!tier.isFree}
                  className="mt-6 w-full justify-center px-5 py-3 text-[12.5px]"
                >
                  {tier.ctaLabel}
                </Button>
              </Card>
            ))}
          </div>

          <p className="mt-7 border-t border-line pt-5 text-[13.5px] text-muted">
            Paid membership links open our external payment processor. Questions?{" "}
            <a href={`mailto:${org.email}`} className="font-semibold text-ink underline">
              Email {org.email}
            </a>
            .
          </p>
        </Container>
      </section>

      <DonateBand />
    </>
  );
}
