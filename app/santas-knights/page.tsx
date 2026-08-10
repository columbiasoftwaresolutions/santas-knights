import type { Metadata } from "next";
import Image from "next/image";
import { Mark } from "@/components/redesign/Mark";
import { TornEdge } from "@/components/redesign/PhotoBand";
import { R } from "@/components/redesign/Reveal";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";
import { HandArrow } from "@/components/redesign/HandArrow";
import {
  founder,
  links,
  org,
  pressLogos,
  programs,
  sponsors,
  sponsorWays,
  stats,
  timeline,
  values,
} from "@/content/site";

export const metadata: Metadata = {
  title: "About · Santa's Knights",
  description:
    "Santa's Knights is a Harlem 501(c)(3) nonprofit. We answer kids' letters to Santa every December and teach free martial arts and fitness all year.",
  alternates: { canonical: "/santas-knights" },
};

const sponsorMailto = (subject: string) =>
  `mailto:${org.email}?subject=${encodeURIComponent(subject)}`;

/** Class list rows. `programs` carries the short names; the hrefs are the
 *  canonical per-class pages on gladiators.nyc, matched by position. */
const classHrefs = [
  "gladiator-bootcamp",
  "gladiator-armored-practice",
  "womens-medieval-combat-fitness",
  "womens-premium-combat-midtown",
  "military-veterans-combat-training",
  "medieval-combat-fundamentals",
];

