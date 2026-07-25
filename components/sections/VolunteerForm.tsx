"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { org, volunteerRoles } from "@/content/site";
import { sendVolunteerApplication, type EngagementState } from "@/app/actions/engagement";

const fieldBase =
  "w-full border-[1.5px] border-line bg-paper-raised px-[18px] py-[13px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

const initialState: EngagementState = { ok: false };

/**
 * Volunteer application. Submissions land in the admin inbox tagged
 * `reason: "employment"`. Name / email / phone are pre-filled from the signed-in
 * profile when available; the roles are checkboxes from `volunteerRoles`.
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
      <div className="border border-green/40 bg-green-soft p-[34px] text-center">
        <div aria-hidden className="text-[34px] text-green">
          ♔
        </div>
        <h3 className="mt-2 text-h3 text-green">Application received</h3>
        <p className="mx-auto mt-2 max-w-[42ch] text-muted">
          Thanks for offering to help. We&apos;ll be in touch about next steps. If you need us
          sooner, email{" "}
          <a href={`mailto:${org.email}`} className="font-semibold text-green underline">
            {org.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="v-name" className={labelBase}>
            Name
          </label>
          <input
            id="v-name"
            name="name"
            required
            defaultValue={defaultName ?? undefined}
            placeholder="Your name"
            className={fieldBase}
          />
        </div>
        <div>
          <label htmlFor="v-email" className={labelBase}>
            Email
          </label>
          <input
            id="v-email"
            name="email"
            type="email"
            required
            defaultValue={defaultEmail ?? undefined}
            placeholder="you@email.com"
            className={fieldBase}
          />
        </div>
      </div>

      <div>
        <label htmlFor="v-phone" className={labelBase}>
          Phone
        </label>
        <input
          id="v-phone"
          name="phone"
          type="tel"
          defaultValue={defaultPhone ?? undefined}
          placeholder="(212) 555-0123"
          className={fieldBase}
        />
      </div>

      <fieldset>
        <legend className={labelBase}>Which volunteer roles would you like to apply to?</legend>
        <div className="mt-1 grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {volunteerRoles.map((role) => (
            <label
              key={role}
              className="flex cursor-pointer items-center gap-3 border-b border-line py-3 text-[15.5px] font-semibold text-ink last:border-b-0"
            >
              <input
                type="checkbox"
                name="roles"
                value={role}
                className="h-[18px] w-[18px] shrink-0 accent-red"
              />
              {role}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="v-message" className={labelBase}>
          Message <span className="font-normal normal-case tracking-normal text-muted/70">(optional)</span>
        </label>
        <textarea
          id="v-message"
          name="message"
          rows={4}
          placeholder="Tell us a little about your availability or experience…"
          className={`${fieldBase} resize-y`}
        />
      </div>

      {state.message && !state.ok && (
        <p className="border border-red/30 bg-red/5 px-[18px] py-[14px] text-[14.5px] font-semibold text-red">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="red" arrow disabled={pending}>
          {pending ? "Sending…" : "Submit application"}
        </Button>
        <span className="text-[13.5px] text-muted">Most roles ask for time, not experience.</span>
      </div>
    </form>
  );
}
