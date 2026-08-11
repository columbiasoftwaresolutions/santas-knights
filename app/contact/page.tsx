import type { Metadata } from "next";
import Image from "next/image";
import { HandArrow } from "@/components/redesign/HandArrow";
import { Mark } from "@/components/redesign/Mark";
import { TornEdge } from "@/components/redesign/PhotoBand";
import { R } from "@/components/redesign/Reveal";
import { RedesignShell, Wrap } from "@/components/redesign/RedesignShell";
import { ContactForm } from "@/components/sections/ContactForm";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { VolunteerForm } from "@/components/sections/VolunteerForm";
import { faqs, org, waysToHelp } from "@/content/site";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Contact · Santa's Knights",
  description:
    "Get in touch with Santa's Knights in Harlem, or apply to volunteer. Visit us at the Manhattanville Community Center or call (212) 873-5818.",
};

const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org.mapsQuery)}`;

/** The three colours, kept. One class per panel, in `waysToHelp` order. */
const PANEL: Record<(typeof waysToHelp)[number]["variant"], string> = {
  green: "p1",
  red: "p2",
  gold: "p3",
};

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <RedesignShell>
      <section className="phead">
        <Wrap>
          <div className="phead-grid">
            <div>
              <R as="h1">
                Get in <Mark>touch</Mark>.
              </R>
            </div>
            <R delay={120} className="linkrow" style={{ paddingBottom: 10 }}>
              <a className="tlink" href={org.phoneHref}>
                {org.phone}
              </a>
              <a className="tlink" href={`mailto:${org.email}`}>
                {org.email}
              </a>
            </R>
          </div>
        </Wrap>
      </section>

      {/* Form + where to find us */}
      <section className="sec sec--tight" style={{ paddingTop: "clamp(34px, 4vw, 56px)" }}>
        <Wrap>
          <div className="split split--rail">
            <R>
              <ContactForm defaultName={user?.name} defaultEmail={user?.email} />
            </R>

            {/* Typeset like letterhead: the venue names itself, so it needs no
                "VISIT" label, and the address is text — the thing you'd
                actually click is the directions. */}
            <R delay={110} className="reach mcenter">
              <h3>{org.venue}</h3>
              <div className="where">
                <address>
                  {org.address1}, {org.address2}
                </address>
                <a className="tlink" href={mapLink} target="_blank" rel="noopener noreferrer">
                  Get directions <span className="arw">↗</span>
                </a>
              </div>

              <div className="lines">
                <a href={org.phoneHref}>{org.phone}</a>
                <a href={`mailto:${org.email}`}>{org.email}</a>
              </div>

              <div
                className="figbox"
                style={{ marginTop: 32, height: "clamp(220px, 24vw, 290px)" }}
              >
                <Image
                  src="/images/hero-community.jpg"
                  alt="Santa's Knights members of all ages together at a community event"
                  fill
                  sizes="(min-width: 960px) 34vw, 100vw"
                />
              </div>
            </R>
          </div>
        </Wrap>
      </section>

      {/* The three colours. Full-bleed and entered through the same torn edge as
          a photo band, so they read as the paper tearing open into colour —
          the one deliberate exception to "no poster CTA bands". */}
      <section
        className="bleed panels"
        style={{ marginTop: "clamp(46px, 6vw, 84px)" }}
        aria-label="Three ways to help"
      >
        <TornEdge edge="top" />
        <TornEdge edge="bottom" />
        {waysToHelp.map((way) => (
          <a key={way.title} className={PANEL[way.variant]} href={way.href}>
            <h2>{way.title}</h2>
            <div className="body">
              <div className="body-in">
                <p>{way.body}</p>
                <span className="go">
                  {way.cta} <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Volunteer application — the former /get-involved page, folded in. */}
      <section className="sec anchored" id="volunteer">
        <Wrap>
          <div className="split split--wide split--top">
            <div className="sticky mcenter">
              <R as="h2" className="big">
                Apply to <Mark alt>volunteer</Mark>
              </R>
              <R as="p" delay={70} className="lede" style={{ maxWidth: "30ch" }}>
                Pick as many roles as you&apos;re open to.
              </R>
            </div>

            <R delay={110}>
              <VolunteerForm
                defaultName={user?.name}
                defaultEmail={user?.email}
                defaultPhone={user?.phone}
              />
            </R>
          </div>
        </Wrap>
      </section>

      <section className="sec sec--tight">
        <Wrap>
          <div className="split split--top">
            <div className="mcenter">
              <R as="h2" className="big">
                Asked <Mark>often</Mark>
              </R>
              <R as="p" delay={110} className="aside-note">
                Anything else?{" "}
                <a className="tlink" style={{ fontSize: "14.5px" }} href={`mailto:${org.email}`}>
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

      <section className="sec sec--tight">
        <Wrap>
          <div className="say">
            <R>
              <h2>
                Know when the letters <Mark alt>go up</Mark>.
              </h2>
            </R>
            <R delay={100}>
              <NewsletterForm defaultEmail={user?.email} />
            </R>
          </div>
        </Wrap>
      </section>

      <section className="closer">
        <Wrap>
          <div className="in">
            <R>
              <h2>
                Or just <Mark>show up</Mark>.
              </h2>
              <p>
                {org.venue}, {org.address1}, Harlem.
              </p>
            </R>
            <R delay={100} className="cta-wrap">
              <HandArrow />
              <a
                className="btn btn--ink"
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions <span className="arw">↗</span>
              </a>
            </R>
          </div>
        </Wrap>
      </section>
    </RedesignShell>
  );
}
