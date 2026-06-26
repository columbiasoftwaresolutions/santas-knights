"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { recordDonationIntent, type DonationState } from "@/app/actions/donations";

const PRESETS = [25, 50, 100, 250];
const fieldBase =
  "w-full border-[1.5px] border-line bg-paper px-[16px] py-[12px] text-[15.5px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-2 focus:outline-offset-1 focus:outline-red";
const labelBase = "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted";

const initial: DonationState = { ok: false };

/**
 * Donation-intent form. Captures the donor + designation so the org has a lead
 * and can issue a receipt, then continues to the external processor. No card
 * details are ever collected on-site.
 */
export function DonateForm() {
  const [state, formAction, pending] = useActionState(recordDonationIntent, initial);
  const [amount, setAmount] = useState<number | "">(50);
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");

  // On success with a processor URL, hand off to the external payment page.
  useEffect(() => {
    if (state.ok && state.redirect) window.location.href = state.redirect;
  }, [state]);

  if (state.ok) {
    return (
      <div className="border border-green/40 bg-green-soft px-6 py-8 text-center">
        <p className="text-[34px]">🎁</p>
        <h3 className="mt-2 text-h3">Thank you</h3>
        <p className="mx-auto mt-2 max-w-[40ch] text-muted">
          {state.redirect
            ? "Sending you to our secure payment page to finish your gift…"
            : "We've recorded your pledge and will be in touch with a receipt. Thank you for keeping the programs free."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="amount" value={amount === "" ? "" : amount} />
      <input type="hidden" name="frequency" value={frequency} />

      <div>
        <span className={labelBase}>Amount</span>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(p)}
              className={`cursor-pointer border-[1.5px] py-3 text-[16px] font-extrabold transition-colors ${
                amount === p ? "border-red bg-red text-paper" : "border-line bg-paper text-ink hover:border-red"
              }`}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          placeholder="Other amount"
          value={typeof amount === "number" && !PRESETS.includes(amount) ? amount : ""}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          className={`${fieldBase} mt-2`}
        />
      </div>

      <div>
        <span className={labelBase}>Frequency</span>
        <div className="grid grid-cols-2 gap-2">
          {(["one_time", "monthly"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`cursor-pointer border-[1.5px] py-3 text-[15px] font-bold transition-colors ${
                frequency === f ? "border-green bg-green text-white" : "border-line bg-paper text-ink hover:border-green"
              }`}
            >
              {f === "one_time" ? "One-time" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="first_name" className={labelBase}>First name</label>
          <input id="first_name" name="first_name" required autoComplete="given-name" className={fieldBase} />
        </div>
        <div>
          <label htmlFor="last_name" className={labelBase}>Last name</label>
          <input id="last_name" name="last_name" required autoComplete="family-name" className={fieldBase} />
        </div>
      </div>

      <div>
        <label htmlFor="donor_email" className={labelBase}>Email (for your receipt)</label>
        <input id="donor_email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" className={fieldBase} />
      </div>

      <div>
        <label htmlFor="designation" className={labelBase}>Direct my gift to (optional)</label>
        <select id="designation" name="designation" className={fieldBase} defaultValue="">
          <option value="">Where it&apos;s needed most</option>
          <option value="santas_letters">Santa&apos;s Letters (holiday gifts)</option>
          <option value="free_classes">Free classes &amp; equipment</option>
          <option value="events">Community events</option>
        </select>
      </div>

      <div>
        <label htmlFor="dedicate_to" className={labelBase}>Dedicate this gift (optional)</label>
        <input id="dedicate_to" name="dedicate_to" placeholder="In honor of…" className={fieldBase} />
      </div>

      {state.message && (
        <p className="border border-red/30 bg-red/5 px-[16px] py-[12px] text-[14.5px] font-semibold text-red">
          {state.message}
        </p>
      )}

      <Button type="submit" variant="red" disabled={pending}>
        {pending ? "Processing…" : "Continue to payment"}
      </Button>
      <p className="text-center text-[12.5px] text-muted">
        Payment is handled by our external processor. We never store card details.
      </p>
    </form>
  );
}
