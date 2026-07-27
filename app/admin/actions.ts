"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ACTION_TO_STATUS = {
  delete: "deleted",
  restore: "live",
  fulfill: "fulfilled",
} as const;

export type LetterAction = keyof typeof ACTION_TO_STATUS | "release";

export async function updateLetterStatus(formData: FormData): Promise<void> {
  const admin = await checkAdmin();
  if (admin.status !== "admin") return;

  const letterId = String(formData.get("letter_id") ?? "");
  const action = String(formData.get("action") ?? "") as LetterAction;
  if (!letterId) return;
  if (action !== "release" && !(action in ACTION_TO_STATUS)) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const update: Record<string, unknown> =
    action === "release"
      ? { status: "live", fulfilled_by_user_id: null, fulfilled_by_email: null, claimed_at: null }
      : { status: ACTION_TO_STATUS[action] };

  if (action === "fulfill") update.fulfilled_at = new Date().toISOString();
  if (action === "restore") update.fulfilled_at = null;
  if (action === "delete") {
    update.fulfilled_by_user_id = null;
    update.fulfilled_by_email = null;
    update.claimed_at = null;
  }

  const { error } = await supabase.from("santa_letters").update(update).eq("id", letterId);
  if (error) console.error("Letter status update failed:", error.message);

  revalidatePath("/admin");
  revalidatePath("/letters");
  revalidatePath("/account");
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(`/login?next=${encodeURIComponent("/admin")}`);
}
