import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
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
      <section className="border-b border-line bg-paper py-[clamp(38px,5vw,66px)] text-ink">
        <Container>
          <header className="grid gap-6 border-b border-line pb-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
            <h1 className="font-display text-[clamp(42px,6vw,82px)] leading-[0.88] font-black tracking-[-0.04em] uppercase">
              Membership
            </h1>
            <div className="max-w-[38rem] lg:justify-self-end">
              <p className="text-[clamp(17px,1.45vw,20px)] leading-[1.55] text-muted">
                Classes stay free. Paid memberships put gifts and equipment directly into kids&apos; hands.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-bold">
                <a href={links.donate} className="border-b border-ink pb-0.5 transition-colors hover:border-red hover:text-red">
                  Make a one-time donation
                </a>
                <a href={links.adoptLetter} className="border-b border-ink pb-0.5 transition-colors hover:border-red hover:text-red">
                  Adopt a letter
                </a>
              </div>
            </div>
          </header>

          <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,1.45fr)] lg:gap-[clamp(48px,7vw,96px)]">
            <div className="lg:pt-5">
              <h2 className="text-[24px] font-extrabold tracking-[-0.025em]">Choose what fits.</h2>
              <p className="mt-3 max-w-[31ch] text-[15.5px] leading-6 text-muted">
                Start at $0 for class access, or fund a specific level of support every month.
              </p>
              <div className="mt-8 border-l-2 border-green pl-4">
                <strong className="block text-[30px] leading-none">$0</strong>
                <span className="mt-1 block text-[13px] font-semibold text-muted">to train, always</span>
              </div>
            </div>

            <ol className="border-t border-line">
              {membershipTiers.map((tier, index) => (
                <li
                  key={tier.name}
                  className="group grid gap-4 border-b border-line py-6 transition-colors duration-150 hover:bg-paper-raised md:grid-cols-[minmax(0,1fr)_110px_150px] md:items-center md:px-5"
                >
                  <div className="flex gap-4">
                    <span className="pt-0.5 font-serif text-[17px] italic text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="text-[19px] font-extrabold tracking-[-0.02em]">
                        {tier.name}
                        {tier.featured && (
                          <span className="ml-3 text-[12px] font-bold text-red">Recommended</span>
                        )}
                      </h2>
                      <p className="mt-1 max-w-[46ch] text-[14.5px] leading-6 text-muted">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                  <strong className="pl-9 text-[22px] tracking-[-0.03em] md:pl-0">{tier.priceLabel}</strong>
                  <Button
                    href={tier.href}
                    variant={tier.isFree ? "green" : "red"}
                    arrow={!tier.isFree}
                    className="ml-9 w-fit justify-center px-5 py-3 text-[12.5px] md:ml-0 md:w-full"
                  >
                    {tier.ctaLabel}
                  </Button>
                </li>
              ))}
            </ol>
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
