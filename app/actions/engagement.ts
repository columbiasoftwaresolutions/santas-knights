"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { org } from "@/content/site";

export type EngagementState = {
  ok: boolean;
  message?: string;
};

/**
 * Contact form: every message is stored in Supabase; if Resend is configured
 * (RESEND_API_KEY + CONTACT_EMAIL_TO) it's also forwarded by email. Falls back
 * to a mailto suggestion when the backend isn't configured yet.
 */
export async function sendContactMessage(
  _prev: EngagementState,
  formData: FormData,
): Promise<EngagementState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in your name, email, and a message." };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      ok: false,
      message: `The contact form is not available yet. Please email us directly at ${org.email}.`,
    };
  }

  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, reason, message });
  if (error) {
    console.error("Contact message insert failed:", error.message);
    return {
      ok: false,
      message: `Something went wrong sending that. Please try again, or email ${org.email}.`,
    };
  }

  // Optional email routing. A failure here never loses the stored message.
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  if (resendKey && to) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Santa's Knights site <onboarding@resend.dev>",
          to: [to],
          reply_to: email,
          subject: `[santasknights.org] ${reason || "Contact"}: ${name}`,
          text: `From: ${name} <${email}>\nReason: ${reason || "n/a"}\n\n${message}`,
        }),
      });
    } catch (error) {
      console.error("Contact email forward failed:", error);
    }
  }

  return { ok: true };
}

/** Newsletter signup, stored in Supabase until a newsletter provider is chosen. */
export async function subscribeNewsletter(
  _prev: EngagementState,
  formData: FormData,
): Promise<EngagementState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      ok: false,
      message: `Email ${org.email} and we will add you to the list.`,
    };
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (error && error.code !== "23505") {
    // 23505 means already subscribed, which is treated as success.
    console.error("Newsletter insert failed:", error.message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
