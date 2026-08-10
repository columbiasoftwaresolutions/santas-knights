"use client";

import { useActionState, useEffect, useState } from "react";
import { recordDonationIntent, type DonationState } from "@/app/actions/donations";
import { giveLabel, PRESET_AMOUNTS, type DonationFrequency } from "@/content/billing";
import { links } from "@/content/site";

/**
 * The donation widget: pick a frequency and an amount, see what it buys, give.
 *
 * Two steps on purpose. Step one is the demo's card — frequency, amount, impact,
 * one button — which is all most people want to look at. Step two collects the
 * name and email, because the gift has to produce a `donations` row before the
 * donor leaves for the processor: that row is the org's only record of the lead
 * and the basis for the tax acknowledgment. Payment itself never happens here
 * (Plan v2: no on-site card capture); `recordDonationIntent` writes the row and
 * hands back the checkout URL for this amount + frequency.
 */

const IMPACT: Record<string, Record<DonationFrequency, string>> = {
  "20": {
    monthly: "buys a wrapped gift for one kid, every month.",
    one_time: "buys a wrapped gift for one kid this Christmas.",
  },
  "50": {
    monthly: "buys a gift and a foam sword each month — a present, and a way into the class.",
    one_time: "buys a gift and a foam sword — a present, and a way into the class.",
  },
  "100": {
    monthly: "covers two kids a month: a gift and a foam sword each.",
    one_time: "covers two kids: a gift and a foam sword each.",
  },
  "250": {
    monthly: "covers five kids a month: a gift and a foam sword each.",
    one_time: "covers five kids: a gift and a foam sword each.",
  },
};

const OTHER_IMPACT = "Every dollar goes to gifts, equipment, and keeping the classes at $0.";

const initial: DonationState = { ok: false };

export function GiveCard() {
  const [state, formAction, pending] = useActionState(recordDonationIntent, initial);
  const [frequency, setFrequency] = useState<DonationFrequency>("monthly");
  const [preset, setPreset] = useState<number | "other">(50);
  const [custom, setCustom] = useState("");
  const [step, setStep] = useState<"amount" | "details">("amount");

  const amount = preset === "other" ? (custom ? Number(custom) : null) : preset;
  const impact = preset === "other" || !amount ? OTHER_IMPACT : IMPACT[String(preset)][frequency];

  // On success the action hands back the checkout URL for this gift.
  useEffect(() => {
    if (state.ok && state.redirect) window.location.href = state.redirect;
  }, [state]);

  if (state.ok) {
    return (
      <div className="give-card">
        <h2>Thank you</h2>
        <p className="rd-muted" style={{ fontSize: 15.5, lineHeight: 1.6 }}>
          {state.redirect
            ? "Sending you to our secure payment page to finish your gift…"
            : "We've recorded your pledge and will be in touch with a receipt."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="give-card">
      <input type="hidden" name="amount" value={amount ?? ""} />
      <input type="hidden" name="frequency" value={frequency} />

      <h2>Give</h2>

      <div className="seg" role="group" aria-label="Donation frequency">
        {(["monthly", "one_time"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={frequency === value}
            onClick={() => setFrequency(value)}
          >
            {value === "monthly" ? "Monthly" : "One-time"}
          </button>
        ))}
      </div>

      <div className="amts" role="group" aria-label="Amount">
        {PRESET_AMOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={preset === value}
            onClick={() => setPreset(value)}
          >
            ${value}
          </button>
        ))}
        <button
          type="button"
          className="other"
          aria-pressed={preset === "other"}
          onClick={() => setPreset("other")}
        >
          Another amount
        </button>
      </div>

      {preset === "other" && (
        <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
          <label htmlFor="custom_amount">Your amount</label>
          <input
            id="custom_amount"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            placeholder="75"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
          />
        </div>
      )}

      <p className="impact" aria-live="polite">
        {preset === "other" || !amount ? (
          impact
        ) : (
          <span>
            <b>
              ${amount}
              {frequency === "monthly" ? " a month" : ""}
            </b>{" "}
            {impact}
          </span>
        )}
      </p>

      {step === "amount" ? (
        <button
          type="button"
          className="btn btn--red btn--wide"
          disabled={!amount}
          onClick={() => setStep("details")}
        >
          <span>{giveLabel(amount, frequency)}</span>
          <span className="arw">→</span>
        </button>
      ) : (
        <>
          <div className="fieldrow fieldrow--even">
            <div className="field">
              <label htmlFor="first_name">First name</label>
              <input id="first_name" name="first_name" required autoComplete="given-name" />
            </div>
            <div className="field">
              <label htmlFor="last_name">Last name</label>
              <input id="last_name" name="last_name" required autoComplete="family-name" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="donor_email">Email, for your receipt</label>
            <input
              id="donor_email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
            />
          </div>

          <div className="field">
            <label htmlFor="designation">Direct my gift to</label>
            <select id="designation" name="designation" defaultValue="">
              <option value="">Where it&apos;s needed most</option>
              <option value="santas_letters">Santa&apos;s Letters (holiday gifts)</option>
              <option value="free_classes">Free classes &amp; equipment</option>
              <option value="events">Community events</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="dedicate_to">Dedicate this gift</label>
            <input id="dedicate_to" name="dedicate_to" placeholder="In honor of…" />
            <p className="hint">Optional. We&apos;ll note it on the receipt.</p>
          </div>

          {state.message && <p className="notice notice--red">{state.message}</p>}

          <button type="submit" className="btn btn--red btn--wide" disabled={pending}>
            <span>{pending ? "One moment…" : giveLabel(amount, frequency)}</span>
            <span className="arw">→</span>
          </button>

          <p className="give-foot" style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => setStep("amount")}
              style={{
                background: "none",
                border: 0,
                padding: 0,
                font: "inherit",
                color: "inherit",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Change the amount
            </button>
          </p>
        </>
      )}

      <p className="give-foot">
        Payment is handled off-site. Or use <a href={links.paypal}>PayPal</a> or{" "}
        <a href={links.venmo}>Venmo</a>.
      </p>
    </form>
  );
}
