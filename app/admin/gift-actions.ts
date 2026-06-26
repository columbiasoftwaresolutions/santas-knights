"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function asAdmin() {
  const admin = await checkAdmin();
  if (admin.status !== "admin") return null;
  return createSupabaseAdminClient();
}

/** Admin confirms a claimed letter was gifted. */
export async function adminMarkGifted(formData: FormData): Promise<void> {
  const db = await asAdmin();
  if (!db) return;
  await db
    .from("santa_letters")
    .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
    .eq("id", String(formData.get("letter_id")))
    .eq("status", "claimed");
  revalidatePath("/admin/gifts");
}

/** Admin releases a claim back into the pool (e.g. the donor went quiet). */
export async function adminReleaseClaim(formData: FormData): Promise<void> {
  const db = await asAdmin();
  if (!db) return;
  await db
    .from("santa_letters")
    .update({ status: "approved", fulfilled_by_user_id: null, fulfilled_by_email: null, claimed_at: null })
    .eq("id", String(formData.get("letter_id")))
    .eq("status", "claimed");
  revalidatePath("/admin/gifts");
  revalidatePath("/letters/give");
}
