import type { Metadata } from "next";
import { Fragment } from "react";
import { LettersPortal } from "@/components/letters/LettersPortal";
import { HandArrow } from "@/components/redesign/HandArrow";
import { Mark } from "@/components/redesign/Mark";
import { PhotoBand } from "@/components/redesign/PhotoBand";
import { R } from "@/components/redesign/Reveal";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";
import { giftAskLine, getLetterPool, type PublicLetter } from "@/lib/letters";
import { getCurrentUser } from "@/lib/auth";
import { giftGuidance, links, org } from "@/content/site";

export const metadata: Metadata = {
  title: "Letters",
  description:
    "Read kids' letters to Santa and adopt a wish, or submit your child's letter. We protect every child's identity, and here's exactly how.",
  // The live Wix site has ranked on /letters-to-santa for years, so the route
  // keeps that path rather than the shorter /letters (SEO-PARITY.md §2).
  alternates: { canonical: "/letters-to-santa" },
};

// Rendered per request: submissions, claims, and fulfillment change the pool.
export const dynamic = "force-dynamic";

/** How many letters get a card in the public preview above the portal. */
const PREVIEW_COUNT = 3;

/**
 * Sample letters for `?demo=1` let the team review the deck on the beta before
 * real submissions exist. Clearly labeled, never mixed with real data, and the
 * beta is noindex so this never reaches search.
 */
const DEMO_LETTERS: PublicLetter[] = [
  {
    id: "demo-1",
    childFirstName: "Maya",
    childAge: 7,
    wishNote:
      "Dear Santa, I have been very good this year. I would love this LEGO car set because I want to build something big with my dad.",
    amazonUrls: ["https://www.amazon.com/s?k=lego+technic+car+set"],
    amazonImageUrls: [],
    wishlistUrl: null,
    giftSummary: "LEGO Technic set",
    giftValueUsd: 50,
    imageUrl: null,
  },
  {
    id: "demo-2",
    childFirstName: "Jaylen",
    childAge: 10,
    wishNote:
      "Hi Santa! My sneakers are too small now. Size 5 please, any color but mostly blue. Thank you and say hi to the reindeer.",
    amazonUrls: ["https://www.amazon.com/s?k=kids+sneakers+size+5"],
    amazonImageUrls: [],
    wishlistUrl: null,
    giftSummary: "Sneakers, size 5",
    giftValueUsd: 40,
    imageUrl: null,
  },
  {
    id: "demo-3",
    childFirstName: "Sofia",
    childAge: 5,
    wishNote: "deer santa. a stuffed dog pleese. a big one. i wil name him biscit.",
    amazonUrls: [],
    amazonImageUrls: [],
    wishlistUrl: "https://www.amazon.com/hz/wishlist/ls/DEMO12345",
    giftSummary: "A large stuffed dog",
    giftValueUsd: 25,
    imageUrl: null,
  },
];

const steps = [
  { title: "Read a wish", body: "A first name, an age, and what they asked for." },
  { title: "Buy the gift", body: "Straight from Amazon. We never touch your payment." },
  { title: "They open it", body: "Christmas morning, from Santa." },
];

const protections = [
  {
    title: "First names only",
    body: "A first name, an age, and a wish. Never a last name, address, school, or handle.",
  },
  {
    title: "No contact, either way",
    body: "Families and donors stay anonymous. Amazon ships it, so addresses are never exchanged.",
  },
  {
    title: "Gifts are vetted",
    body: "Wishes have to be age-appropriate, legal, and safe.",
  },
  {
    title: "Admins can pull anything",
    body: "Letters go live immediately, and admins can remove any that shouldn't stay in the pool.",
  },
];

