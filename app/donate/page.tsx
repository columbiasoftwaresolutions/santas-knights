import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { links, org } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate · Santa's Knights",
  description:
    "Support Santa's Knights, a Harlem 501(c)(3) providing free martial arts, fitness, gifts, and community programs.",
};

const PROCESSOR_URL = process.env.NEXT_PUBLIC_DONATE_URL;

const paymentOptions = [
  {
    label: "PayPal",
    body: "Make a one-time or recurring gift through PayPal.",
    href: links.paypal,
  },
  {
    label: "Venmo",
    body: "Send a one-time gift directly through Venmo.",
    href: links.venmo,
  },
  ...(PROCESSOR_URL
    ? [
        {
          label: "Card or Apple Pay",
          body: "Give securely through our external payment processor.",
          href: PROCESSOR_URL,
        },
      ]
    : []),
];

const donationMechanics = [
  {
    title: "Reduction in Taxable Income",
    body: "Your donations are subtracted from your gross income, effectively reducing the amount of money subject to taxation. This can potentially move you into a lower tax bracket and lead to substantial savings.",
  },
  {
    title: "Itemized Deductions",
    body: "To take advantage of tax deductions, you need to itemize your deductions instead of using the standard deduction on your tax return. It's important to keep accurate records, including receipts or written acknowledgment from the charity.",
  },
  {
    title: "Donation Limits",
    body: "The IRS sets limits on the amount you can deduct. For cash donations, you can deduct up to 60% of your adjusted gross income. For donations of property, the limit can range from 20% to 50% depending on the type of property and the organization you donate to.",
  },
  {
    title: "Carryover of Excess Contributions",
    body: "If your donations exceed the deduction limits, you can carry the excess over to the following tax year. This carryover can continue for up to five years until the full deduction is utilized.",
  },
];

const donationTips = [
  {
    title: "Non-Cash Donations",
    body: "When donating property or items, the tax deduction is generally based on the fair market value of the items. Special rules apply to vehicle donations.",
  },
  {
    title: "Volunteer Work",
    body: "Although you can't deduct the value of your time, you can deduct travel expenses and other costs associated with your volunteer work.",
  },
  {
    title: "Qualified Charitable Distributions",
    body: "If you're 70½ or older, you can transfer up to $100,000 annually from your IRA directly to a qualified charity. This transfer can count as your required minimum distribution and won't be included in your taxable income.",
  },
  {
    title: "Estate and Inheritance Tax",
    body: "Charitable donations can help reduce the size of your estate, potentially lowering the estate tax burden.",
  },
];

const waysToHelp = [
  {
    title: "Donate",
    body: "Your financial contribution directly funds our programs and helps us reach more people in need. No amount is too small; every dollar makes a difference.",
    href: links.paypal,
    action: "Give now",
  },
  {
    title: "Sponsor",
    body: "Corporate and individual sponsorships help us expand our reach and provide additional resources to our participants.",
    href: links.sponsors,
    action: "Sponsor us",
  },
  {
    title: "Volunteer",
    body: "We're always looking for passionate and dedicated individuals to join our team and help us make a positive impact on our community.",
    href: links.getInvolved,
    action: "Volunteer",
  },
  {
    title: "Spread the Word",
    body: "Share our story with your friends and family on social media, and encourage them to support our cause.",
    href: links.linkInBio,
    action: "Share our links",
  },
];

const reasonsToSupport = [
  {
    title: "Create and grow an ecosystem of free martial arts and fitness",
    body: "Our programs help build confidence, discipline, and life skills in children and adults, making a lasting impact on their lives.",
  },
  {
    title: "Provide thoughtful gifts to hundreds of children",
    body: "Through our Letters to Santa program and large end-of-year events, we bring joy and hope to children who may otherwise have little to look forward to during the holiday season.",
  },
  {
    title: "Promote equity and inclusivity",
    body: "We strive to break down barriers and transcend socioeconomic, racial, and location boundaries to create a world where everyone can access the life-changing benefits of martial arts and fitness.",
  },
];

