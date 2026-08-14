"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only allow internal redirects; never an open redirect to another site. */
function safeNext(next: unknown): string {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/members";
}

/**
 * Validate a `YYYY-MM-01` date of birth and enforce the 18-or-older gate.
 * Eligibility is the 1st of the birth month + 18 years (e.g. born July 2002 →
 * eligible from 2020-07-01). Returns an error string, or null when valid.
 */
function validateAdultDob(dob: string): string | null {
  const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(dob);
  if (!m) return "Please select your birth month and year.";
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return "Please select a valid birth month.";
  const eligible = new Date(year + 18, month - 1, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (eligible > today) return "You must be 18 or older to create an account.";
  return null;
}

/**
 * Create a `public` account. Uses the admin client to create an already-confirmed
 * user (this seasonal flow shouldn't depend on email round-trips), then signs the
 * new user in so the session cookie is set before redirecting. The `handle_new_user`
 * trigger creates the matching `profiles` row (role `public`), populated from the
 * `user_metadata` passed to `createUser` below.
 */
export async function registerAccount(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  const dob = String(formData.get("dob") ?? "").trim(); // YYYY-MM-01
  const zipcode = String(formData.get("zipcode") ?? "").trim();
  const next = safeNext(formData.get("next"));

  if (!firstName) return { error: "Please enter your first name." };
  if (!lastName) return { error: "Please enter your last name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (!phone) return { error: "Please enter your phone number." };
  if (!password) return { error: "Please choose a password." };
  if (password !== confirm) return { error: "Those passwords don't match." };
  const dobError = validateAdultDob(dob);
  if (dobError) return { error: dobError };
  if (!zipcode) return { error: "Please enter your home zip code." };
  if (!isSupabaseConfigured()) return { error: "Accounts aren't available yet." };

  const admin = createSupabaseAdminClient();
  if (!admin) return { error: "Accounts aren't available yet." };

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    // handle_new_user() reads these off raw_user_meta_data to populate the
    // NOT NULL identity columns on the profiles row it creates.
    user_metadata: { first_name: firstName, last_name: lastName, dob, phone, zipcode },
  });
  if (createError) {
    if (/already|registered|exists/i.test(createError.message))
      return { error: "That email already has an account. Try signing in instead." };
    if (/password/i.test(createError.message))
      return { error: createError.message };
    console.error("Account creation failed:", createError.message);
    return { error: "We couldn't create the account. Please try again." };
  }

  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) redirect(`/login?next=${encodeURIComponent(next)}`);

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

  // One login for everyone. Honor an explicit destination; otherwise admins land
  // in the admin area and regular members on their account.
  if (next !== "/members") redirect(next);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "admin") redirect("/admin");
  }
  redirect("/members");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/members");
  redirect("/members");
}
