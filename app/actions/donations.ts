"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { checkoutUrl, isBillingConfigured, type DonationFrequency } from "@/content/billing";
import { org } from "@/content/site";

export type DonationState = {
  ok: boolean;
  message?: string;
  /** External processor to continue to, when one is configured. */
  redirect?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Records donor intent (name, email, amount, designation) so the org has a lead
 * and can send a tax acknowledgment, then hands off to the external processor.
 * Payment itself stays external (Plan v2: no on-site card capture).
 */
export async function recordDonationIntent(
  _prev: DonationState,
  formData: FormData,
): Promise<DonationState> {
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const amountRaw = String(formData.get("amount") ?? "").replace(/[^0-9.]/g, "");
  const frequency: DonationFrequency =
    String(formData.get("frequency") ?? "one_time") === "monthly" ? "monthly" : "one_time";
  const designation = String(formData.get("designation") ?? "").trim() || null;
  const dedicateTo = String(formData.get("dedicate_to") ?? "").trim() || null;

  if (!firstName || !lastName) return { ok: false, message: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { ok: false, message: "Please enter a valid email." };
  const amount = amountRaw ? Number(amountRaw) : null;
  if (amount !== null && (!Number.isFinite(amount) || amount <= 0)) {
    return { ok: false, message: "Enter a donation amount greater than zero." };
  }

  // Resolve where this specific gift should continue to: a recurring plan link
  // for monthly gifts when one is configured, otherwise the general checkout,
  // otherwise PayPal. Never empty — see content/billing.ts.
  const processorUrl = checkoutUrl(amount, frequency);

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    // No backend yet: still let them continue to the processor.
    return { ok: true, redirect: processorUrl };
  }

  const { error } = await supabase.from("donations").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    amount,
    frequency,
    designation,
    dedicate_to: dedicateTo,
    processor: isBillingConfigured() ? "external" : "paypal",
  });
  if (error) {
    console.error("Donation intent insert failed:", error.message);
    return { ok: false, message: `Something went wrong. Please email ${org.email}.` };
  }

  return { ok: true, redirect: processorUrl };
}
