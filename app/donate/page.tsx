import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { DonateForm } from "@/components/donate/DonateForm";
import { links, org, donateCopy } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate · Santa's Knights",
  description:
    "Santa's Knights is a Harlem 501(c)(3). Donations are tax-deductible and pay for the holiday gifts, the free classes, and the community events.",
};

/**
 * Donation processing stays external (Plan v2: no on-site payments). This page
 * captures donor intent, then redirects out to PayPal / Venmo / the processor.
 * TODO: Add external processor URLs manually in code when ready, not as env vars.
 */
const PROCESSOR_URL = process.env.NEXT_PUBLIC_DONATE_URL;
const PAYPAL_URL = process.env.NEXT_PUBLIC_PAYPAL_URL;
const VENMO_URL = process.env.NEXT_PUBLIC_VENMO_URL;

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
        eyebrow="Donate"
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

      {/* Give now — lead-capture form, then hand off to the external processor */}
      <section className="py-section">
        <Container className="grid items-start gap-12 lg:grid-cols-[0.55fr_0.45fr]">
          <div>
            <SectionHeading
              className="max-w-[560px]"
              eyebrow="Give now"
              title="Make a gift"
              intro="Choose an amount and tell us where to send your receipt. You'll finish on our secure payment page."
              introClassName="max-w-[48ch]"
            />
            <ul className="mt-8 grid gap-4">
              {spend.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span aria-hidden className="mt-1.5 h-1 w-10 flex-none rounded-pill bg-red" />
                  <div>
                    <h3 className="text-[17px] font-extrabold tracking-[-0.02em]">{item.title}</h3>
                    <p className="mt-1 text-[15px] text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Card className="p-[30px] md:p-[36px]">
            <DonateForm />
          </Card>
        </Container>
      </section>

      {/* Ways to give */}
      <section className="border-t border-line py-section">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Other ways to give" title="More ways to help" />
            <p className="max-w-[38ch] text-[14.5px] text-muted sm:text-right">
              Payment is handled by the provider you choose. We never collect card details on this
              site.
            </p>
          </div>
          <div className="mt-10 grid gap-[18px] md:grid-cols-3">
            {externalOptions.map((option) => (
              <Card key={option.label} hover className="flex flex-col p-[28px]">
                <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">{option.label}</h2>
                <p className="mt-2 flex-1 text-[15.5px] text-muted">{option.body}</p>
                <div className="mt-5">
                  <Button href={option.href} variant="ghostInverse" className="px-5 py-3 text-[15px]">
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
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Become a member</h2>
              <p className="mt-2 flex-1 text-[15.5px] text-muted">
                Monthly membership starts at $20. It helps pay for gifts and equipment for kids.
              </p>
              <div className="mt-5">
                <Button href={links.membership} variant="ghostInverse" className="px-5 py-3 text-[15px]">
                  Membership tiers
                </Button>
              </div>
            </Card>
            <Card hover className="flex flex-col p-[28px]">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Sponsor us</h2>
              <p className="mt-2 flex-1 text-[15.5px] text-muted">
                Businesses can sponsor a season, an event, or the letter drive. We recognize
                sponsors publicly.
              </p>
              <div className="mt-5">
                <Button href={links.sponsors} variant="ghostInverse" className="px-5 py-3 text-[15px]">
                  Sponsorship
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
            eyebrow="Tax deductibility"
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
