import type { Metadata } from "next";
import Image from "next/image";
import { Mark } from "@/components/redesign/Mark";
import { PhotoBand } from "@/components/redesign/PhotoBand";
import { R } from "@/components/redesign/Reveal";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";
import { checkoutUrl } from "@/content/billing";
import { freeMembership, links, membershipTiers, org, TRAINING_HREF } from "@/content/site";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Training is free and always will be. Paid membership is monthly giving — it's what buys the gifts and the gear.",
};

/** What a membership pays for. Three claims over the photo. */
const pays = [
  {
    title: "Nobody pays to train",
    body: "Classes, the holiday gifts, the events — the people who use them never see a bill.",
  },
  {
    title: "Gear is provided",
    body: "Foam weapons, armor, and mats, so cost is never the reason a kid doesn't show up.",
  },
  {
    title: "Six programs, one room",
    body: "Adults, teens, kids, women, and veterans, all out of the Manhattanville Community Center.",
  },
];

const faqs = [
  {
    q: "Do I have to pay anything to train?",
    a: "No. Class membership is $0 and always will be. Monthly giving is a separate, entirely optional thing — you never need it to walk in and train.",
  },
  {
    q: "Do I need experience, or my own gear?",
    a: "Neither. Beginners are the point. Foam weapons, armor, and mats are provided, and instructors run every floor.",
  },
  {
    q: "Can I cancel monthly giving?",
    a: "Any time, from the payment processor. There's no minimum term and nothing to negotiate.",
  },
  {
    q: "Is monthly giving tax-deductible?",
    a: "Yes. Santa's Knights, Inc. is a registered 501(c)(3), tax-exempt federally and in New York State. The receipt is emailed automatically.",
  },
  {
    q: "Where do classes actually happen?",
    a: "The Manhattanville Community Center, 530 W 133rd St in Harlem. Schedule and booking live on gladiators.nyc.",
  },
];

export default function MembershipPage() {
  return (
    <RedesignShell>
      <section className="phead">
        <Wrap>
          <div className="phead-grid" style={{ alignItems: "center" }}>
            <div>
              <R as="h1">Membership</R>
              <R as="p" delay={80} className="sub">
                Training is free and always will be. Paid membership is monthly giving — it&apos;s
                what buys the gifts and the gear.
              </R>
              <R delay={120} className="linkrow">
                <a className="btn btn--ghost" href={TRAINING_HREF}>
                  Book now <span className="arw">→</span>
                </a>
              </R>
            </div>
            <R as="figure" delay={160} className="figbox" style={{ height: "clamp(330px,38vw,470px)" }}>
              <Image
                src="/images/gallery/23.jpg"
                alt="A boy in borrowed sparring armor holding a foam sword before a Gladiators NYC class"
                fill
                sizes="(min-width: 900px) 44vw, 100vw"
                priority
                style={{ objectPosition: "50% 26%" }}
              />
            </R>
          </div>
        </Wrap>
      </section>

      {/* The free tier is a statement on the paper, not a card in the price grid:
          pricing $0 next to $500 reads as "the cheap plan", which is the opposite
          of what it is. */}
      <section className="sec sec--tight">
        <Wrap>
          <div className="free-say">
            <R>
              <h2>
                Class membership is <Mark>$0</Mark>, always
              </h2>
              <p>{freeMembership.description}</p>
            </R>
            <R delay={100}>
              <a className="tlink tlink--green" href={freeMembership.href}>
                {freeMembership.ctaLabel} <span className="arw">→</span>
              </a>
            </R>
          </div>
        </Wrap>
      </section>

      <section className="sec sec--tight" style={{ paddingTop: "clamp(28px,3.4vw,44px)" }}>
        <Wrap>
          <div className="headrow mcenter">
            <R as="h2" className="big">
              Monthly giving
            </R>
            <R as="p" delay={70} className="rd-muted" style={{ fontSize: 15, maxWidth: "38ch" }}>
              Each tier is what it buys, not a package of perks.
            </R>
          </div>

          <R delay={110} className="tiers">
            {membershipTiers.map((tier, index) => (
              <article key={tier.priceLabel} className={tier.open ? "tier tier--open" : "tier"}>
                <div className="price">
                  {tier.priceLabel}
                  {tier.price !== null && <small>/mo</small>}
                </div>
                <h3>{tier.name}</h3>
                <p>
                  {tier.description}
                  {tier.note && (
                    <>
                      {" "}
                      <Mark thin alt={index % 2 === 1} className="rd-note">
                        {tier.note}
                      </Mark>
                    </>
                  )}
                </p>
                <a
                  className={index === 0 ? "btn btn--red" : "btn btn--ghost"}
                  // Resolved centrally so switching on real recurring billing is a
                  // one-file change — see content/billing.ts.
                  href={tier.href ?? checkoutUrl(tier.price, "monthly")}
                >
                  {tier.ctaLabel}
                </a>
              </article>
            ))}
          </R>

          <R
            as="p"
            delay={140}
            className="rd-muted mcenter"
            style={{ marginTop: 18, fontSize: 13.5 }}
          >
            Cancel any time. Questions?{" "}
            <a className="tlink" style={{ fontSize: 13.5 }} href={`mailto:${org.email}`}>
              {org.email}
            </a>
          </R>
        </Wrap>
      </section>

      <div className="band-gap">
        <PhotoBand src="/images/gallery/6b7494_da7cab87beee4becb1fa08dd5b8bb6b9_mv2.webp">
          <R as="h2" className="big narrow-15">
            What a membership <Mark alt>pays for</Mark>
          </R>
          <ul className="facts facts--onimg" data-reveal style={{ transitionDelay: "100ms" }}>
            {pays.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </PhotoBand>
      </div>

      <section className="sec sec--tight">
        <Wrap>
          <div className="split split--top">
            <div className="mcenter">
              <R as="h2" className="big">
                Before you sign up
              </R>
              <R as="p" delay={70} className="lede">
                The questions we get asked most.
              </R>
              <R as="p" delay={110} className="aside-note">
                Anything else?{" "}
                <a className="tlink" style={{ fontSize: 14.5 }} href={`mailto:${org.email}`}>
                  {org.email}
                </a>
              </R>
            </div>
            <R delay={120}>
              {faqs.map((faq, index) => (
                <details key={faq.q} open={index === 0}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </R>
          </div>
        </Wrap>
      </section>

      <section className="closer" style={{ paddingTop: "clamp(44px,5.4vw,74px)" }}>
        <Wrap>
          <div className="in">
            <R>
              <h2>
                Rather give <Mark>once</Mark>?
              </h2>
              <p>A one-time gift does the same work.</p>
            </R>
            <R delay={100} className="cta-wrap">
              <a className="btn btn--ink" href={links.donate}>
                Make a one-time gift <span className="arw">→</span>
              </a>
            </R>
          </div>
        </Wrap>
      </section>
    </RedesignShell>
  );
}
