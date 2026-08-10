"use client";

import { useActionState } from "react";
import { org, volunteerRoles } from "@/content/site";
import { sendVolunteerApplication, type EngagementState } from "@/app/actions/engagement";

const initialState: EngagementState = { ok: false };

/**
 * Volunteer application, the second half of /contact. Submissions land in the
 * admin inbox tagged `reason: "employment"`. Name / email / phone are pre-filled
 * from the signed-in profile when available; the roles are hairline checkbox
 * rows (`.roles`) rather than a grid of boxes.
 */
export function VolunteerForm({
  defaultName,
  defaultEmail,
  defaultPhone,
}: {
  defaultName?: string | null;
  defaultEmail?: string | null;
  defaultPhone?: string | null;
}) {
  const [state, formAction, pending] = useActionState(sendVolunteerApplication, initialState);

  if (state.ok) {
    return (
      <div className="sent">
        <h3>Application received.</h3>
        <p>
          We&apos;ll be in touch about what fits. If you need us sooner, email{" "}
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
      <div className="fieldrow fieldrow--even">
        <div className="field">
          <label htmlFor="v-name">Name</label>
          <input
            id="v-name"
            name="name"
            required
            defaultValue={defaultName ?? undefined}
            placeholder="Your name"
          />
        </div>
        <div className="field">
          <label htmlFor="v-email">Email</label>
          <input
            id="v-email"
            name="email"
            type="email"
            required
            defaultValue={defaultEmail ?? undefined}
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="v-phone">Phone</label>
        <input
          id="v-phone"
          name="phone"
          type="tel"
          defaultValue={defaultPhone ?? undefined}
          placeholder="(212) 555-0123"
        />
      </div>

      <div className="field">
        <fieldset>
          <legend>Which roles would you like to apply to?</legend>
          <div className="roles">
            {volunteerRoles.map((role) => (
              <label key={role.value}>
                <input type="checkbox" name="roles" value={role.value} />
                {role.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="field" style={{ marginTop: 20 }}>
        <label htmlFor="v-message">
          Message{" "}
          <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="v-message"
          name="message"
          placeholder="Tell us a little about your availability or experience…"
        />
      </div>

      {state.message && !state.ok && <p className="formerr">{state.message}</p>}

      <div className="formfoot">
        <button className="btn btn--green" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Submit application"} <span className="arw">→</span>
        </button>
        <span className="note">Most roles ask for time, not experience.</span>
      </div>
    </form>
  );
}
