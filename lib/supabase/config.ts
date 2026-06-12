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
