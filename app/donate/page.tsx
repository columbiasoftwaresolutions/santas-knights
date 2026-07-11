import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { links, org, donateCopy } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate · Santa's Knights",
  description:
    "Santa's Knights is a Harlem 501(c)(3). Donations are tax-deductible and pay for the holiday gifts, the free classes, and the community events.",
};

/**
 * Donation processing stays external (Plan v2: no on-site payments). This page
 * sends donors directly to PayPal / Venmo / the processor.
 * PayPal + Venmo are live (see content/site.ts links); the generic card
 * processor is still pending, so its tile hides until NEXT_PUBLIC_DONATE_URL set.
 */
const PROCESSOR_URL = process.env.NEXT_PUBLIC_DONATE_URL;
const PAYPAL_URL = links.paypal;
const VENMO_URL = links.venmo;

const externalOptions = [
  {
    label: "Give online",
    body: "Make a one-time or monthly gift by card or Apple Pay.",
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
    body: "Send a one-time gift through Venmo.",
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
    body: "Storage, permits, insurance, and the website all carry recurring costs.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        title={
          <>
            Help keep classes free and letters{" "}
            <em className="font-serif font-medium italic text-red">answered</em>.
          </>
        }
        intro={`${donateCopy.encouragement} Santa's Knights is a 501(c)(3) nonprofit, and donations are tax-deductible.`}
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

      {/* Give now — direct handoff to external processors */}
      <section className="py-section">
        <Container className="grid items-start gap-12 lg:grid-cols-[0.58fr_0.42fr]">
          <div>
            <SectionHeading
              className="max-w-[560px]"
              title="Give directly"
              intro="Choose the provider you prefer. Payment happens off-site, and we never collect card details here."
              introClassName="max-w-[48ch]"
            />
            <div className="mt-8 grid border-t border-line">
              {externalOptions.map((option) => (
                <a
                  key={option.label}
                  href={option.href}
                  className="grid gap-2 border-b border-line py-5 transition-colors hover:bg-paper-raised sm:grid-cols-[180px_1fr_auto] sm:items-center"
                >
                  <span className="font-display text-[20px] font-black uppercase tracking-[-0.02em] text-ink">
                    {option.label}
                  </span>
                  <span className="text-[15.5px] text-muted">{option.body}</span>
                  <span className="text-[13px] font-bold uppercase tracking-[0.04em] text-red">
                    {option.cta} ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
          <Card className="p-[30px] md:p-[36px]">
            <h2 className="text-h3 text-ink">Receipts and dedications</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
              PayPal and Venmo provide their own confirmations. For a formal receipt, a dedication,
              or a corporate gift, email us with the donation details.
            </p>
            <div className="mt-6">
              <Button
                href={`mailto:${org.email}?subject=Donation%20receipt%20for%20Santa%27s%20Knights`}
                variant="ghostInverse"
              >
                Email for a receipt
              </Button>
            </div>
          </Card>
        </Container>
      </section>

      {/* Ways to give */}
      <section className="border-t border-line py-section">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading title="More ways to help" />
            <p className="max-w-[38ch] text-[14.5px] text-muted sm:text-right">
              Payment is handled by the provider you choose. We never collect card details on this
              site.
            </p>
          </div>
          <div className="mt-10 border-t border-line">
            {externalOptions.map((option) => (
              <article
                key={option.label}
                className="grid gap-4 border-b border-line py-6 md:grid-cols-[190px_1fr_auto] md:items-center"
              >
                <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">{option.label}</h2>
                <p className="max-w-[58ch] text-[15.5px] text-muted">{option.body}</p>
                <div>
                  <Button href={option.href} variant="ghostInverse" className="px-5 py-3 text-[15px]">
                    {option.cta} ↗
                  </Button>
                </div>
              </article>
            ))}
            <article className="grid gap-4 border-b border-line py-6 md:grid-cols-[190px_1fr_auto] md:items-center">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Adopt a letter</h2>
              <p className="max-w-[58ch] text-[15.5px] text-muted">
                Skip the middle step entirely: read a kid&apos;s wish and send the exact gift they
                asked for.
              </p>
              <div>
                <Button href={links.adoptLetter} variant="green" className="px-5 py-3 text-[15px]">
                  Browse the letters
                </Button>
              </div>
            </article>
            <article className="grid gap-4 border-b border-line py-6 md:grid-cols-[190px_1fr_auto] md:items-center">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Become a member</h2>
              <p className="max-w-[58ch] text-[15.5px] text-muted">
                Monthly membership starts at $20. It helps pay for gifts and equipment for kids.
              </p>
              <div>
                <Button href={links.membership} variant="ghostInverse" className="px-5 py-3 text-[15px]">
                  Membership tiers
                </Button>
              </div>
            </article>
            <article className="grid gap-4 border-b border-line py-6 md:grid-cols-[190px_1fr_auto] md:items-center">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Sponsor us</h2>
              <p className="max-w-[58ch] text-[15.5px] text-muted">
                Businesses can sponsor a season, an event, or the letter drive. We recognize
                sponsors publicly.
              </p>
              <div>
                <Button href={links.sponsors} variant="ghostInverse" className="px-5 py-3 text-[15px]">
                  Sponsorship
                </Button>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* Where it goes */}
      <section className="border-y border-line bg-paper-raised py-section">
        <Container>
          <SectionHeading
            className="max-w-[640px]"
            title="What a donation actually pays for"
            intro="We're small and Harlem-based, and the budget is mostly the programs themselves."
            introClassName="max-w-[52ch]"
          />
          <div className="mt-10 grid gap-[22px] md:grid-cols-3">
            {spend.map((item) => (
              <div key={item.title}>
                <span aria-hidden className="mb-4 block h-1 w-12 bg-red" />
                <h2 className="text-h3 text-ink">{item.title}</h2>
                <p className="mt-2.5 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[64ch] text-[14.5px] text-muted">
            Santa&apos;s Knights, Inc. is a registered 501(c)(3) nonprofit. Donations are
            tax-deductible to the extent allowed by law; we&apos;re happy to provide a receipt for
            your records. Email{" "}
            <a href={`mailto:${org.email}`} className="font-semibold text-ink underline">
              {org.email}
            </a>
            .
          </p>
        </Container>
      </section>

      {/* Tax-deductibility guidance (Plan v2 §E6) */}
      <section className="py-section">
        <Container>
          <SectionHeading
            title="What you can deduct"
            intro="This is general information, not tax advice. Consult a tax professional for your situation."
            introClassName="max-w-[52ch] text-muted"
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {donateCopy.taxGuidance.map((point) => (
              <li key={point} className="flex gap-4">
                <span aria-hidden className="mt-1 flex-none text-green">
                  ✦
                </span>
                <p className="text-[15.5px] text-muted">{point}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] text-muted/70">
            This is general information, not legal or tax advice. Please consult a qualified tax
            advisor regarding your specific situation.
          </p>
        </Container>
      </section>
    </>
  );
}