/** The hand-drawn arrow between steps. */
function StepArrow() {
  return (
    <svg className="sep" width="34" height="16" viewBox="0 0 34 16" fill="none" aria-hidden>
      <path
        d="M1.5 8.6C7 6.4 14 5.9 20.5 7.2c4 .8 7.6 2 11 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M26.6 5.2c2.4 1.9 4.4 3.9 5.9 6.2M25.9 14.4c2.5-.5 4.6-1.6 6.6-3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function LettersPage({
  searchParams,
}: {
  searchParams: Promise<{ do?: string; demo?: string }>;
}) {
  const params = await searchParams;
  const demo = params.demo === "1";
  // Always defaults to adopt; only an explicit ?do=submit opens the submit side.
  const initialView = params.do === "submit" ? "submit" : "adopt";
  const user = await getCurrentUser();

  // The pile is PUBLIC — anyone can read the letters. Only claiming one needs an
  // account (SwipeDeck redirects), and only submitting one needs an account (the
  // row carries guardian_user_id).
  const pool = demo
    ? { letters: DEMO_LETTERS, total: DEMO_LETTERS.length }
    : await getLetterPool();
  const preview = pool?.letters.slice(0, PREVIEW_COUNT) ?? [];

  return (
    <RedesignShell>
      {/* Hero over a photo; the paper tears open beneath it. */}
      <PhotoBand
        src="/images/gallery/48362591_10161478136885422_5477524744964145152_o.jpg"
        objectPosition="52% 40%"
        hero
        priority
      >
        <R as="h1" className="narrow-14">
          Pick a letter <Mark>off the pile</Mark>.
        </R>

        <div className="steps steps--onimg" data-reveal style={{ transitionDelay: "110ms" }}>
          {steps.map((step, index) => (
            <Fragment key={step.title}>
              <div className="step">
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </div>
              {index < steps.length - 1 && <StepArrow />}
            </Fragment>
          ))}
        </div>

        <R delay={180} className="linkrow" style={{ marginTop: 32 }}>
          <a className="btn btn--red" href="#portal">
            Adopt a letter <span className="arw">→</span>
          </a>
          <a className="btn btn--onimg" href="#portal">
            Submit your child&apos;s letter
          </a>
        </R>
        <R delay={230} style={{ marginTop: 20 }}>
          <span className="value-note value-note--onimg">
            Suggested gift value <b>{giftGuidance.valueRange}</b> per child
          </span>
        </R>
      </PhotoBand>

      {/* The public preview pile. Reading is open to everyone — a stranger should
          be able to see a real wish before deciding to make an account. */}
      {preview.length > 0 && (
        <section className="sec sec--tight">
          <Wrap>
            <div className="headrow mcenter">
              <R as="h2" className="big">
                Letters waiting <Mark alt>right now</Mark>
              </R>
              <R delay={80}>
                <a className="tlink" href="#portal">
                  {pool && pool.total > PREVIEW_COUNT
                    ? `See all ${pool.total} letters`
                    : "Read the letters"}{" "}
                  <span className="arw">→</span>
                </a>
              </R>
            </div>

            <R delay={120} className="deck">
              {preview.map((letter) => {
                const ask = giftAskLine(letter);
                return (
                  <article key={letter.id} className="letter">
                    <div className="who">
                      {letter.childFirstName} <em>Age {letter.childAge}</em>
                    </div>
                    <p className="wish">“{letter.wishNote}”</p>
                    {ask && <p className="ask">{ask}</p>}
                    <a className="btn btn--red btn--wide" href="#portal">
                      Gift this
                    </a>
                  </article>
                );
              })}
            </R>
          </Wrap>
        </section>
      )}

      {/* The two-sided portal: deck ⇄ guardian form. */}
      <section className="sec sec--tight" id="portal" style={{ scrollMarginTop: 118 }}>
        <Wrap>
          <LettersPortal
            initialView={initialView}
            signedIn={!!user}
            defaultEmail={user?.email ?? undefined}
            defaultName={user?.name ?? undefined}
            letters={pool?.letters ?? null}
            demo={demo}
          />
        </Wrap>
      </section>

      <section className="sec sec--tight">
        <Wrap>
          <div className="split split--top">
            <div className="mcenter">
              <R as="h2" className="big">
                How we protect the kids
              </R>
              <R as="p" delay={70} className="lede">
                Generosity never costs a family their privacy.
              </R>
              <R as="p" delay={110} className="aside-note">
                Questions?{" "}
                <a className="tlink" style={{ fontSize: 14.5 }} href={`mailto:${org.email}`}>
                  {org.email}
                </a>
              </R>
            </div>
            <R delay={120} className="protect">
              {protections.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </R>
          </div>
        </Wrap>
      </section>

      <section className="closer">
        <Wrap>
          <div className="in">
            <R>
              <h2>Can&apos;t shop this year?</h2>
              <p>A donation covers the letters nobody adopts before Christmas.</p>
            </R>
            <R delay={100} className="cta-wrap">
              <HandArrow />
              <a className="btn btn--ink" href={links.donate}>
                Donate instead <span className="arw">→</span>
              </a>
            </R>
          </div>
        </Wrap>
      </section>
    </RedesignShell>
  );
}
