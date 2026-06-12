"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Moderation verbs → letter status. Mirrors REQUIREMENTS.md §3.3. */
const ACTION_TO_STATUS = {
  approve: "approved",
  reject: "rejected",
  hide: "hidden",
  flag: "flagged",
  request_edits: "needs_edits",
  fulfill: "fulfilled",
  reopen: "pending",
} as const;

export type ModerationAction = keyof typeof ACTION_TO_STATUS;

export async function moderateLetter(formData: FormData): Promise<void> {
  const admin = await checkAdmin();
  if (admin.status !== "admin") return;

  const letterId = String(formData.get("letter_id") ?? "");
  const action = String(formData.get("action") ?? "") as ModerationAction;
  const note = String(formData.get("moderation_note") ?? "").trim();
  const status = ACTION_TO_STATUS[action];
  if (!letterId || !status) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const update: Record<string, unknown> = { status };
  if (note) update.moderation_note = note;
  update.fulfilled_at = status === "fulfilled" ? new Date().toISOString() : null;

  const { error } = await supabase.from("santa_letters").update(update).eq("id", letterId);
  if (error) console.error("Moderation update failed:", error.message);

  revalidatePath("/admin");
  revalidatePath("/letters/give");
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
