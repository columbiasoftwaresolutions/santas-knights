"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { contactReasons, org } from "@/content/site";
import { sendContactMessage, type EngagementState } from "@/app/actions/engagement";

const fieldBase =
  "w-full border-[1.5px] border-line bg-paper-raised px-[18px] py-[13px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

const initialState: EngagementState = { ok: false };

/**
 * Contact capture. Messages are stored in Supabase (and forwarded by email
 * when Resend is configured); the error path always offers a mailto so the
 * form is never a dead end.
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
      <div className="border border-green/40 bg-green-soft p-[34px] text-center">
        <div aria-hidden className="text-[34px] text-green">
          ♔
        </div>
        <h3 className="mt-2 text-h3 text-green">Got it, thanks</h3>
        <p className="mx-auto mt-2 max-w-[42ch] text-muted">
          We received your message. We usually reply within a few days. If you need us sooner,
          email{" "}
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
          <label htmlFor="name" className={labelBase}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={defaultName ?? undefined}
            placeholder="Your name"
            className={fieldBase}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
          <input
            id="email"
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
        <label htmlFor="reason" className={labelBase}>
          I&apos;m reaching out about
        </label>
        <select id="reason" name="reason" defaultValue="letters" className={fieldBase}>
          {contactReasons.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelBase}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us how we can help…"
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
          {pending ? "Sending…" : "Send message"}
        </Button>
        <span className="text-[13.5px] text-muted">We typically reply within a few days.</span>
      </div>
    </form>
  );
}
