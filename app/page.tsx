import type { Metadata } from "next";
import Image from "next/image";
import { HandArrow } from "@/components/redesign/HandArrow";
import { Mark } from "@/components/redesign/Mark";
import { PhotoBand, TornEdge } from "@/components/redesign/PhotoBand";
import { PressMarquee } from "@/components/redesign/PressMarquee";
import { R } from "@/components/redesign/Reveal";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";
import { founder, letters, links, missionStatement, org } from "@/content/site";

export const metadata: Metadata = {
  // No `title` here on purpose. `title.template` in the root layout only applies
  // to *child* segments, and this page shares the root segment with that layout —
  // so setting a title here would replace the template rather than fill it, and
  // the homepage would render a bare `<title>Home</title>`. The layout's
  // `title.default` ("Home | Santa's Knights") is what covers this segment, and
  // it matches the live Wix title.
  alternates: { canonical: "/" },
};

/**
 * Paints the brush stroke under one word of a verbatim string without copying
 * that string into the page. If the word ever moves, the sentence still renders
 * in full — it just loses its emphasis, which is the safe way to fail.
 */
function markWord(text: string, word: string, alt = false) {
  const at = text.indexOf(` ${word} `);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at + 1)}
      <Mark alt={alt}>{word}</Mark>
      {text.slice(at + 1 + word.length)}
    </>
  );
}

/** Three ways in, in the order people actually take them. */
const waysToHelp = [
  {
    title: "Adopt a letter",
    body: "Read a kid's wish, pick one, send the gift. It lands on Christmas morning.",
    action: "Read the letters →",
    href: links.adoptLetter,
  },
  {
    title: "Volunteer",
    body: "Sort letters, run the holiday event, coach a class, keep the books.",
    action: "See the roles →",
    href: links.volunteer,
  },
  {
    title: "Sponsor a season",
    body: "Equipment, space, and insurance for a session of free training.",
    action: "Email us →",
    href: `mailto:${org.email}?subject=${encodeURIComponent("Sponsoring a season of classes")}`,
  },
];

