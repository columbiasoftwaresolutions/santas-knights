"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SwipeDeck, type SwipeLetter } from "@/components/letters/SwipeDeck";
import { SubmitLetterForm } from "@/components/letters/SubmitLetterForm";
import { DONOR_TERMS_SUMMARY } from "@/content/consent";
import { giftGuidance, privacyInstruction, links } from "@/content/site";

type View = "adopt" | "submit";

const VIEWS: View[] = ["adopt", "submit"];

const ADOPT_NEXT = "/letters";
const SUBMIT_NEXT = "/letters?do=submit";

/** Copy that swaps with the active view. Photo + toggle stay put underneath. */
const HERO: Record<View, { title: React.ReactNode; intro: React.ReactNode }> = {
  adopt: {
    title: (
      <>
        Pick a letter off the <em>pile</em>.
      </>
    ),
    intro: (
      <>
        One letter at a time, the way it&apos;s always worked. Swipe right (or tap{" "}
        <strong className="font-bold">Gift this</strong>) to grant the wish on Amazon. Swipe left to
        read the next one.
        <span className="mt-3 block text-[13.5px] font-semibold tracking-[0.04em] text-red uppercase">
          Suggested gift value: $20–50 per child/person.
        </span>
      </>
    ),
  },
  submit: {
    title: (
      <>
        Send us your child&apos;s <em>letter</em>.
      </>
    ),
    intro: (
      <>
        This side is for parents and guardians. It takes about five minutes: a photo of the
        handwritten letter, the wish, and a gift link. A free account keeps you posted on its status.
      </>
    ),
  },
};

const SUBMIT_EXPECTATIONS: { title: string; body: string }[] = [
  {
    title: "You submit, it goes live",
    body: "The letter joins the gift pool right away. Admins can remove anything that needs attention.",
  },
  {
    title: "Identity stays private",
    body: "Donors only ever see a first name, an age, the wish, and the letter itself. Everything else stays with us.",
  },
  {
    title: "Gifts come via Amazon",
    body: "Donors buy from the link you provide. We never handle the money, and nobody gets anyone's address.",
  },
];

const FADE_MS = 190;

