"use client";

import { useActionState } from "react";
import { submitLetter, type SubmitLetterState } from "@/app/letters/submit/actions";
import { GUARDIAN_CONSENT_TEXT } from "@/content/consent";
import { giftGuidance, org } from "@/content/site";

const initialState: SubmitLetterState = { ok: false };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="err">{message}</p>;
}

/**
 * The guardian side of the portal.
 *
 * Two things here are load-bearing and must not be simplified away:
 *   · The full consent text is rendered above the checkbox, because the server
 *     action stores that exact text and its version on a `consent_records` row.
 *     A one-line "I agree" checkbox would break that contract.
 *   · `gift_summary` is what donors scan the public pile by ("LEGO Technic set
 *     · about $50"), so it's required. It describes the gift, never the child.
 */
export function SubmitLetterForm({
  defaultEmail,
  defaultName,
}: {
  defaultEmail?: string;
  defaultName?: string;
}) {
  const [state, formAction, pending] = useActionState(submitLetter, initialState);

  if (state.ok) {
    return (
      <div className="formcard">
        <h3>The letter is in</h3>
        <p className="sub" style={{ marginBottom: 0 }}>
          Thank you. The letter is live in the gift pool now. The child&apos;s identity stays
          private, and an admin can remove the letter if anything needs attention.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="formcard">
      <h3>Your child&apos;s letter</h3>
      <p className="sub">About five minutes: the letter, the wish, and a gift link.</p>

      <div className="fieldrow">
        <div className="field">
          <label htmlFor="child_first_name">Child&apos;s first name</label>
          <input
            id="child_first_name"
            name="child_first_name"
            required
            placeholder="First name only"
          />
          <FieldError message={state.errors?.child_first_name} />
        </div>
        <div className="field">
          <label htmlFor="child_age">Age</label>
          <input id="child_age" name="child_age" type="number" min={0} max={17} required placeholder="8" />
          <FieldError message={state.errors?.child_age} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="wish_note">The wish</label>
        <textarea
          id="wish_note"
          name="wish_note"
          required
          placeholder="Write a line or two in your own words. Donors read this next to the letter."
        />
        <FieldError message={state.errors?.wish_note} />
      </div>

      <div className="fieldrow">
        <div className="field">
          <label htmlFor="gift_summary">What is it, in a few words?</label>
          <input
            id="gift_summary"
            name="gift_summary"
            required
            maxLength={120}
            placeholder="LEGO Technic set"
          />
          <p className="hint">Shown on the letter card so donors can scan the pile.</p>
          <FieldError message={state.errors?.gift_summary} />
        </div>
        <div className="field">
          <label htmlFor="gift_value_usd">About how much?</label>
          <input
            id="gift_value_usd"
            name="gift_value_usd"
            type="number"
            min={1}
            max={1000}
            step={1}
            inputMode="numeric"
            placeholder="50"
          />
          <p className="hint">Optional. {giftGuidance.submit}</p>
          <FieldError message={state.errors?.gift_value_usd} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="wishlist_url">Amazon wishlist link</label>
        <input
          id="wishlist_url"
          name="wishlist_url"
          type="url"
          required
          placeholder="https://www.amazon.com/hz/wishlist/ls/…"
        />
        <p className="hint">
          Paste your list&apos;s <strong>share link</strong> (Amazon → Lists → the list →
          Invite/Share), set to public or anyone with the link. Donors buy straight from it, so no
          address is ever exchanged.{" "}
          <a
            href="https://www.amazon.com/hz/wishlist/intro"
            target="_blank"
            rel="noopener noreferrer"
          >
            New to wishlists? ↗
          </a>
        </p>
        <FieldError message={state.errors?.wishlist_url} />
      </div>

      <div className="field">
        <label htmlFor="letter_image">Photo of the handwritten letter</label>
        <input id="letter_image" name="letter_image" type="file" accept="image/*" required />
        <p className="hint">
          Donors see this on the front of the card. Crop or cover any last name, address, school, or
          phone number first.
        </p>
        <FieldError message={state.errors?.letter_image} />
      </div>

      <div className="fieldrow fieldrow--even">
        <div className="field">
          <label htmlFor="guardian_name">Your name</label>
          <input
            id="guardian_name"
            name="guardian_name"
            required
            defaultValue={defaultName}
            placeholder="Full name"
          />
          <FieldError message={state.errors?.guardian_name} />
        </div>
        <div className="field">
          <label htmlFor="guardian_email">Your email</label>
          <input
            id="guardian_email"
            name="guardian_email"
            type="email"
            required
            defaultValue={defaultEmail}
            placeholder="you@email.com"
          />
          <FieldError message={state.errors?.guardian_email} />
        </div>
      </div>

      <div className="field">
        <span className="lbl">Consent</span>
        {/* Stored verbatim with the acceptance — see content/consent.ts. */}
        <div className="consent-text">{GUARDIAN_CONSENT_TEXT}</div>
        <label className="consent">
          <input type="checkbox" name="consent" required />
          <span>I am this child&apos;s parent or legal guardian, and I agree to the terms above.</span>
        </label>
        <FieldError message={state.errors?.consent} />
      </div>

      {state.message && !state.ok && (
        <p className="notice notice--red">
          {state.message}{" "}
          {state.message.includes("email us") && <a href={`mailto:${org.email}`}>{org.email}</a>}
        </p>
      )}

      <button type="submit" className="btn btn--green btn--wide" disabled={pending}>
        <span>{pending ? "Sending…" : "Submit the letter"}</span>
        <span className="arw">→</span>
      </button>
      <p className="hint" style={{ marginTop: 10, textAlign: "center" }}>
        Goes live immediately; admins can remove anything that needs attention.
      </p>
    </form>
  );
}
