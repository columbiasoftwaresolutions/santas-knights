"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

/** Only allow internal redirects; never an open redirect to another site. */
function safeNext(next: unknown): string {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/account";
}

/**
 * Create a `public` account. Uses the admin client to create an already-confirmed
 * user (this seasonal flow shouldn't depend on email round-trips), then signs the
 * new user in so the session cookie is set before redirecting. The `handle_new_user`
 * trigger creates the matching `profiles` row (role `public`).
 */
export async function registerAccount(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < MIN_PASSWORD)
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  if (!isSupabaseConfigured()) return { error: "Accounts aren't available yet." };

  const admin = createSupabaseAdminClient();
  if (!admin) return { error: "Accounts aren't available yet." };

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError) {
    if (/already|registered|exists/i.test(createError.message))
      return { error: "That email already has an account. Try signing in instead." };
    console.error("Account creation failed:", createError.message);
    return { error: "We couldn't create the account. Please try again." };
  }

  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) redirect(`/account/login?next=${encodeURIComponent(next)}`);

  redirect(next);
}

/** Sign in with email + password (works for any role). */
export async function signInWithPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) return { error: "Enter your email and password." };
  if (!isSupabaseConfigured()) return { error: "Accounts aren't available yet." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "That email and password didn't work." };

  redirect(next);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/account");
  redirect("/account");
}
