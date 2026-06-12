"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LETTERS_BUCKET } from "@/lib/supabase/config";
import { GUARDIAN_CONSENT_TEXT, GUARDIAN_CONSENT_VERSION } from "@/content/consent";

export type SubmitLetterState = {
  ok: boolean;
  /** Field-level errors keyed by input name, plus an optional form-level message. */
  errors?: Record<string, string>;
  message?: string;
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

/** Amazon product/wishlist hosts we accept (fulfillment is Amazon-only by design). */
function isAmazonUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname.toLowerCase();
    return (
      host === "a.co" ||
      host === "amzn.to" ||
      host === "amzn.com" ||
      host === "amazon.com" ||
      host.endsWith(".amazon.com")
    );
  } catch {
    return false;
  }
}

export async function submitLetter(
  _prev: SubmitLetterState,
  formData: FormData,
): Promise<SubmitLetterState> {
  const childFirstName = String(formData.get("child_first_name") ?? "").trim();
  const childAgeRaw = String(formData.get("child_age") ?? "").trim();
  const wishNote = String(formData.get("wish_note") ?? "").trim();
  const amazonUrl = String(formData.get("amazon_url") ?? "").trim();
  const guardianName = String(formData.get("guardian_name") ?? "").trim();
  const guardianEmail = String(formData.get("guardian_email") ?? "").trim();
  const consent = formData.get("consent") === "on";
  const letterImage = formData.get("letter_image");

  const errors: Record<string, string> = {};
  const childAge = Number(childAgeRaw);

  if (!childFirstName) errors.child_first_name = "Please add the child's first name.";
  if (childFirstName.split(/\s+/).length > 1)
    errors.child_first_name = "First name only, please — we keep last names private.";
  if (!childAgeRaw || !Number.isInteger(childAge) || childAge < 0 || childAge > 17)
    errors.child_age = "Age must be a whole number between 0 and 17.";
  if (!wishNote) errors.wish_note = "Tell us in a line or two what they're wishing for.";
  if (!amazonUrl || !isAmazonUrl(amazonUrl))
    errors.amazon_url = "Please paste a valid Amazon product or wishlist link (amazon.com, amzn.to, or a.co).";
  if (!guardianName) errors.guardian_name = "We need a parent or guardian's name.";
  if (!guardianEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardianEmail))
    errors.guardian_email = "Please enter a valid email so we can reach you about this letter.";
  if (!consent) errors.consent = "The consent box is required to submit a letter.";

  if (!(letterImage instanceof File) || letterImage.size === 0) {
    errors.letter_image = "Please upload a photo or scan of the handwritten letter.";
  } else {
    if (letterImage.size > MAX_IMAGE_BYTES)
      errors.letter_image = "That image is over 10MB — a phone photo of the letter is perfect.";
    if (!IMAGE_TYPES.includes(letterImage.type))
      errors.letter_image = "Please upload an image file (JPG, PNG, WebP, or HEIC).";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, message: "A few things need a second look below." };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      ok: false,
      message: `Letter submissions aren't open yet — we're putting the system together. Please email us instead and we'll take it from there.`,
    };
  }

  const image = letterImage as File;
  const ext = (image.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const imagePath = `submissions/${randomUUID()}.${ext || "jpg"}`;

  const { error: uploadError } = await supabase.storage
    .from(LETTERS_BUCKET)
    .upload(imagePath, image, { contentType: image.type, upsert: false });
  if (uploadError) {
    console.error("Letter image upload failed:", uploadError.message);
    return { ok: false, message: "We couldn't save the letter image. Please try again in a minute." };
  }

  const { data: letter, error: insertError } = await supabase
    .from("santa_letters")
    .insert({
      child_first_name: childFirstName,
      child_age: childAge,
      wish_note: wishNote,
      amazon_url: amazonUrl,
      letter_image_path: imagePath,
      guardian_name: guardianName,
      guardian_email: guardianEmail,
      status: "pending",
    })
    .select("id")
    .single();
  if (insertError || !letter) {
    console.error("Letter insert failed:", insertError?.message);
    await supabase.storage.from(LETTERS_BUCKET).remove([imagePath]);
    return { ok: false, message: "Something went wrong saving the letter. Please try again." };
  }

  const headerList = await headers();
  const { error: consentError } = await supabase.from("consent_records").insert({
    letter_id: letter.id,
    type: "guardian",
    version: GUARDIAN_CONSENT_VERSION,
    full_text: GUARDIAN_CONSENT_TEXT,
    accepted_name: guardianName,
    metadata: {
      user_agent: headerList.get("user-agent"),
      submitted_via: "letters/submit",
    },
  });
  if (consentError) {
    // The letter stays in the pending queue either way; log so it can be reconciled.
    console.error("Consent record insert failed:", consentError.message);
  }

  return { ok: true };
}
