import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, GALLERY_BUCKET, publicStorageUrl } from "@/lib/supabase/config";

/* ------------------------------------------------------------------ *
 * Public content reads (gallery, partners). These go through the
 * session/anon client so the public-read RLS policies apply; every
 * reader degrades to an empty list when Supabase isn't configured or
 * the table is empty, so callers can fall back to static content.
 * ------------------------------------------------------------------ */

export type GalleryItem = {
  id: string;
  title: string | null;
  caption: string | null;
  alt_text: string | null;
  media_type: "image" | "video";
  storage_path: string | null;
  external_url: string | null;
  category: string | null;
  sort_order: number;
  /** Resolved URL (public bucket object or external). */
  url: string | null;
};

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery_media")
    .select("id, title, caption, alt_text, media_type, storage_path, external_url, category, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to load gallery:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    ...row,
    media_type: (row.media_type === "video" ? "video" : "image") as "image" | "video",
    url: row.storage_path
      ? publicStorageUrl(GALLERY_BUCKET, row.storage_path)
      : (row.external_url ?? null),
  }));
}

export type Partner = {
  id: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
};

export async function getPartners(): Promise<Partner[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, website_url, logo_path, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) {
    console.error("Failed to load partners:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    website_url: row.website_url,
    logo_url: row.logo_path ? publicStorageUrl(GALLERY_BUCKET, row.logo_path) : null,
  }));
}
