import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { links, org } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate · Santa's Knights",
  description:
    "Santa's Knights is a Harlem 501(c)(3). Donations are tax-deductible and pay for the holiday gifts, the free classes, and the community events.",
};

/**
 * Donation processing stays external (PRD: no on-site payments). This page is
 * the framing + hand-off: each option redirects out to PayPal / Venmo / the
 * donation processor. Options whose URLs aren't configured yet don't render.
 */
const PROCESSOR_URL = process.env.NEXT_PUBLIC_DONATE_URL;
const PAYPAL_URL = process.env.NEXT_PUBLIC_PAYPAL_URL;
const VENMO_URL = process.env.NEXT_PUBLIC_VENMO_URL;

const externalOptions = [
  {
    label: "Give online",
    body: "A one-time or monthly gift through our donation page. Card, Apple Pay, the usual.",
    cta: "Donate online",
    href: PROCESSOR_URL,
  },
  {
    label: "PayPal",
    body: "Make a one-time or recurring gift. It's tax-deductible and goes straight to the programs.",
    cta: "Give with PayPal",
    href: PAYPAL_URL,
  },
  {
    label: "Venmo",
    body: "Prefer Venmo? Send your gift there and it does the same work.",
    cta: "Give with Venmo",
    href: VENMO_URL,
  },
].filter((option): option is typeof option & { href: string } => Boolean(option.href));

const spend: { title: string; body: string }[] = [
  {
    title: "Christmas presents",
    body: "Gifts for kids whose letters don't get adopted, plus shipping and the December event itself.",
  },
  {
    title: "Free classes",
    body: "Equipment, armor upkeep, insurance, and space. Nobody who trains with us ever pays.",
  },
  {
    title: "Keeping the lights on",
    body: "The unglamorous rest: storage, permits, the website you're reading. Small, but real.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Donate"
        title={
          <>
            Your gift keeps it <em className="font-serif font-medium italic text-red">free</em>.
          </>
        }
        intro="Santa's Knights is a 501(c)(3) nonprofit, so every donation is tax-deductible. The money buys Christmas presents, keeps the classes free, and covers the events that keep the neighborhood showing up."
      >
        {externalOptions.length > 0 ? (
          <Button href={externalOptions[0].href} variant="red" arrow>
            {externalOptions[0].cta}
          </Button>
        ) : (
          <Button href={`mailto:${org.email}?subject=Donating%20to%20Santa%27s%20Knights`} variant="red" arrow>
            Email us to give
          </Button>
        )}
        <Button href={links.adoptLetter} variant="ghost">
          Or adopt a letter instead
        </Button>
      </PageHero>

      {/* Ways to give */}
      <section className="py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            eyebrow="Ways to give"
            title="Pick whatever's easiest"
            intro="All of these land in the same place. Giving happens on the payment provider's site — we never take card details here."
            introClassName="max-w-[52ch]"
          />
          <div className="mt-10 grid gap-[18px] md:grid-cols-3">
            {externalOptions.map((option) => (
              <Card key={option.label} hover className="flex flex-col p-[28px]">
                <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">{option.label}</h2>
                <p className="mt-2 flex-1 text-[15.5px] text-muted">{option.body}</p>
                <div className="mt-5">
                  <Button href={option.href} variant="ghost" className="px-5 py-3 text-[15px]">
                    {option.cta} ↗
                  </Button>
                </div>
              </Card>
            ))}
            <Card hover className="flex flex-col p-[28px]">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Adopt a letter</h2>
              <p className="mt-2 flex-1 text-[15.5px] text-muted">
                Skip the middle step entirely: read a kid&apos;s wish and send the exact gift they
                asked for.
              </p>
              <div className="mt-5">
                <Button href={links.adoptLetter} variant="green" className="px-5 py-3 text-[15px]">
                  Browse the letters
                </Button>
              </div>
            </Card>
            <Card hover className="flex flex-col p-[28px]">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Sponsor us</h2>
              <p className="mt-2 flex-1 text-[15.5px] text-muted">
                Businesses can back a season, an event, or the letter drive — and get thanked
                publicly for it.
              </p>
              <div className="mt-5">
                <Button href={links.sponsors} variant="ghost" className="px-5 py-3 text-[15px]">
                  Sponsorship
                </Button>
              </div>
            </Card>
            <Card hover className="flex flex-col p-[28px]">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Something else</h2>
              <p className="mt-2 flex-1 text-[15.5px] text-muted">
                Stock, in-kind gifts, employer matching, or a check in the mail — write to us and
                we&apos;ll sort it out.
              </p>
              <div className="mt-5">
                <Button
                  href={`mailto:${org.email}?subject=Donating%20to%20Santa%27s%20Knights`}
                  variant="ghost"
                  className="px-5 py-3 text-[15px]"
                >
                  Email {org.email}
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Where it goes */}
      <section className="border-y border-line bg-paper-raised py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            eyebrow="Where it goes"
            title="What a donation actually pays for"
            intro="We're small and Harlem-based, and the budget is mostly the programs themselves."
            introClassName="max-w-[52ch]"
          />
          <div className="mt-10 grid gap-[22px] md:grid-cols-3">
            {spend.map((item) => (
              <div key={item.title}>
                <span aria-hidden className="mb-4 block h-1 w-12 rounded-pill bg-red" />
                <h2 className="text-h3">{item.title}</h2>
                <p className="mt-2.5 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[64ch] text-[14.5px] text-muted">
            Santa&apos;s Knights, Inc. is a registered 501(c)(3) nonprofit. Donations are
            tax-deductible to the extent allowed by law; we&apos;re happy to provide a receipt for
            your records — email{" "}
            <a href={`mailto:${org.email}`} className="font-semibold text-ink underline">
              {org.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
