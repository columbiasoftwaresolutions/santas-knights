/**
 * Central env access for Supabase. Every entry point checks `isSupabaseConfigured`
 * first so the site builds and runs (with features degraded to friendly
 * empty-states) before the Supabase project exists.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

/** Storage bucket holding uploaded handwritten-letter images (private; served via signed URLs). */
export const LETTERS_BUCKET = "letters";
/** Public bucket for gallery + partner images (served via public URLs). */
export const GALLERY_BUCKET = "gallery";
/** Private bucket for signed liability-waiver records. */
export const WAIVERS_BUCKET = "waivers";
/** Private bucket for Strength & Conditioning training videos. */
export const TRAINING_VIDEOS_BUCKET = "training-videos";

/** Public URL for an object in a public storage bucket. */
export function publicStorageUrl(bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
