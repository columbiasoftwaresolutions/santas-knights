"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabasePublishableKey } from "@/lib/supabase/config";

/** Browser Supabase client (publishable key only). Used by the admin login form. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