export default function AboutPage() {
  return (
    <RedesignShell>
      <section className="phead">
        <Wrap>
          <div className="phead-grid">
            <div>
              <R as="h1">
                What we do, and <Mark>why</Mark>.
              </R>
              <R as="p" delay={80} className="sub">
                A Harlem 501(c)(3). Letters answered every December, martial arts and fitness taught
                free all year.
              </R>
              <R delay={130} className="linkrow">
                <a className="btn btn--red" href={links.adoptLetter}>
                  Read the letters <span className="arw">→</span>
                </a>
                <a className="btn btn--ghost" href={links.getInvolved}>
                  Get involved
                </a>
              </R>
            </div>
            <R
              as="figure"
              delay={170}
              className="figbox"
              style={{ height: "clamp(300px, 34vw, 430px)" }}
            >
              <Image
                src="/images/gallery/6b7494_da7cab87beee4becb1fa08dd5b8bb6b9_mv2.webp"
                alt="Kids training with foam weapons in the gym at a Santa's Knights class"
                fill
                priority
                sizes="(min-width: 900px) 42vw, 100vw"
              />
            </R>
          </div>
        </Wrap>
      </section>

      {/* Air between the columns and one hairline above — never a flood band. */}
      <section className="sec sec--tight">
        <Wrap>
          <R className="stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="n">
                  {stat.value}
                  {stat.unit}
                </div>
                <p className="l">{stat.label}</p>
              </div>
            ))}
          </R>
        </Wrap>
      </section>

      <section className="sec sec--tight" style={{ paddingTop: "clamp(24px, 3vw, 40px)" }}>
        <Wrap>
          <R as="h2" className="mission mission--wide">
            Free martial arts, fitness, and activities for <Mark>everyone</Mark>, equitably.
          </R>
          <R as="p" delay={90} className="lede" style={{ marginTop: 24, maxWidth: "56ch" }}>
            Transcending socioeconomic, racial, and location boundaries, positively changing
            children&apos;s and adults&apos; lives through exposure and lifestyle enhancement.
          </R>
          <R delay={140} className="legal">
            {org.legalName} · a registered 501(c)(3) nonprofit
          </R>
        </Wrap>
      </section>

      {/* The record, over the photo the paper tears open into. Built inline
          rather than with <PhotoBand> because this band carries no heading and
          runs tighter (`imgsec--tl`). */}
      <section className="bleed imgsec imgsec--tl" style={{ marginTop: "clamp(40px, 5vw, 72px)" }}>
        <Image
          src="/images/hero-community.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="bg"
          style={{ objectPosition: "50% 42%" }}
        />
        <div className="veil" />
        <TornEdge edge="top" />
        <TornEdge edge="bottom" />
        <div className="rd-wrap content">
          <ul className="tl" data-reveal>
            {timeline.map((entry) => (
              <li key={entry.when}>
                <span className="when">{entry.when}</span>
                <p>{entry.body}</p>
              </li>
            ))}
            <li>
              <span className="when">Today</span>
              <p className="now">
                Up to <b>400</b> letters a year. <b>Six</b> free classes. <b>$0</b>, always.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Founder */}
      <section className="sec">
        <Wrap>
          <div className="split split--wide split--top">
            <R className="figbox" style={{ height: "clamp(340px, 40vw, 520px)" }}>
              <Image
                src="/images/headshot.png"
                alt={`${founder.name}, founder of Santa's Knights`}
                fill
                sizes="(min-width: 900px) 40vw, 100vw"
                style={{ objectPosition: "50% 20%" }}
              />
            </R>
            <div>
              <R as="h2" className="big">
                {founder.name}
              </R>
              <R as="p" delay={60} className="role">
                {founder.role}
              </R>
              <R delay={110} className="bio">
                {founder.bio.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </R>
            </div>
          </div>
        </Wrap>
      </section>

      {/* The letter program */}
      <section className="sec sec--tight">
        <Wrap>
          <div className="split split--top">
            <div>
              <R as="h2" className="big">
                Every kid deserves an <Mark alt>answer</Mark>
              </R>
              <R as="p" delay={70} className="lede">
                Each December, children around the world write to Santa. We make sure those letters
                don&apos;t go unanswered. You read a wish, pick one, and send the gift — and a kid
                wakes up to something they asked for.
              </R>
              <R delay={120} className="linkrow">
                <a className="btn btn--red" href={links.adoptLetter}>
                  How it works <span className="arw">→</span>
                </a>
                <a className="btn btn--ghost" href={links.getInvolved}>
                  Volunteer
                </a>
              </R>
            </div>
            <R delay={110}>
              <div className="figbox" style={{ height: "clamp(260px, 30vw, 360px)" }}>
                <Image
                  src="/images/gallery/48424779_10161478137715422_7170425562547093504_o.jpg"
                  alt="Santa sitting with a smiling child holding a wrapped gift at a Santa's Knights holiday event"
                  fill
                  sizes="(min-width: 900px) 48vw, 100vw"
                  style={{ objectPosition: "62% center" }}
                />
              </div>
              <p className="rd-muted" style={{ margin: "20px 0 0", fontSize: 15, lineHeight: 1.65, maxWidth: "52ch" }}>
                The idea isn&apos;t new. The Postal Service has been answering kids&apos; letters to
                Santa since 1912, and Damion grew up taking part in it — picking a stranger&apos;s
                letter off the pile and mailing a gift. Santa&apos;s Letters is him running that
                same idea out of Harlem, and reaching a few more kids every year.
              </p>
            </R>
          </div>
        </Wrap>
      </section>

      {/* Values */}
      <section className="sec sec--tight">
        <Wrap>
          <div className="split split--wide split--top">
            <div className="sticky">
              <R as="h2" className="big">
                Four things we <Mark>don&apos;t bend</Mark> on
              </R>
            </div>
            <R delay={80} className="pairs">
              {values.map((value) => (
                <div key={value.title}>
                  <h3>{value.title}</h3>
                  <p>{value.body}</p>
                </div>
              ))}
            </R>
          </div>
        </Wrap>
      </section>

      {/* Gladiators NYC */}
      <section className="sec sec--tight">
        <Wrap>
          <div className="split split--wide split--top">
            <div>
              <R as="h2" className="big">
                Gladiators NYC
              </R>
              <R as="p" delay={70} className="lede">
                The other half of what we do: full-contact armored combat and fitness, taught free in
                Harlem. Damion started it in 2013, and it&apos;s the oldest league of its kind in the
                city.
              </R>
              <R as="p" delay={110} className="aside-note" style={{ maxWidth: "44ch" }}>
                Schedule and booking live on gladiators.nyc. One account works on both sites.
              </R>
              <R delay={150} className="linkrow">
                <a className="btn btn--red" href={links.training}>
                  See the classes <span className="arw">→</span>
                </a>
                <a className="btn btn--ghost" href={links.online}>
                  Online classes
                </a>
              </R>
            </div>
            <R delay={120}>
              <div className="classlist">
                {programs.map((program, index) => (
                  <a
                    key={program.name}
                    href={`https://gladiators.nyc/classes/${classHrefs[index]}`}
                  >
                    <strong>{program.name}</strong>
                    <span>{program.audience}</span>
                  </a>
                ))}
              </div>
            </R>
          </div>
        </Wrap>
      </section>

      {/* ---- Sponsors, folded in ---- */}
      <section
        className="sec sec--tight anchored"
        id="sponsors"
        style={{ paddingTop: "clamp(48px, 6vw, 86px)" }}
      >
        <Wrap>
          <div className="say">
            <R>
              <h2>
                The people who <Mark alt>make it free</Mark>
              </h2>
              <p>Sponsors pay for the gifts, the classes, the gear, and the events.</p>
            </R>
            <R as="span" delay={100}>
              <a className="tlink" href={sponsorMailto("Sponsoring Santa's Knights")}>
                Become a sponsor <span className="arw">→</span>
              </a>
            </R>
          </div>

          {/* Marks sitting straight on the paper — mix-blend-mode drops each
              logo's own white background into it. Plain <img> so every mark
              keeps its true aspect ratio; these are small static files.
              A sponsor is only a link when we actually have a URL for it. */}
          <R delay={120} className="logos">
            {sponsors.map((sponsor) => {
              const mark = sponsor.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sponsor.logo} alt={sponsor.name} loading="lazy" decoding="async" />
              ) : (
                <span className="name">{sponsor.name}</span>
              );
              return sponsor.href ? (
                <a key={sponsor.name} href={sponsor.href} target="_blank" rel="noopener noreferrer">
                  {mark}
                </a>
              ) : (
                <div key={sponsor.name}>{mark}</div>
              );
            })}
          </R>
        </Wrap>
      </section>

      <section className="sec sec--tight" style={{ paddingTop: "clamp(28px, 3.4vw, 44px)" }}>
        <Wrap>
          <div className="headrow">
            <R as="h2" className="big">
              Ways a business can help
            </R>
            <R as="p" delay={70} className="rd-muted" style={{ fontSize: 15 }}>
              Tax-deductible, and publicly credited.
            </R>
          </div>
          <R delay={110} className="ways">
            {sponsorWays.map((way) => (
              <a key={way.title} href={sponsorMailto(way.subject)}>
                <strong>{way.title}</strong>
                <span>{way.body}</span>
                <em>Email us →</em>
              </a>
            ))}
          </R>
          <R as="p" delay={150} className="aside-note">
            Or call{" "}
            <a className="tlink" style={{ fontSize: "14.5px" }} href={org.phoneHref}>
              {org.phone}
            </a>
            .
          </R>
        </Wrap>
      </section>

      <section className="sec sec--tight" style={{ paddingTop: "clamp(24px, 3vw, 40px)" }}>
        <Wrap>
          <R className="press-head">
            <h3>Seen in</h3>
          </R>
          <R delay={80} className="press">
            {pressLogos.map((logo) => (
              <a
                key={logo.name}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${logo.name} — read the story`}
                aria-label={`${logo.name}: read the article (opens in a new tab)`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    height: logo.displayHeight ? `${logo.displayHeight}px` : undefined,
                    maxWidth: logo.maxWidth ? `${logo.maxWidth}px` : undefined,
                  }}
                />
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
                Keep it <Mark>free</Mark>.
              </h2>
              <p>Every dollar is tax-deductible.</p>
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
