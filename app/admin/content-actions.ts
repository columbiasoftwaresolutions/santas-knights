"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { GALLERY_BUCKET } from "@/lib/supabase/config";

/** Re-check admin inside every action (actions are directly invocable). */
async function adminClient() {
  const admin = await checkAdmin();
  if (admin.status !== "admin") return null;
  return createSupabaseAdminClient();
}

/** Upload size caps (server-side; client file.type/size are not trusted). */
const MAX_MEDIA_BYTES = 200 * 1024 * 1024; // gallery image/video
const MAX_LOGO_BYTES = 10 * 1024 * 1024; // partner logo

function slugifyName(name: string, fallback: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${base || fallback}-${Date.now()}`;
}

/* ----------------------------------------------------------------- gallery */

export async function createGalleryItem(formData: FormData): Promise<void> {
  const supabase = await adminClient();
  if (!supabase) return;

  const title = String(formData.get("title") ?? "").trim() || null;
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const altText = String(formData.get("alt_text") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const mediaType = String(formData.get("media_type") ?? "image") === "video" ? "video" : "image";
  const externalUrl = String(formData.get("external_url") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  let storagePath: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > MAX_MEDIA_BYTES) return;
  if (file instanceof File && file.size > 0) {
    const ext = file.name.split(".").pop() || (mediaType === "video" ? "mp4" : "jpg");
    storagePath = `${mediaType}/${slugifyName(title ?? "media", "item")}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(storagePath, file, { contentType: file.type || undefined, upsert: true });
    if (upErr) {
      console.error("Gallery upload failed:", upErr.message);
      return;
    }
  }

  if (!storagePath && !externalUrl) return; // need a source

  await supabase.from("gallery_media").insert({
    title,
    caption,
    alt_text: altText,
    category,
    media_type: mediaType,
    storage_path: storagePath,
    external_url: externalUrl,
    sort_order: sortOrder,
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function toggleGalleryPublished(formData: FormData): Promise<void> {
  const supabase = await adminClient();
  if (!supabase) return;
  const id = String(formData.get("id"));
  const next = String(formData.get("is_published")) === "true";
  await supabase.from("gallery_media").update({ is_published: next }).eq("id", id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryItem(formData: FormData): Promise<void> {
  const supabase = await adminClient();
  if (!supabase) return;
  const id = String(formData.get("id"));
  const path = String(formData.get("storage_path") ?? "");
  if (path) await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  await supabase.from("gallery_media").delete().eq("id", id);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

/* ---------------------------------------------------------------- partners */

export async function createPartner(formData: FormData): Promise<void> {
  const supabase = await adminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const websiteUrl = String(formData.get("website_url") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  let logoPath: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > MAX_LOGO_BYTES) return;
  if (file instanceof File && file.size > 0) {
    const ext = file.name.split(".").pop() || "png";
    logoPath = `partners/${slugifyName(name, "partner")}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(logoPath, file, { contentType: file.type || undefined, upsert: true });
    if (upErr) {
      console.error("Partner logo upload failed:", upErr.message);
      logoPath = null;
    }
  }

  await supabase.from("partners").insert({
    name,
    website_url: websiteUrl,
    logo_path: logoPath,
    sort_order: sortOrder,
  });
  revalidatePath("/admin/partners");
  revalidatePath("/sponsors");
}

export async function togglePartnerPublished(formData: FormData): Promise<void> {
  const supabase = await adminClient();
  if (!supabase) return;
  const id = String(formData.get("id"));
  const next = String(formData.get("is_published")) === "true";
  await supabase.from("partners").update({ is_published: next }).eq("id", id);
  revalidatePath("/admin/partners");
  revalidatePath("/sponsors");
}

export async function deletePartner(formData: FormData): Promise<void> {
  const supabase = await adminClient();
  if (!supabase) return;
  const id = String(formData.get("id"));
  const path = String(formData.get("logo_path") ?? "");
  if (path) await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  await supabase.from("partners").delete().eq("id", id);
  revalidatePath("/admin/partners");
  revalidatePath("/sponsors");
}

/* ------------------------------------------------------------------- roles */

export async function updateUserRole(formData: FormData): Promise<void> {
  const admin = await checkAdmin();
  if (admin.status !== "admin") return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");
  if (!email || !["public", "participant", "instructor", "admin"].includes(role)) return;

  // Guard against lockout: an admin can't demote themselves, and the last
  // remaining admin can't be demoted out of the role.
  if (role !== "admin") {
    if (email === (admin.email ?? "").toLowerCase()) return;
    const { data: target } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .maybeSingle();
    if (target?.role === "admin") {
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin");
      if ((count ?? 0) <= 1) return;
    }
  }

  await supabase.from("profiles").update({ role }).eq("email", email);
  revalidatePath("/admin/roles");
}
