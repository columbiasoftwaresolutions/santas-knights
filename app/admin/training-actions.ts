"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin, getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { TRAINING_VIDEOS_BUCKET } from "@/lib/supabase/config";
import { awardXp, grantBadge } from "@/lib/xp";

type Db = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

async function asAdmin(): Promise<Db | null> {
  const admin = await checkAdmin();
  if (admin.status !== "admin") return null;
  return createSupabaseAdminClient();
}

async function asStaff(): Promise<{ db: Db; userId: string } | null> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "instructor" && user.role !== "admin")) return null;
  const db = createSupabaseAdminClient();
  return db ? { db, userId: user.id } : null;
}

/* ----------------------------------------------------------------- classes */

export async function createClass(formData: FormData): Promise<void> {
  const db = await asAdmin();
  if (!db) return;
  const title = String(formData.get("title") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "").trim();
  if (!title || !startsAt) return;

  await db.from("classes").insert({
    title,
    slug: String(formData.get("slug") ?? "").trim() || null,
    class_type: String(formData.get("class_type") ?? "standard"),
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: String(formData.get("ends_at") ?? "").trim()
      ? new Date(String(formData.get("ends_at"))).toISOString()
      : null,
    capacity: Number(formData.get("capacity") ?? 20) || 20,
    requires_approval: formData.get("requires_approval") === "on",
    is_published: true,
  });
  revalidatePath("/admin/classes");
  revalidatePath("/training");
}

export async function setClassPublished(formData: FormData): Promise<void> {
  const db = await asAdmin();
  if (!db) return;
  await db
    .from("classes")
    .update({ is_published: String(formData.get("is_published")) === "true" })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/classes");
  revalidatePath("/training");
}

export async function deleteClass(formData: FormData): Promise<void> {
  const db = await asAdmin();
  if (!db) return;
  await db.from("classes").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/classes");
  revalidatePath("/training");
}

/* ---------------------------------------------------------------- check-in */

/** Map a class type to its configured attendance XP event. */
function attendanceEvent(classType: string): string {
  const t = classType.toLowerCase();
  if (/(armor|workshop|special|spar)/.test(t)) return "attend_workshop";
  if (/(veteran|women|community)/.test(t)) return "attend_community";
  return "attend_standard";
}

export async function checkInParticipant(formData: FormData): Promise<void> {
  const staff = await asStaff();
  if (!staff) return;
  const { db, userId: staffId } = staff;

  const classId = String(formData.get("class_id") ?? "");
  const userId = String(formData.get("user_id") ?? "");
  const registrationId = String(formData.get("registration_id") ?? "") || null;
  const classType = String(formData.get("class_type") ?? "standard");
  if (!classId || !userId) return;

  // Idempotent: unique index on (class_id, user_id, coalesce(family_member_id)).
  const { error: insErr } = await db.from("checkins").insert({
    class_id: classId,
    user_id: userId,
    registration_id: registrationId,
    checked_in_by: staffId,
  });
  if (insErr) {
    // Already checked in — nothing more to do.
    revalidatePath("/admin/check-in");
    return;
  }

  // Award attendance XP and stamp the registration + the checkin row.
  const xp = await awardXp(db, {
    userId,
    eventType: attendanceEvent(classType),
    sourceType: "checkin",
    sourceId: classId,
    createdBy: staffId,
  });
  await db.from("checkins").update({ xp_awarded: xp }).eq("class_id", classId).eq("user_id", userId);
  if (registrationId) await db.from("registrations").update({ status: "attended" }).eq("id", registrationId);

  // Badges: first class, then the ten-class milestone.
  const { count } = await db
    .from("checkins")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("family_member_id", null);
  await grantBadge(db, userId, "first_class", null, staffId);
  if ((count ?? 0) >= 10) await grantBadge(db, userId, "ten_classes", null, staffId);

  revalidatePath("/admin/check-in");
  revalidatePath("/account");
}

/* ------------------------------------------------------------- xp config */

export async function updateXpValue(formData: FormData): Promise<void> {
  const db = await asAdmin();
  if (!db) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db
    .from("xp_config")
    .update({
      xp_value: Number(formData.get("xp_value") ?? 0) || 0,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);
  revalidatePath("/admin/xp");
}

export async function updateLevelThreshold(formData: FormData): Promise<void> {
  const db = await asAdmin();
  if (!db) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await db
    .from("levels")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      threshold: Number(formData.get("threshold") ?? 0) || 0,
    })
    .eq("id", id);
  revalidatePath("/admin/xp");
}

/* -------------------------------------------------------------- videos */

export async function createVideo(formData: FormData): Promise<void> {
  const staff = await asStaff();
  if (!staff) return;
  const { db, userId } = staff;

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const externalUrl = String(formData.get("external_url") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  let storagePath: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > 500 * 1024 * 1024) return; // 500MB cap
  if (file instanceof File && file.size > 0) {
    const ext = file.name.split(".").pop() || "mp4";
    storagePath = `videos/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.${ext}`;
    const { error } = await db.storage
      .from(TRAINING_VIDEOS_BUCKET)
      .upload(storagePath, file, { contentType: file.type || undefined, upsert: true });
    if (error) {
      console.error("Video upload failed:", error.message);
      storagePath = null;
    }
  }
  if (!storagePath && !externalUrl) return;

  await db.from("training_videos").insert({
    title,
    description,
    category,
    uploader_id: userId,
    storage_path: storagePath,
    external_url: externalUrl,
    sort_order: sortOrder,
    is_published: true,
  });
  revalidatePath("/admin/videos");
  revalidatePath("/online");
}

export async function setVideoPublished(formData: FormData): Promise<void> {
  const staff = await asStaff();
  if (!staff) return;
  await staff.db
    .from("training_videos")
    .update({ is_published: String(formData.get("is_published")) === "true" })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/videos");
  revalidatePath("/online");
}

export async function deleteVideo(formData: FormData): Promise<void> {
  const staff = await asStaff();
  if (!staff) return;
  const path = String(formData.get("storage_path") ?? "");
  if (path) await staff.db.storage.from(TRAINING_VIDEOS_BUCKET).remove([path]);
  await staff.db.from("training_videos").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/videos");
  revalidatePath("/online");
}