/**
 * Faint grayscale paper grain, generated procedurally (no image asset), layered
 * under the letters flow so the swipe surface reads as warm paper rather than
 * flat cream. Multiplied at low opacity — a whisper of texture, not a scene.
 */
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='pg'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pg)'/%3E%3C/svg%3E")`;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function LettersPortal({
  initialView,
  signedIn,
  defaultEmail,
  defaultName,
  letters,
  demo,
}: {
  initialView: View;
  signedIn: boolean;
  defaultEmail?: string;
  defaultName?: string;
  /** null when Supabase isn't configured or the drive isn't open yet. */
  letters: SwipeLetter[] | null;
  demo: boolean;
}) {
  // `view` drives the hero caption + toggle indicator and updates instantly.
  // The two captions are stacked (both mounted) so the header column always
  // reserves the taller side's height — switching never reflows the header, so
  // the page doesn't jump. `bodyView` is the body, swapped at the midpoint of
  // its crossfade so the panel fades out, swaps, then fades back in.
  const [view, setView] = useState<View>(initialView);
  const [bodyView, setBodyView] = useState<View>(initialView);
  const [shown, setShown] = useState(true);
  const timer = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => void (timer.current && window.clearTimeout(timer.current)), []);

  const switchView = useCallback(
    (next: View) => {
      if (next === view) return;
      setView(next);
      // The URL stays a constant `/letters` while toggling — one canonical link
      // for the page. `?do=submit` only sets the initial side on first load.

      const commit = () => {
        setBodyView(next);
        setShown(true);
        // Move SR focus to the freshly shown panel without yanking scroll.
        window.requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
      };

      if (prefersReducedMotion()) {
        commit();
        return;
      }
      setShown(false);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(commit, FADE_MS);
    },
    [view],
  );

  const bodyFade = cn(
    "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
    shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
  );

  return (
    <>
      {/* Hero: swapping title/intro on the left, a constant photo on the right,
          and the toggle that drives it all. */}
      <section className="border-b border-line bg-paper py-[clamp(56px,7vw,96px)] text-ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div>
              {/* Both captions live in one grid cell so the column always keeps
                  the taller side's height — toggling never reflows the header. */}
              <div className="grid">
                {VIEWS.map((v) => (
                  <div
                    key={v}
                    aria-hidden={v !== view}
                    className={cn(
                      "[grid-area:1/1] transition-opacity duration-200 ease-out motion-reduce:transition-none",
                      v === view ? "opacity-100" : "pointer-events-none opacity-0",
                    )}
                  >
                    <h1 className="font-display text-[clamp(46px,7vw,104px)] leading-[0.88] font-black tracking-[-0.04em] uppercase [&_em]:font-serif [&_em]:font-normal [&_em]:normal-case [&_em]:italic [&_em]:text-red">
                      {HERO[v].title}
                    </h1>
                    <div className="mt-6 max-w-[44ch] text-[clamp(16px,1.5vw,19px)] leading-[1.6] text-muted">
                      {HERO[v].intro}
                    </div>
                  </div>
                ))}
              </div>

              {/* The toggle — square poster control with a sliding accent. */}
              <div
                role="tablist"
                aria-label="Choose what to do"
                className="relative mt-9 inline-grid w-full max-w-[440px] grid-cols-2 border-[1.5px] border-ink bg-paper select-none"
              >
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-y-0 left-0 z-0 w-1/2 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    view === "adopt" ? "bg-red" : "bg-green",
                  )}
                  style={{ transform: view === "submit" ? "translateX(100%)" : "translateX(0%)" }}
                />
                <button
                  type="button"
                  role="tab"
                  id="tab-adopt"
                  aria-selected={view === "adopt"}
                  aria-controls="letters-panel"
                  onClick={() => switchView("adopt")}
                  className={cn(
                    "relative z-10 px-4 py-[15px] text-center text-[13px] font-bold tracking-[0.07em] uppercase transition-colors duration-200",
                    view === "adopt" ? "text-white" : "text-ink hover:text-red",
                  )}
                >
                  Adopt a letter
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-submit"
                  aria-selected={view === "submit"}
                  aria-controls="letters-panel"
                  onClick={() => switchView("submit")}
                  className={cn(
                    "relative z-10 px-4 py-[15px] text-center text-[13px] font-bold tracking-[0.07em] uppercase transition-colors duration-200",
                    view === "submit" ? "text-white" : "text-ink hover:text-green",
                  )}
                >
                  Submit a letter
                </button>
              </div>
            </div>

            <Photo
              src="/images/gallery/48362591_10161478136885422_5477524744964145152_o.jpg"
              alt="A child opening a wrapped gift at a Santa's Knights holiday event"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
              className="aspect-[3/2]"
            />
          </div>
        </Container>
      </section>

      {/* Body: the active flow, crossfaded with the hero copy above. A faint
          procedural paper grain warms the swipe surface into a "desk" — no
          literal photo. It sits behind the panel; the opaque letter cards keep
          the content perfectly legible. No overflow-hidden here: the submit
          side's sticky sidebar must keep working. */}
      <section className="relative bg-paper pt-[46px] pb-section text-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply"
          style={{ backgroundImage: PAPER_GRAIN, backgroundSize: "160px 160px", opacity: 0.09 }}
        />
        <div
          id="letters-panel"
          ref={panelRef}
          role="tabpanel"
          tabIndex={-1}
          aria-labelledby={bodyView === "adopt" ? "tab-adopt" : "tab-submit"}
          className={cn("relative z-10 outline-none", bodyFade)}
        >
          {bodyView === "adopt" ? (
            <AdoptPanel signedIn={signedIn} letters={letters} demo={demo} />
          ) : (
            <SubmitPanel signedIn={signedIn} defaultEmail={defaultEmail} defaultName={defaultName} />
          )}
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Adopt side                                                                 */
/* -------------------------------------------------------------------------- */

function AdoptPanel({
  signedIn,
  letters,
  demo,
}: {
  signedIn: boolean;
  letters: SwipeLetter[] | null;
  demo: boolean;
}) {
  return (
    <Container className="max-w-[640px]">
      {!signedIn ? (
        <SignInGate
          tone="red"
          title="Read a kid's letter, send the gift"
          body="Log in and we'll show you the letters one at a time. Pick one, buy the gift on Amazon, and we keep the kid's details private the whole way."
          cta="Log in to gift a kid"
          next={ADOPT_NEXT}
          footnote={DONOR_TERMS_SUMMARY}
        />
      ) : letters === null ? (
        <EmptyState
          title="The letter drive isn't open yet"
          body="The letter drive is not open yet. Join the email list on the homepage to hear when letters are available."
        />
      ) : letters.length === 0 ? (
        <EmptyState
          title="The pile is empty"
          body="Every live letter has been adopted. New letters will appear as families submit them."
        />
      ) : (
        <>
          {demo && (
            <p className="mb-6 border border-amber bg-gold-soft/60 px-5 py-3 text-center text-[14px] font-bold text-[#6c5418]">
              Demo mode. These are sample letters, not real submissions.
            </p>
          )}
          <SwipeDeck letters={letters} claimable={!demo} />
        </>
      )}

      {signedIn && (
        <p className="mx-auto mt-10 max-w-[58ch] text-center text-[13.5px] leading-relaxed text-muted">
          <strong className="font-bold">The fine print:</strong> {DONOR_TERMS_SUMMARY}
        </p>
      )}
    </Container>
  );
}

