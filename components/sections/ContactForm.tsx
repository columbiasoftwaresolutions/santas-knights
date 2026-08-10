"use client";

import { useActionState } from "react";
import { contactReasons, org } from "@/content/site";
import { sendContactMessage, type EngagementState } from "@/app/actions/engagement";

const initialState: EngagementState = { ok: false };

/**
 * Contact capture, written on the paper: a field is a ruled line, not a filled
 * box (see `.form-paper` in app/redesign.css). Messages are stored in Supabase
 * (and forwarded by email when Resend is configured); the error path always
 * offers a mailto so the form is never a dead end.
 */
export function ContactForm({
  defaultName,
  defaultEmail,
}: {
  defaultName?: string | null;
  defaultEmail?: string | null;
}) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  if (state.ok) {
    return (
      <div className="sent">
        <h3>Got it.</h3>
        <p>
          We usually reply within a few days. If you need us sooner, email{" "}
          <a className="tlink" style={{ fontSize: "15px" }} href={`mailto:${org.email}`}>
            {org.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="form-paper">
      <h3>Drop us a line</h3>

      <div className="fieldrow fieldrow--even">
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input
            id="c-name"
            name="name"
            required
            defaultValue={defaultName ?? undefined}
            placeholder="Your name"
          />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            defaultValue={defaultEmail ?? undefined}
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-reason">I&apos;m reaching out about</label>
        <select id="c-reason" name="reason" defaultValue="letters">
          {contactReasons.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" required placeholder="Tell us how we can help…" />
      </div>

      {state.message && !state.ok && <p className="formerr">{state.message}</p>}

      <div className="formfoot">
        <button className="btn btn--red" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"} <span className="arw">→</span>
        </button>
        <span className="note">We usually reply within a few days.</span>
      </div>
    </form>
  );
}