export default function DonatePage() {
  return (
    <>
      <section className="border-b border-line bg-paper py-[clamp(36px,5vw,64px)] text-ink">
        <Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-[clamp(56px,8vw,112px)]">
          <div className="max-w-[580px]">
            <h1 className="font-display text-[clamp(44px,6vw,78px)] leading-[0.88] font-black tracking-[-0.04em] uppercase">
              Donate
            </h1>
            <p className="mt-6 max-w-[34rem] text-[clamp(18px,1.6vw,22px)] leading-[1.5] text-muted">
              Fund free martial arts, thoughtful gifts, and community programs for children and adults in Harlem.
            </p>
            <p className="mt-5 text-[14px] font-semibold text-green">
              Santa&apos;s Knights is a registered 501(c)(3) nonprofit.
            </p>
          </div>

          <div className="bg-ink px-6 py-2 text-bone md:px-8">
            {paymentOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                className="grid gap-2 border-b border-bone/15 py-6 transition-colors duration-150 last:border-b-0 hover:text-amber sm:grid-cols-[150px_1fr_auto] sm:items-center"
              >
                <strong className="text-[18px]">{option.label}</strong>
                <span className="text-[14.5px] leading-6 text-bone/65">{option.body}</span>
                <span aria-hidden className="text-[20px] text-red">→</span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-section text-ink">
        <Container className="max-w-[1180px]">
          <h2 className="text-center font-display text-[clamp(30px,4vw,48px)] font-black tracking-[-0.03em] uppercase">
            Giving and your taxes
          </h2>
          <p className="mx-auto mt-7 max-w-[860px] text-center font-serif text-[clamp(22px,2.8vw,32px)] leading-[1.35] font-medium">
            When you make a monetary gift or donate goods to a registered non-profit organization, you are essentially reducing your taxable income, which can lead to substantial tax savings. To qualify, the charity must be a 501(c)(3) organization, a designation given by the Internal Revenue Service (IRS) to nonprofits that meet certain criteria.
          </p>
          <p className="mx-auto mt-8 max-w-[760px] text-[17px] leading-7 text-muted">
            Charitable donations are a powerful way to make a difference in the world and bring personal benefits in terms of tax deductions. When you donate money or goods to a registered non-profit organization, you can lower your taxable income and potentially save a significant amount of money on taxes. To qualify for these benefits, the charity must be a 501(c)(3) organization recognized by the IRS.
          </p>

          <h3 className="mt-14 text-center text-[24px] font-extrabold tracking-[-0.025em]">
            Here&apos;s how charitable donations work:
          </h3>
          <div className="mt-8 grid border-t border-l border-line md:grid-cols-2">
            {donationMechanics.map((item, index) => (
              <article key={item.title} className="border-r border-b border-line p-6 md:p-8">
                <div className="font-serif text-[20px] italic text-gold">{String(index + 1).padStart(2, "0")}</div>
                <h4 className="mt-5 text-[19px] font-extrabold tracking-[-0.02em]">{item.title}:</h4>
                <p className="mt-3 text-[15.5px] leading-7 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-section text-bone">
        <Container className="max-w-[1180px]">
          <h2 className="text-center font-display text-[clamp(30px,4vw,48px)] font-black tracking-[-0.03em] uppercase">
            Here are some important tips to consider:
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {donationTips.map((tip) => (
              <article key={tip.title} className="border-t border-bone/20 pt-5">
                <h3 className="text-[19px] font-extrabold text-amber">{tip.title}:</h3>
                <p className="mt-3 text-[15.5px] leading-7 text-bone/70">{tip.body}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-[760px] border-t border-bone/15 pt-6 text-center text-[12.5px] leading-5 text-bone/50">
            This material is general information, not legal or tax advice. Tax rules and eligibility change. Confirm your situation with a qualified tax professional and current IRS guidance.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12.5px] font-semibold">
            <a
              href="https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contribution-deductions"
              className="text-bone/70 underline decoration-bone/30 underline-offset-4 hover:text-amber"
            >
              IRS deduction guidance ↗
            </a>
            <a
              href="https://www.irs.gov/publications/p526"
              className="text-bone/70 underline decoration-bone/30 underline-offset-4 hover:text-amber"
            >
              IRS Publication 526 ↗
            </a>
          </div>
        </Container>
      </section>

      <section className="bg-red-deep py-[clamp(56px,7vw,88px)] text-paper">
        <Container className="max-w-[980px] text-center">
          <p className="font-serif text-[clamp(26px,3.8vw,44px)] leading-[1.3] font-medium italic">
            Remember, your act of kindness has a ripple effect. By donating to a charity, you not only support their mission but also create a positive impact in the world.
          </p>
          <p className="mt-7 text-[18px] font-bold">
            Together, let&apos;s build a brighter future through generosity and empathy.
          </p>
        </Container>
      </section>

      <section className="bg-paper py-section text-ink">
        <Container>
          <div className="text-center">
            <h2 className="font-display text-[clamp(30px,4vw,48px)] font-black tracking-[-0.03em] uppercase">
              HOW YOU CAN HELP
            </h2>
            <p className="mt-4 text-[18px] text-muted">There are many ways you can support Santa&apos;s Knights</p>
          </div>
          <div className="mt-10 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {waysToHelp.map((way) => (
              <article key={way.title} className="flex min-h-[290px] flex-col border-r border-b border-line p-6">
                <h3 className="text-[21px] font-extrabold tracking-[-0.02em]">{way.title}:</h3>
                <p className="mt-4 flex-1 text-[15px] leading-7 text-muted">{way.body}</p>
                <a href={way.href} className="mt-6 text-[13px] font-bold text-red hover:underline">
                  {way.action} →
                </a>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-paper-raised py-section text-ink">
        <Container>
          <h2 className="text-center font-display text-[clamp(30px,4vw,48px)] font-black tracking-[-0.03em] uppercase">
            WHY SUPPORT SANTA&apos;S KNIGHTS ?
          </h2>
          <p className="mt-4 text-center text-[18px] text-muted">By contributing to our non-profit organization, you help us:</p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-[clamp(48px,7vw,96px)]">
            <figure>
              <Photo
                src="/images/donate-impact.webp"
                alt="Santa's Knights"
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="aspect-[4/3] h-full min-h-[420px]"
                objectPosition="62% center"
              />
              <figcaption className="sr-only">Santa&apos;s Knights</figcaption>
            </figure>
            <div className="border-t border-line">
              {reasonsToSupport.map((reason, index) => (
                <article key={reason.title} className="grid grid-cols-[34px_1fr] gap-4 border-b border-line py-7">
                  <span className="font-serif text-[18px] italic text-gold">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[19px] font-extrabold leading-6 tracking-[-0.02em]">{reason.title}:</h3>
                    <p className="mt-3 text-[15.5px] leading-7 text-muted">{reason.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href={links.paypal} variant="red" arrow>Donate with PayPal</Button>
            <Button href={links.venmo} variant="ghost">Donate with Venmo</Button>
            <Button href={`mailto:${org.email}?subject=Donation%20receipt%20for%20Santa%27s%20Knights`} variant="ghost">
              Request a receipt
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
