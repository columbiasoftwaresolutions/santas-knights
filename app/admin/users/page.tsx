import type { Metadata } from "next";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { UsersTable, type UserRow } from "@/components/admin/UsersTable";

export const metadata: Metadata = {
  title: "Users · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Profile = {
  id: string;
  email: string | null;
  role: string;
  created_at: string;
  waiver_signed_at: string | null;
};

export default async function AdminUsersPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  // Pull profiles plus the activity needed to summarize each person. Profiles
  // hold no name, so we derive a display name from their letters/waivers.
  const [profilesRes, lettersRes, checkinsRes, xpRes, waiversRes] = await Promise.all([
    gate.supabase
      .from("profiles")
      .select("id, email, role, created_at, waiver_signed_at")
      .order("created_at", { ascending: true })
      .limit(2000),
    gate.supabase
      .from("santa_letters")
      .select("guardian_user_id, fulfilled_by_user_id, guardian_name, fulfilled_by_name, status")
      .limit(10000),
    gate.supabase.from("checkins").select("user_id").limit(20000),
    gate.supabase.from("xp_events").select("user_id, xp_value").limit(20000),
    gate.supabase.from("waivers").select("user_id, typed_name, participant_name").limit(10000),
  ]);

  const profiles = (profilesRes.data ?? []) as Profile[];

  const giftsSubmitted = new Map<string, number>();
  const giftsFulfilled = new Map<string, number>();
  const names = new Map<string, string>();
  for (const l of lettersRes.data ?? []) {
    if (l.guardian_user_id) {
      giftsSubmitted.set(l.guardian_user_id, (giftsSubmitted.get(l.guardian_user_id) ?? 0) + 1);
      if (l.guardian_name && !names.has(l.guardian_user_id)) names.set(l.guardian_user_id, l.guardian_name);
    }
    if (l.fulfilled_by_user_id) {
      if (l.status === "fulfilled")
        giftsFulfilled.set(l.fulfilled_by_user_id, (giftsFulfilled.get(l.fulfilled_by_user_id) ?? 0) + 1);
      if (l.fulfilled_by_name && !names.has(l.fulfilled_by_user_id))
        names.set(l.fulfilled_by_user_id, l.fulfilled_by_name);
    }
  }

  const classesAttended = new Map<string, number>();
  for (const c of checkinsRes.data ?? [])
    if (c.user_id) classesAttended.set(c.user_id, (classesAttended.get(c.user_id) ?? 0) + 1);

  const xpTotal = new Map<string, number>();
  for (const e of xpRes.data ?? [])
    if (e.user_id) xpTotal.set(e.user_id, (xpTotal.get(e.user_id) ?? 0) + (e.xp_value ?? 0));

  for (const w of waiversRes.data ?? []) {
    const name = w.typed_name || w.participant_name;
    if (w.user_id && name && !names.has(w.user_id)) names.set(w.user_id, name);
  }

  const users: UserRow[] = profiles.map((p) => ({
    id: p.id,
    name: names.get(p.id) ?? null,
    email: p.email,
    role: p.role,
    createdAt: p.created_at,
    giftsSubmitted: giftsSubmitted.get(p.id) ?? 0,
    giftsFulfilled: giftsFulfilled.get(p.id) ?? 0,
    classesAttended: classesAttended.get(p.id) ?? 0,
    xp: xpTotal.get(p.id) ?? 0,
    waiverSignedAt: p.waiver_signed_at,
  }));

  return (
    <AdminShell active="users" title="Users" email={gate.email}>
      <p className="max-w-[70ch] text-[14px] text-bone/55">
        Everyone with an account. Expand a row to see their activity and set their role — coaches
        and admins are provisioned here, never self-selected at signup.
      </p>
      <div className="mt-6">
        <UsersTable users={users} />
      </div>
    </AdminShell>
  );
}
