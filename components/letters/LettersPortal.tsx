"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { SwipeDeck, type SwipeLetter } from "@/components/letters/SwipeDeck";
import { SubmitLetterForm } from "@/components/letters/SubmitLetterForm";
import { DONOR_TERMS_SUMMARY } from "@/content/consent";
import { giftGuidance, privacyInstruction, links } from "@/content/site";

type View = "adopt" | "submit";

const SUBMIT_NEXT = "/letters-to-santa?do=submit";
const FADE_MS = 190;

const TITLES: Record<View, React.ReactNode> = {
  adopt: "One at a time, the way it always worked",
  submit: "Send us your child’s letter",
};

/** Labelled text, not tinted boxes with accent rails (redesign rule 4). */
const RAIL = [
  {
    tone: "green" as const,
    title: "Gift value guidance",
    body: giftGuidance.submit,
  },
  {
    tone: "red" as const,
    title: "Privacy reminder",
    body: privacyInstruction,
  },
  {
    tone: "ink" as const,
    title: "You submit, it goes live",
    body: "The letter joins the gift pool right away. Admins can remove anything that needs attention.",
  },
  {
    tone: "ink" as const,
    title: "Identity stays private",
    body: "Donors only ever see a first name, an age, the wish, and the letter itself.",
  },
  {
    tone: "ink" as const,
    title: "Gifts come via Amazon",
    body: "Donors buy from the link you provide. We never handle the money, and nobody gets anyone's address.",
  },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The two-sided portal: read the pile, or submit a letter.
 *
 * Reading is public — anyone can browse the letters. The two gated actions are
 * deliberate and different:
 *   · Claiming a letter needs an account (donor ↔ gift link, acknowledgment,
 *     self-dealing guard). Handled inside SwipeDeck.
 *   · Submitting a letter needs an account, because the row carries
 *     `guardian_user_id` — that's what powers "My letters" on /account and how
 *     we reach a guardian about their submission.
 */
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
  // `view` drives the heading and the switch, and updates instantly. `bodyView`
  // is the panel, swapped at the midpoint of its crossfade so the body fades
  // out, swaps, then fades back in.
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
      // The URL stays a constant `/letters-to-santa` while toggling — one canonical link
      // for the page. `?do=submit` only sets the initial side on first load.

      const commit = () => {
        setBodyView(next);
        setShown(true);
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

  return (
    <>
      <div className="mcenter" style={{ display: "grid", gap: 22, marginBottom: 30 }}>
        {/* Both headings share one grid cell, so switching never reflows. */}
        <div style={{ display: "grid" }}>
          {(["adopt", "submit"] as const).map((v) => (
            <h2
              key={v}
              aria-hidden={v !== view}
              className="big"
              style={{
                gridArea: "1/1",
                opacity: v === view ? 1 : 0,
                pointerEvents: v === view ? "auto" : "none",
                transition: "opacity .2s ease",
              }}
            >
              {TITLES[v]}
            </h2>
          ))}
        </div>

        <div className="tabs" data-view={view} role="tablist" aria-label="Choose what to do">
          <span className="slide" aria-hidden />
          <button
            type="button"
            role="tab"
            id="tab-adopt"
            aria-selected={view === "adopt"}
            aria-controls="letters-panel"
            onClick={() => switchView("adopt")}
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
          >
            Submit a letter
          </button>
        </div>
      </div>

      <div
        id="letters-panel"
        ref={panelRef}
        role="tabpanel"
        tabIndex={-1}
        aria-labelledby={bodyView === "adopt" ? "tab-adopt" : "tab-submit"}
        className={cn("panel", !shown && "is-out")}
        style={{ outline: "none" }}
      >
        {bodyView === "adopt" ? (
          <AdoptPanel signedIn={signedIn} letters={letters} demo={demo} />
        ) : (
          <SubmitPanel signedIn={signedIn} defaultEmail={defaultEmail} defaultName={defaultName} />
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Adopt side — public                                                        */
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
  if (letters === null) {
    return (
      <EmptyState
        title="The letter drive isn't open yet"
        body="Join the email list on the homepage to hear when letters are available."
      />
    );
  }
  if (letters.length === 0) {
    return (
      <EmptyState
        title="The pile is empty"
        body="Every live letter has been adopted. New letters will appear as families submit them."
      />
    );
  }

  return (
    <>
      {demo && (
        <p className="notice" style={{ marginBottom: 22 }}>
          Demo mode. These are sample letters, not real submissions.
        </p>
      )}
      <SwipeDeck letters={letters} claimable={!demo} signedIn={signedIn} />
      <p
        className="rd-muted"
        style={{
          margin: "26px auto 0",
          maxWidth: "58ch",
          textAlign: "center",
          fontSize: 13.5,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--color-ink)" }}>The fine print:</strong>{" "}
        {DONOR_TERMS_SUMMARY}
      </p>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Submit side — account required                                             */
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
    <div className="formgrid">
      {signedIn ? (
        <SubmitLetterForm defaultEmail={defaultEmail} defaultName={defaultName} />
      ) : (
        <div className="state">
          <h3>Sign in to submit a letter</h3>
          <p>
            A free account lets us reach you about the letter and lets you track its status. It only
            takes a minute.
          </p>
          <div className="actions">
            <a
              className="btn btn--green"
              href={`${links.accountRegister}?next=${encodeURIComponent(SUBMIT_NEXT)}`}
            >
              Create a free account <span className="arw">→</span>
            </a>
            <a
              className="btn btn--ghost"
              href={`${links.accountLogin}?next=${encodeURIComponent(SUBMIT_NEXT)}`}
            >
              Sign in
            </a>
          </div>
        </div>
      )}

      <div className="rail">
        {RAIL.map((item) => (
          <div key={item.title} className={`item item--${item.tone}`}>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="state">
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="actions">
        <a className="btn btn--ghost" href={links.donate}>
          Donate instead
        </a>
      </div>
    </div>
  );
}
