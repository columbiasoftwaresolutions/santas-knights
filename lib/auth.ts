import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Privilege tiers (mirrors the `app_role` enum). guardian/donor are NOT roles —
 *  they're data relationships on a `public` account. See docs/ACCOUNT-MODEL.md. */
export type AppRole = "public" | "participant" | "instructor" | "admin";

export type CurrentUser = {
  id: string;
  email: string | null;
  role: AppRole;
  name: string | null;
};

/**
 * Resolve the signed-in user (or null). Role-aware gate for the whole site —
 * not admin-specific. Returns null when signed out or Supabase isn't configured.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as AppRole) ?? "public",
    name: (profile?.name as string | null) ?? null,
  };
}

export type AdminCheck =
  | { status: "unconfigured" }
  | { status: "signed-out" }
  | { status: "not-admin"; email: string | null }
  | { status: "admin"; userId: string; email: string | null };

/** Resolve the current request's user and whether they hold the admin role. */
export async function checkAdmin(): Promise<AdminCheck> {
  if (!isSupabaseConfigured()) return { status: "unconfigured" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { status: "not-admin", email: user.email ?? null };
  return { status: "admin", userId: user.id, email: user.email ?? null };
}
