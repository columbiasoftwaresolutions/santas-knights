import type { Metadata } from "next";
import { GiveCard } from "@/components/redesign/GiveCard";
import { Mark } from "@/components/redesign/Mark";
import { PhotoBand } from "@/components/redesign/PhotoBand";
import { R } from "@/components/redesign/Reveal";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";
import { links } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate · Santa's Knights",
  description:
    "Donations are the only reason the training and the gifts are free. Santa's Knights is a Harlem 501(c)(3) — your gift is tax-deductible.",
};

/** Where the money goes. Three claims over the photo — no boxes, no numbering. */
const spend = [
  {
    title: "Gifts for kids who wrote to Santa",
    body: "A wish costs $20–50 to answer. Every December we work through as many letters as donations will cover.",
  },
  {
    title: "Equipment, so nobody is turned away",
    body: "Foam swords, armor, and mats. Beginners never bring their own gear, and never pay for it.",
  },
  {
    title: "Keeping every class at $0",
    body: "Six free programs out of the Manhattanville Community Center — adults, teens, kids, women, and veterans.",
  },
];

const otherWays = [
  {
    title: "Sponsor",
    body: "Corporate and individual sponsorships fund a whole season, not a single gift.",
    action: "Sponsor us",
    href: links.sponsors,
  },
  {
    title: "Volunteer",
    body: "Sort letters, run the holiday event, coach a class, keep the books.",
    action: "See the roles",
    href: links.getInvolved,
  },
  {
    title: "Adopt a letter",
    body: "Skip the money and send the actual gift a kid asked for.",
    action: "Read the letters",
    href: links.adoptLetter,
  },
  {
    title: "Spread the word",
    body: "Most of our donors found us through somebody they already knew.",
    action: "Follow us",
    href: links.instagram,
    external: true,
  },
];

const taxFaqs = [
  {
    q: "How the deduction works",
    a: "Donations come off your gross income. You have to itemize rather than take the standard deduction, so keep the receipt we send you.",
  },
  {
    q: "Limits and carryover",
    a: "Cash gifts are deductible up to 60% of adjusted gross income; property runs 20–50%. Anything above the limit carries forward five years.",
  },
  {
    q: "Goods and vehicles",
    a: "Non-cash donations are valued at fair market value. Special rules apply to vehicles.",
  },
  {
    q: "Giving from an IRA at 70½+",
    a: "Transfer up to $100,000 a year straight from an IRA. It can count toward your required minimum distribution and stays out of your taxable income.",
  },
  {
    q: "Volunteering and estate gifts",
    a: "You can't deduct your time, but travel and other volunteering costs are deductible. Bequests reduce a taxable estate.",
  },
];

export default function DonatePage() {
  return (
    <RedesignShell>
      <section className="phead">
        <Wrap>
          {/* Top-aligned, not bottom-aligned: the give card grows when it asks
              for a name and email, and a bottom-aligned row would push the
              headline down the page as it does. */}
          <div className="phead-grid" style={{ alignItems: "start" }}>
            <div>
              <R as="h1">
                Keep the classes <Mark>free</Mark>.<br />
                Answer a kid&apos;s letter.
              </R>
              <R as="p" delay={80} className="sub">
                A Harlem 501(c)(3). Donations are the only reason the training and the gifts are
                free — and they&apos;re tax-deductible.
              </R>
            </div>

            <R delay={180}>
              <GiveCard />
            </R>
          </div>
        </Wrap>
      </section>

      {/* The paper tears open into the photo — no divider bar anywhere. */}
      <div className="band-gap">
        <PhotoBand src="/images/donate-impact.webp" objectPosition="62% center">
          <R as="h2" className="big narrow-16">
            Where the money <Mark alt>actually</Mark> goes
          </R>
          <ul className="facts facts--onimg" data-reveal style={{ transitionDelay: "100ms" }}>
            {spend.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </PhotoBand>
      </div>

      <section className="sec">
        <Wrap>
          <R as="h2" className="big mcenter">
            Other ways to help
          </R>
          <R delay={80} className="ways">
            {otherWays.map((way) => (
              <a
                key={way.title}
                href={way.href}
                target={way.external ? "_blank" : undefined}
                rel={way.external ? "noopener noreferrer" : undefined}
              >
                <strong>{way.title}</strong>
                <span>{way.body}</span>
                <em>
                  {way.action} {way.external ? "↗" : "→"}
                </em>
              </a>
            ))}
          </R>
        </Wrap>
      </section>

      <section className="sec sec--tight">
        <Wrap>
          <div className="split split--top">
            <div className="mcenter">
              <R as="h2" className="big">
                Giving and your taxes
              </R>
              <R as="p" delay={70} className="lede">
                We&apos;re tax-exempt federally and in New York State, and the receipt is emailed
                automatically.
              </R>
              <R delay={120} className="linkrow">
                <a
                  className="tlink"
                  href="https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contribution-deductions"
                >
                  IRS guidance ↗
                </a>
                <a className="tlink" href="https://www.irs.gov/publications/p526">
                  Publication 526 ↗
                </a>
              </R>
              <R as="p" delay={160} className="fineprint">
                General information, not tax advice. Confirm your situation with a tax professional.
              </R>
            </div>
            <R delay={110}>
              {taxFaqs.map((faq, index) => (
                <details key={faq.q} open={index === 0}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </R>
          </div>
        </Wrap>
      </section>

      <section className="closer">
        <Wrap>
          <div className="in">
            <R>
              <h2>
                Not ready to give? Send a kid the <Mark>exact</Mark> gift they asked for.
              </h2>
              <p>Read a wish, buy it on Amazon, and it lands on Christmas morning.</p>
            </R>
            <R delay={100} className="cta-wrap">
              <a className="btn btn--ink" href={links.adoptLetter}>
                Read the letters <span className="arw">→</span>
              </a>
            </R>
          </div>
        </Wrap>
      </section>
    </RedesignShell>
  );
}
