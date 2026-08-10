/**
 * Where a gift actually goes when someone presses "Give".
 *
 * ─── STATUS: RECURRING BILLING IS NOT LIVE YET ──────────────────────────────
 * Santa's Knights has no recurring-billing account configured. Until it does,
 * every monthly link falls through to the PayPal fundraiser, which does support
 * recurring gifts — so the UI is honest and nothing is a dead `#`. This module
 * exists so that turning real billing on is a *data* change (paste URLs into
 * `monthlyPlanUrls` / set the env var) and not a UI change.
 *
 * To go live, do ONE of:
 *   1. Paste a per-amount recurring link into `monthlyPlanUrls` below (Stripe
 *      payment link, Donorbox plan, Givebutter, …). Most precise, and the
 *      donor lands on a page that already knows the amount.
 *   2. Set `NEXT_PUBLIC_BILLING_URL` to a checkout that accepts `?amount=` and
 *      `?frequency=`. Covers every amount including custom ones.
 * Anything left unset keeps falling through to PayPal. See SETUP-TODO.md.
 *
 * Amounts are always carried through as query params so the destination can
 * prefill, and `recordDonationIntent` has already written the `donations` row
 * before the donor leaves — the lead is captured either way.
 */

import { links } from "@/content/site";

export type DonationFrequency = "one_time" | "monthly";

/** The amounts offered in the give card and the membership tiers. */
export const PRESET_AMOUNTS = [20, 50, 100, 250] as const;

/**
 * Per-amount recurring checkout links. PLACEHOLDER — every value is empty until
 * Damion sets up the recurring-billing account. An empty string falls through
 * to `NEXT_PUBLIC_BILLING_URL`, then to PayPal.
 */
export const monthlyPlanUrls: Record<number, string> = {
  20: "", // TODO: paste the $20/mo recurring link
  50: "", // TODO: paste the $50/mo recurring link
  100: "", // TODO: paste the $100/mo recurring link
  250: "", // TODO: paste the $250/mo recurring link
  500: "", // TODO: paste the $500/mo corporate recurring link
};

/**
 * A checkout that accepts `?amount=&frequency=`. Referenced literally (not via
 * a computed key) because Next.js inlines NEXT_PUBLIC_* at build time.
 */
const BILLING_URL = process.env.NEXT_PUBLIC_BILLING_URL || "";
const PROCESSOR_URL = process.env.NEXT_PUBLIC_DONATE_URL || "";

/** True once a real processor is wired up — not the PayPal fallback. */
export function isBillingConfigured(): boolean {
  return Boolean(BILLING_URL || PROCESSOR_URL);
}

function withParams(base: string, amount: number | null, frequency: DonationFrequency): string {
  try {
    const url = new URL(base);
    if (amount) url.searchParams.set("amount", String(amount));
    url.searchParams.set("frequency", frequency);
    return url.toString();
  } catch {
    // Not an absolute URL (a relative path, or misconfigured) — hand it back
    // untouched rather than throwing during a render.
    return base;
  }
}

/**
 * The destination for a gift of `amount` at `frequency`.
 * Never returns an empty string, so a CTA always has somewhere to go.
 */
export function checkoutUrl(
  amount: number | null,
  frequency: DonationFrequency = "one_time",
): string {
  if (frequency === "monthly" && amount && monthlyPlanUrls[amount]) {
    return monthlyPlanUrls[amount];
  }
  if (BILLING_URL) return withParams(BILLING_URL, amount, frequency);
  if (PROCESSOR_URL) return withParams(PROCESSOR_URL, amount, frequency);
  // PayPal's fundraiser page handles both one-time and recurring gifts.
  return links.paypal;
}

/** The button label for an amount + frequency, e.g. "Give $50 a month". */
export function giveLabel(amount: number | null, frequency: DonationFrequency): string {
  if (!amount) return frequency === "monthly" ? "Choose a monthly amount" : "Choose an amount";
  return frequency === "monthly" ? `Give $${amount} a month` : `Give $${amount}`;
}