/* -------------------------------------------------------------------------- */
/* Submit side                                                                */
/* -------------------------------------------------------------------------- */

function SubmitPanel({
  signedIn,
  defaultEmail,
  defaultName,
}: {
  signedIn: boolean;
  defaultEmail?: string;
  defaultName?: string;
}) {
  return (
    <Container className="grid items-start gap-10 lg:grid-cols-[0.62fr_0.38fr] lg:gap-[54px]">
      {signedIn ? (
        <Card className="p-[34px] md:p-[42px]">
          <SubmitLetterForm defaultEmail={defaultEmail} defaultName={defaultName} />
        </Card>
      ) : (
        <SignInGate
          tone="green"
          title="Sign in to submit a letter"
          body="A free account lets us reach you about the letter and lets you track its status. It only takes a minute."
          cta="Create a free account"
          ctaHref={`${links.accountRegister}?next=${encodeURIComponent(SUBMIT_NEXT)}`}
          next={SUBMIT_NEXT}
        />
      )}

      <div className="grid gap-7 lg:sticky lg:top-[110px]">
        <div className=" border border-green/30 bg-green-soft/40 p-6 text-[14.5px] text-[#1f4a2f]">
          <strong className="font-extrabold">Gift value guidance:</strong> {giftGuidance.submit}
        </div>
        <div className=" border border-red/20 bg-red/5 p-6 text-[14.5px] text-[#6b1a1a]">
          <strong className="font-extrabold">Privacy reminder:</strong> {privacyInstruction}
        </div>
        {SUBMIT_EXPECTATIONS.map((item) => (
          <div key={item.title} className="flex gap-4">
            <span aria-hidden className="mt-1 text-[18px] text-green">
              ✦
            </span>
            <div>
              <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">{item.title}</h2>
              <p className="mt-1 text-[15px] text-muted">{item.body}</p>
            </div>
          </div>
        ))}
        <div className=" border border-line bg-gold-soft/50 p-6 text-[14.5px] text-[#6c5418]">
          <strong className="font-extrabold">Before you upload:</strong> check the letter photo for
          identifying details such as last names, addresses, school names, or phone numbers. Crop or
          cover them before uploading.
        </div>
      </div>
    </Container>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared gated states                                                        */
/* -------------------------------------------------------------------------- */

function SignInGate({
  tone,
  title,
  body,
  cta,
  ctaHref,
  next,
  footnote,
}: {
  tone: "red" | "green";
  title: string;
  body: string;
  cta: string;
  /** Defaults to the login link; pass a register link to lead with sign-up. */
  ctaHref?: string;
  next: string;
  footnote?: string;
}) {
  const login = `${links.accountLogin}?next=${encodeURIComponent(next)}`;
  const register = `${links.accountRegister}?next=${encodeURIComponent(next)}`;
  const leadsWithRegister = ctaHref === register;

  return (
    <Card className="p-[42px] text-center">
      <div aria-hidden className={cn("text-[40px]", tone === "red" ? "text-red" : "text-green")}>
        ♔
      </div>
      <h2 className="mt-2 text-h3">{title}</h2>
      <p className="mx-auto mt-2.5 max-w-[44ch] text-muted">{body}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button href={ctaHref ?? login} variant={tone === "red" ? "red" : "green"} arrow>
          {cta}
        </Button>
        {leadsWithRegister && (
          <Button href={login} variant="ghost">
            Sign in
          </Button>
        )}
      </div>
      {!leadsWithRegister && (
        <p className="mt-4 text-[14px] text-muted">
          No account yet?{" "}
          <a href={register} className="font-bold text-ink underline">
            Sign up
          </a>
          .
        </p>
      )}
      {footnote && (
        <p className="mx-auto mt-6 max-w-[52ch] text-[13px] leading-relaxed text-muted/80">
          {footnote}
        </p>
      )}
    </Card>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-line bg-paper-raised p-[42px] text-center">
      <div aria-hidden className="text-[40px] text-green">
        ✶
      </div>
      <h2 className="mt-3 text-h3">{title}</h2>
      <p className="mx-auto mt-2.5 max-w-[46ch] text-muted">{body}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button href={links.donate} variant="green">
          Donate instead
        </Button>
      </div>
    </div>
  );
}
