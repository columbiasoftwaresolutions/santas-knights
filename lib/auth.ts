import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
