"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type ClaimResult =
  | { ok: true }
  | { ok: false; reason: "auth" | "self" | "taken" | "error" };

/**
 * Claim a letter to gift it. Atomic: the update only succeeds while the letter
 * is live and unclaimed, so two donors can't both claim the same wish. Blocks
 * a guardian from claiming their own child's letter (self-dealing guard).
 */
export async function claimLetter(letterId: string): Promise<ClaimResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, reason: "auth" };
  if (!letterId) return { ok: false, reason: "error" };

  const supabase = createSupabaseAdminClient();
  if (!supabase) return { ok: false, reason: "error" };

  const { data: letter } = await supabase
    .from("santa_letters")
    .select("id, status, guardian_user_id, guardian_email, claimed_at")
    .eq("id", letterId)
    .maybeSingle();
  if (!letter || letter.status !== "live" || letter.claimed_at) return { ok: false, reason: "taken" };

  // Self-dealing guard: can't gift your own child's letter.
  const email = (user.email ?? "").toLowerCase();
  if (letter.guardian_user_id === user.id || (email && letter.guardian_email?.toLowerCase() === email)) {
    return { ok: false, reason: "self" };
  }

  // Atomic claim — only claims a live, unclaimed row.
  const { data: updated, error } = await supabase
    .from("santa_letters")
    .update({
      fulfilled_by_user_id: user.id,
      fulfilled_by_email: user.email,
      claimed_at: new Date().toISOString(),
    })
    .eq("id", letterId)
    .eq("status", "live")
    .is("claimed_at", null)
    .select("id");
  if (error) return { ok: false, reason: "error" };
  if (!updated || updated.length === 0) return { ok: false, reason: "taken" };

  revalidatePath("/letters-to-santa");
  revalidatePath("/members");
  revalidatePath("/admin");
  return { ok: true };
}

/** Donor confirms they sent the gift → 'fulfilled'. */
export async function markGifted(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase
    .from("santa_letters")
    .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
    .eq("id", String(formData.get("letter_id")))
    .eq("fulfilled_by_user_id", user.id)
    .eq("status", "live");
  revalidatePath("/members");
  revalidatePath("/admin");
}

/** Donor changed their mind → release the claim back into the pool. */
export async function releaseClaim(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase
    .from("santa_letters")
    .update({ status: "live", fulfilled_by_user_id: null, fulfilled_by_email: null, claimed_at: null })
    .eq("id", String(formData.get("letter_id")))
    .eq("fulfilled_by_user_id", user.id)
    .eq("status", "live");
  revalidatePath("/members");
  revalidatePath("/letters-to-santa");
  revalidatePath("/admin");
}
