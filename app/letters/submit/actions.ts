"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LETTERS_BUCKET } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/auth";
import { fetchAmazonImagePreviews } from "@/lib/amazonPreview";
import { GUARDIAN_CONSENT_TEXT, GUARDIAN_CONSENT_VERSION } from "@/content/consent";

export type SubmitLetterState = {
  ok: boolean;
  /** Field-level errors keyed by input name, plus an optional form-level message. */
  errors?: Record<string, string>;
  message?: string;
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_AMAZON_LINKS = 20;

/**
 * True only for an Amazon link. Fulfillment is Amazon-only by design. Accepts
 * Amazon storefronts in any country (amazon.com, amazon.co.uk, amazon.de,
 * amazon.com.br, …), including www./smile. subdomains, plus Amazon's own
 * short-link domains. Anything else (other retailers, generic shorteners) fails.
 */
function isAmazonUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname.toLowerCase();
    return (
      /(^|\.)amazon\.[a-z]{2,}(\.[a-z]{2,})?$/.test(host) ||
      host === "a.co" ||
      host === "amzn.to" ||
      host === "amzn.eu" ||
      host === "amzn.asia" ||
      host === "amzn.com"
    );
  } catch {
    return false;
  }
}

export async function submitLetter(
  _prev: SubmitLetterState,
  formData: FormData,
): Promise<SubmitLetterState> {
  // An account is required to submit a letter (docs/ACCOUNT-MODEL.md §2): we need
  // a way to reach the guardian and let them track status. Adopting also requires an account.
  const guardian = await getCurrentUser();
  if (!guardian) {
    return {
      ok: false,
      message: "Please sign in or create a free account to submit a letter.",
    };
  }

  const childFirstName = String(formData.get("child_first_name") ?? "").trim();
  const childAgeRaw = String(formData.get("child_age") ?? "").trim();
  const wishNote = String(formData.get("wish_note") ?? "").trim();
  const amazonUrls = formData
    .getAll("amazon_url")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const guardianName = String(formData.get("guardian_name") ?? "").trim();
  const guardianEmail = String(formData.get("guardian_email") ?? "").trim();
  const consent = formData.get("consent") === "on";
  const letterImage = formData.get("letter_image");

  const errors: Record<string, string> = {};
  const childAge = Number(childAgeRaw);

  if (!childFirstName) errors.child_first_name = "Please add the child's first name.";
  if (childFirstName.split(/\s+/).length > 1)
    errors.child_first_name = "Enter a first name only. We keep last names private.";
  if (!childAgeRaw || !Number.isInteger(childAge) || childAge < 0 || childAge > 17)
    errors.child_age = "Age must be a whole number between 0 and 17.";
  if (!wishNote) errors.wish_note = "Tell us in a line or two what they're wishing for.";
  if (amazonUrls.length === 0)
    errors.amazon_url = "Please add at least one Amazon link.";
  else if (amazonUrls.length > MAX_AMAZON_LINKS)
    errors.amazon_url = `Please add no more than ${MAX_AMAZON_LINKS} links.`;
  else if (!amazonUrls.every(isAmazonUrl))
    errors.amazon_url = "Each one has to be an Amazon link (amazon.com or any country's Amazon, amzn.to, or a.co).";
  if (!guardianName) errors.guardian_name = "We need a parent or guardian's name.";
  if (!guardianEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardianEmail))
    errors.guardian_email = "Please enter a valid email so we can reach you about this letter.";
  if (!consent) errors.consent = "The consent box is required to submit a letter.";

  if (!(letterImage instanceof File) || letterImage.size === 0) {
    errors.letter_image = "Please upload a photo or scan of the handwritten letter.";
  } else {
    if (letterImage.size > MAX_IMAGE_BYTES)
      errors.letter_image = "That image is over 10MB. Please upload a smaller phone photo.";
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
      message: `Letter submissions are not open yet. Please email us for help.`,
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

  const amazonImageUrls = await fetchAmazonImagePreviews(amazonUrls);

  const letterBase = {
    child_first_name: childFirstName,
    child_age: childAge,
    wish_note: wishNote,
    letter_image_path: imagePath,
    guardian_name: guardianName,
    guardian_email: guardianEmail,
    guardian_user_id: guardian.id,
    status: "live",
  };

  const { data: letter, error: insertError } = await supabase
    .from("santa_letters")
    .insert({
      ...letterBase,
      amazon_urls: amazonUrls,
      amazon_image_urls: amazonImageUrls,
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
      submitted_via: "letters?do=submit",
    },
  });
  if (consentError) {
    // The letter stays live either way; log so it can be reconciled.
    console.error("Consent record insert failed:", consentError.message);
  }

  return { ok: true };
}
