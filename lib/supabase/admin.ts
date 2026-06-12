import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/supabase/config";

/**
 * Secret-key client. Bypasses RLS — server-side only (enforced by the
 * `server-only` import), used by trusted server actions after their own
 * authorization checks. Returns null when the env isn't configured yet so
 * callers can degrade gracefully.
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) return null;

  return createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
