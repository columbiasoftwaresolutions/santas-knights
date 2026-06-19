"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitLetter, type SubmitLetterState } from "@/app/letters/submit/actions";
import { GUARDIAN_CONSENT_TEXT } from "@/content/consent";
import { org } from "@/content/site";

const fieldBase =
  "w-full border-[1.5px] border-line bg-paper px-[18px] py-[13px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

const initialState: SubmitLetterState = { ok: false };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[13.5px] font-semibold text-red">{message}</p>;
}

export function SubmitLetterForm() {
  const [state, formAction, pending] = useActionState(submitLetter, initialState);
  // One Amazon link by default; families with a few wishes can add more rows.
  const [linkIds, setLinkIds] = useState<number[]>([0]);
  const nextLinkId = useRef(1);

  if (state.ok) {
    return (
      <div className="border border-green/40 bg-green-soft p-[34px] text-center">
        <div aria-hidden className="text-[34px] text-green">
          ♔
        </div>
        <h3 className="mt-2 text-h3 text-green">The letter is in</h3>
        <p className="mx-auto mt-2 max-w-[46ch] text-muted">
          Thank you. A real person reviews every letter before it is published. We&apos;ll email you
          if we need a clearer photo or more information. The child&apos;s identity stays private.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-6">
      {/* The child & the wish */}
      <fieldset className="grid gap-5">
        <legend className="mb-1 text-[13px] font-bold uppercase tracking-[0.12em] text-green">
          The child &amp; the wish
        </legend>
        <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
          <div>
            <label htmlFor="child_first_name" className={labelBase}>
              Child&apos;s first name
            </label>
            <input
              id="child_first_name"
              name="child_first_name"
              required
              placeholder="First name only"
              className={fieldBase}
            />
            <FieldError message={state.errors?.child_first_name} />
          </div>
          <div>
            <label htmlFor="child_age" className={labelBase}>
              Age
            </label>
            <input
              id="child_age"
              name="child_age"
              type="number"
              min={0}
              max={17}
              required
              placeholder="8"
              className={fieldBase}
            />
            <FieldError message={state.errors?.child_age} />
          </div>
        </div>
        <div>
          <label htmlFor="wish_note" className={labelBase}>
            What are they wishing for?
          </label>
          <textarea
            id="wish_note"
            name="wish_note"
            required
            rows={3}
            placeholder="Write a line or two in your own words. Donors read this next to the letter."
            className={`${fieldBase} resize-y`}
          />
          <FieldError message={state.errors?.wish_note} />
        </div>
        <div>
          <label htmlFor="amazon_url" className={labelBase}>
            Amazon link(s)
          </label>
          <div className="grid gap-2.5">
            {linkIds.map((id, i) => (
              <div key={id} className="flex gap-2">
                <input
                  id={i === 0 ? "amazon_url" : undefined}
                  name="amazon_url"
                  type="url"
                  required={i === 0}
                  placeholder="https://www.amazon.com/…"
                  className={fieldBase}
                />
                {linkIds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLinkIds((ids) => ids.filter((x) => x !== id))}
                    aria-label={`Remove link ${i + 1}`}
                    className="flex-none border-[1.5px] border-line px-4 text-[14px] font-bold text-muted hover:border-red hover:text-red"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13.5px] text-muted">
              Donors buy the gift from these links, so check each one before submitting. Any
              Amazon country site is fine.
            </p>
            <button
              type="button"
              onClick={() => setLinkIds((ids) => [...ids, nextLinkId.current++])}
              className="text-[13.5px] font-bold text-green hover:underline"
            >
              + Add another link
            </button>
          </div>
          <FieldError message={state.errors?.amazon_url} />
        </div>
        <div>
          <label htmlFor="letter_image" className={labelBase}>
            Photo of the handwritten letter
          </label>
          <input
            id="letter_image"
            name="letter_image"
            type="file"
            accept="image/*"
            required
            className={`${fieldBase} file:mr-4 file:border-0 file:bg-green-soft file:px-4 file:py-1.5 file:text-[13.5px] file:font-bold file:text-green`}
          />
          <p className="mt-1.5 text-[13.5px] text-muted">
            Donors see this image on the front of the card. A clear phone photo works well.
            Please make sure no last name, address, or school name is visible.
          </p>
          <FieldError message={state.errors?.letter_image} />
        </div>
      </fieldset>

      {/* The grown-up */}
      <fieldset className="grid gap-5">
        <legend className="mb-1 text-[13px] font-bold uppercase tracking-[0.12em] text-green">
          Parent or guardian (kept private)
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="guardian_name" className={labelBase}>
              Your name
            </label>
            <input
              id="guardian_name"
              name="guardian_name"
              required
              placeholder="Full name"
              className={fieldBase}
            />
            <FieldError message={state.errors?.guardian_name} />
          </div>
          <div>
            <label htmlFor="guardian_email" className={labelBase}>
              Your email
            </label>
            <input
              id="guardian_email"
              name="guardian_email"
              type="email"
              required
              placeholder="you@email.com"
              className={fieldBase}
            />
            <FieldError message={state.errors?.guardian_email} />
          </div>
        </div>
        <p className="text-[13.5px] text-muted">
          We only use this to reach you about the letter. It is never shown publicly or shared
          with donors.
        </p>
      </fieldset>

      {/* Consent */}
      <fieldset>
        <legend className="mb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-green">
          Consent
        </legend>
        <div className="max-h-[210px] overflow-y-auto whitespace-pre-line border border-line bg-paper p-[18px] text-[13.5px] leading-relaxed text-muted">
          {GUARDIAN_CONSENT_TEXT}
        </div>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-[15px] font-semibold">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-[18px] w-[18px] accent-[#2E5E45]"
          />
          I am this child&apos;s parent or legal guardian, and I agree to the terms above.
        </label>
        <FieldError message={state.errors?.consent} />
      </fieldset>

      {state.message && !state.ok && (
        <div className="border border-red/30 bg-red/5 px-[18px] py-[14px] text-[14.5px] font-semibold text-red">
          {state.message}{" "}
          {state.message.includes("email us") && (
            <a href={`mailto:${org.email}`} className="underline">
              {org.email}
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="green" arrow disabled={pending}>
          {pending ? "Sending…" : "Submit the letter"}
        </Button>
        <span className="text-[13.5px] text-muted">
          Reviewed by a real person before anything goes live.
        </span>
      </div>
    </form>
  );
}
