"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { contactReasons, org } from "@/content/site";

const fieldBase =
  "w-full rounded-[14px] border-[1.5px] border-line bg-white px-[18px] py-[13px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

/**
 * Contact capture. Submission is a no-op for now — wire to the messaging /
 * email provider when credentials are available (mirrors NewsletterForm).
 * Falls back to a mailto link so the form is never a dead end.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-card border border-line bg-green-soft p-[34px] text-center">
        <div aria-hidden className="text-[34px] text-green">
          ♔
        </div>
        <h3 className="mt-2 text-h3 text-green">Thanks, we&apos;ll be in touch</h3>
        <p className="mx-auto mt-2 max-w-[42ch] text-muted">
          Your message is on its way. We usually reply within a few days. In a hurry? Email us
          directly at{" "}
          <a href={`mailto:${org.email}`} className="font-semibold text-green underline">
            {org.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        // TODO: POST to messaging/email provider. No-op for now.
        setSent(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelBase}>
            Name
          </label>
          <input id="name" name="name" required placeholder="Your name" className={fieldBase} />
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
            placeholder="you@email.com"
            className={fieldBase}
          />
        </div>
      </div>

      <div>
        <label htmlFor="reason" className={labelBase}>
          I&apos;m reaching out about
        </label>
        <select id="reason" name="reason" defaultValue="classes" className={fieldBase}>
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

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="red" arrow>
          Send message
        </Button>
        <span className="text-[13.5px] text-muted">We typically reply within a few days.</span>
      </div>
    </form>
  );
}
