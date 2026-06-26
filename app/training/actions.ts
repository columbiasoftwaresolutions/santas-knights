"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { awardXp, grantBadge } from "@/lib/xp";
import { getWaiverStatus } from "@/lib/training";
import {
  LIABILITY_WAIVER_VERSION,
  LIABILITY_WAIVER_TEXT,
  MEDIA_CONSENT_VERSION,
  MEDIA_CONSENT_TEXT,
} from "@/content/consent";

const ACTIVE_REG = ["registered", "attended"];

/** True when a date-of-birth string places the participant under 18. */
function isMinor(dob: string | null): boolean {
  if (!dob) return false;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age < 18;
}

/** Promote a `public` account to `participant` once it engages with training. */
async function ensureParticipant(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  userId: string,
) {
  await supabase.from("profiles").update({ role: "participant" }).eq("id", userId).eq("role", "public");
}

/**
 * Reserve a spot in a class. Requires a signed (current-version) waiver — if
 * missing, the participant is sent to the waiver page first. Enforces capacity.
 */
export async function registerForClass(formData: FormData): Promise<void> {
  const classId = String(formData.get("class_id") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/account/login?next=${encodeURIComponent("/training")}`);
  if (!classId) redirect("/training?error=missing");

  const waiver = await getWaiverStatus(user.id);
  if (!waiver.currentVersion) {
    redirect(`/training/waiver?next=${encodeURIComponent("/training#book")}`);
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) redirect("/training?error=unconfigured");

  const { data: cls } = await supabase
    .from("classes")
    .select("id, capacity, is_published")
    .eq("id", classId)
    .maybeSingle();
  if (!cls || !cls.is_published) redirect("/training?error=notfound");

  // Already registered? Reactivate a prior cancellation; otherwise check capacity.
  const { data: existing } = await supabase
    .from("registrations")
    .select("id, status")
    .eq("class_id", classId)
    .eq("user_id", user.id)
    .is("family_member_id", null)
    .maybeSingle();

  if (existing && ACTIVE_REG.includes(existing.status)) {
    redirect("/training?booked=already");
  }

  const { count } = await supabase
    .from("registrations")
    .select("id", { count: "exact", head: true })
    .eq("class_id", classId)
    .in("status", ACTIVE_REG);
  if ((count ?? 0) >= cls.capacity) redirect("/training?error=full");

  // The DB enforces capacity atomically (trigger). If it rejects the write, the
  // class filled between our count and insert — surface it as "full".
  const { error: writeError } = existing
    ? await supabase.from("registrations").update({ status: "registered" }).eq("id", existing.id)
    : await supabase
        .from("registrations")
        .insert({ class_id: classId, user_id: user.id, status: "registered" });
  if (writeError) redirect("/training?error=full");
  await ensureParticipant(supabase, user.id);

  revalidatePath("/training");
  revalidatePath("/account");
  redirect("/training?booked=1");
}

/** Cancel a registration (no XP penalty in v1). */
export async function cancelRegistration(formData: FormData): Promise<void> {
  const registrationId = String(formData.get("registration_id") ?? "");
  const user = await getCurrentUser();
  if (!user || !registrationId) redirect("/account");

  const supabase = createSupabaseAdminClient();
  if (!supabase) redirect("/account");

  await supabase
    .from("registrations")
    .update({ status: "cancelled" })
    .eq("id", registrationId)
    .eq("user_id", user.id);

  revalidatePath("/account");
  revalidatePath("/training");
  redirect("/account?cancelled=1");
}

/**
 * Record a signed liability waiver (+ optional media release) for the account
 * holder. Stores the full text in force, stamps the profile, promotes to
 * participant, and awards first-time XP/badges. Then continues to `next`.
 */
export async function signWaiver(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect(`/account/login?next=${encodeURIComponent("/training/waiver")}`);

  const typedName = String(formData.get("typed_name") ?? "").trim();
  const participantName = String(formData.get("participant_name") ?? "").trim() || typedName;
  const dob = String(formData.get("dob") ?? "").trim() || null;
  const guardianName = String(formData.get("guardian_name") ?? "").trim() || null;
  const agree = formData.get("agree") === "on";
  const mediaConsent = formData.get("media_consent") === "on";
  const next = String(formData.get("next") ?? "/training");

  if (!agree || !typedName) {
    redirect(`/training/waiver?error=incomplete&next=${encodeURIComponent(next)}`);
  }
  // The waiver is the legal record — a minor's must carry a parent/guardian name.
  if (isMinor(dob) && !guardianName) {
    redirect(`/training/waiver?error=guardian&next=${encodeURIComponent(next)}`);
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) redirect("/training?error=unconfigured");

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = hdrs.get("user-agent") ?? null;

  // First waiver ever for this account? Drives one-time XP/badges below.
  const priorWaiver = await getWaiverStatus(user.id);

  await supabase.from("waivers").insert({
    user_id: user.id,
    version: LIABILITY_WAIVER_VERSION,
    full_text: LIABILITY_WAIVER_TEXT,
    participant_name: participantName,
    dob,
    guardian_name: guardianName,
    typed_name: typedName,
    consent: true,
    ip,
    user_agent: userAgent,
  });

  await supabase.from("media_consents").insert({
    user_id: user.id,
    version: MEDIA_CONSENT_VERSION,
    full_text: MEDIA_CONSENT_TEXT,
    granted: mediaConsent,
    typed_name: typedName,
    guardian_name: guardianName,
    metadata: { ip, user_agent: userAgent },
  });

  // Stamp the waiver date for everyone, but only promote public → participant —
  // never demote an instructor/admin who happens to sign a waiver.
  await supabase
    .from("profiles")
    .update({ waiver_signed_at: new Date().toISOString() })
    .eq("id", user.id);
  await ensureParticipant(supabase, user.id);

  if (!priorWaiver.signed) {
    // One-time awards on first clearance.
    await awardXp(supabase, { userId: user.id, eventType: "account_created", sourceType: "signup" });
    await awardXp(supabase, { userId: user.id, eventType: "waiver_signed", sourceType: "waiver" });
    await grantBadge(supabase, user.id, "waiver_signed");
  }

  revalidatePath("/account");
  revalidatePath("/training");
  redirect(next);
}