export default function HomePage() {
  return (
    <RedesignShell>
      {/* The hero is the torn-edge photo band: the paper tears open beneath it.
          Deliberately not hero-community.jpg — that frame already carries the
          /login panel and the About timeline band. The nonprofit identity line
          follows the Gladiators NYC stage treatment; the h1 stays the hook.

          The press strip is the hero's footer rather than a band of its own
          further down: coverage is a credential on the claim, and it does its
          work next to the claim. It appears once on this page — the dark
          `.pressband` section that used to sit above the closer is gone. */}
      <PhotoBand
        src="/images/gallery/IMG_4212.jpg"
        objectPosition="50% 42%"
        hero
        centered
        priority
        footer={<PressMarquee />}
      >
        <R as="p" className="hero-kicker">
          Santa&rsquo;s Knights — a registered 501(c)(3) nonprofit
        </R>
        <R as="h1" delay={60} className="narrow-15">
          Strengthening kids and lifting <Mark>communities</Mark>
        </R>
        <R delay={130} className="linkrow" style={{ marginTop: 36, gap: 12 }}>
          <a className="btn btn--red" href={links.adoptLetter}>
            Adopt a letter <span className="arw">→</span>
          </a>
          <a className="btn btn--onimg" href={links.donate}>
            Donate
          </a>
        </R>
      </PhotoBand>

      {/* The mission, verbatim — the sentence the old homepage set in Cormorant
          beside a giant "01". Same words, no numeral, no italic. */}
      <section className="sec sec--tight" style={{ paddingTop: "clamp(46px, 5.6vw, 84px)" }}>
        <Wrap className="missionsplit">
          <div className="mcenter">
            <R as="p" className="standfirst">
              {markWord(missionStatement, "free")}
            </R>
            <R delay={120} className="legal">
              {org.legalName} · a registered 501(c)(3) nonprofit
            </R>
          </div>
          <R as="figure" delay={170} className="figbox">
            <Image
              src="/images/gallery/6b7494_da7cab87beee4becb1fa08dd5b8bb6b9_mv2.webp"
              alt="Kids sparring with padded swords in a Gladiators NYC class"
              fill
              sizes="(min-width: 900px) 40vw, 100vw"
              style={{ objectPosition: "50% 45%" }}
            />
          </R>
        </Wrap>
      </section>

      {/* SANTA'S LETTERS — the live page's red band, kept. Entered through a
          torn edge at the top; no bottom tear, because the Gladiators band runs
          flush underneath and carries the single shared edge (filled red-deep
          from its own side). Two tears here would put a strip of paper between
          the bands. */}
      <section className="bleed redband band-gap" aria-label="Santa's Letters">
        <TornEdge edge="top" />
        <div className="rd-wrap content">
          <R as="figure" className="figbox">
            <Image
              src="/images/gallery/DSC_5880_JPG.webp"
              alt="A smiling girl holding a wrapped gift beside Santa"
              fill
              sizes="(min-width: 900px) 42vw, 100vw"
              style={{ objectPosition: "42% center" }}
            />
          </R>
          <div className="copy mcenter">
            <R as="h2" delay={60}>
              Every kid deserves an{" "}
              <Mark className="mark--onred">answer</Mark>.
            </R>
            <R as="p" delay={110}>
              {letters.intro}
            </R>
            <R delay={160} className="cta">
              <a className="btn btn--paper" href={links.adoptLetter}>
                Adopt a letter <span className="arw">→</span>
              </a>
              <a className="btn btn--onimg" href={links.submitLetter}>
                Write a letter
              </a>
            </R>
          </div>
        </div>
      </section>

      {/* GLADIATORS NYC — the paper tears open into the other half of the work.
          This is what replaced the two side-by-side duotone pillar blocks.
          topTearFill is red-deep: what sits directly above is the Letters band,
          so a paper-filled tear would show a seam. */}
      <PhotoBand
        src="/images/gallery/Gladiators_Byline_Luca_Venter_7_c7cd4b52ab.jpg"
        objectPosition="50% 38%"
        topTearFill="var(--color-red-deep)"
      >
        <R as="h2" className="big narrow-16">
          Gladiators NYC, and it costs <Mark>nothing</Mark>
        </R>
        <R as="p" delay={80} className="lede">
          Full-contact armored combat and fitness, taught free in Harlem since 2013. The oldest
          league of its kind in the city.
        </R>
        <R
          as="ul"
          delay={130}
          className="facts facts--onimg"
          style={{ marginTop: 40, maxWidth: 840 }}
        >
          <li>
            <h3>Whoever shows up</h3>
            <p>Kids, adults, women, veterans. Beginners are the point, not the exception.</p>
          </li>
          <li>
            <h3>Six classes a week</h3>
            <p>Bootcamp, fundamentals, armored practice, and three more.</p>
          </li>
          <li>
            <h3>Booked on gladiators.nyc</h3>
            <p>Schedule and sign-up live there. One account works on both sites.</p>
          </li>
        </R>
        <R delay={190} className="linkrow" style={{ marginTop: 36, gap: 12 }}>
          <a className="btn btn--red" href={links.training}>
            See the classes <span className="arw">→</span>
          </a>
          <a className="btn btn--onimg" href={links.online}>
            Train online
          </a>
        </R>
      </PhotoBand>

      {/* The founder on why there are two programs. Verbatim. */}
      <section className="sec">
        <Wrap>
          <div className="quoteblock">
            <R as="figure" className="figbox">
              <Image
                src="/images/headshot.png"
                alt={`${founder.name}, founder of Santa's Knights`}
                fill
                sizes="(min-width: 900px) 34vw, 100vw"
                style={{ objectPosition: "50% 30%" }}
              />
            </R>
            <R delay={120} className="mcenter">
              <blockquote>
                &ldquo;{markWord(founder.programsQuote, "entirely", true)}&rdquo;
              </blockquote>
              <p className="attr">
                <b>{founder.name}</b>
                {founder.role}
              </p>
            </R>
          </div>
        </Wrap>
      </section>

      {/* Ways to help — a hairline list, not a poster band. No "all of it is
          tax-deductible" line: it isn't true of volunteered time, and the
          footer already carries the fact once. */}
      <section className="sec sec--tight">
        <Wrap>
          <R as="h2" className="big mcenter">
            Ways to help
          </R>
          <R delay={110} className="ways ways--air">
            {waysToHelp.map((way) => (
              <a key={way.title} href={way.href}>
                <strong>{way.title}</strong>
                <span>{way.body}</span>
                <em>{way.action}</em>
              </a>
            ))}
          </R>
        </Wrap>
      </section>

      <section className="closer">
        <Wrap>
          <div className="in">
            <R>
              <h2>
                Everything here is free because <Mark alt>somebody paid</Mark> for it.
              </h2>
              <p>That somebody is usually a person like you.</p>
            </R>
            <R delay={100} className="cta-wrap">
              <HandArrow />
              <a className="btn btn--ink" href={links.donate}>
                Donate <span className="arw">→</span>
              </a>
            </R>
          </div>
        </Wrap>
      </section>
    </RedesignShell>
  );
}
