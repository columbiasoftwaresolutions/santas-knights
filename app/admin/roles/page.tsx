import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell, adminField, adminLabel } from "@/components/admin/AdminShell";
import { updateUserRole } from "@/app/admin/content-actions";

export const metadata: Metadata = {
  title: "Roles · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Profile = { id: string; email: string | null; role: string; created_at: string };

const ROLES = ["public", "participant", "instructor", "admin"] as const;
const ROLE_TONE: Record<string, string> = {
  admin: "bg-red/15 text-[#e7705e]",
  instructor: "bg-amber/15 text-amber",
  participant: "bg-green/15 text-green",
  public: "bg-bone/10 text-bone/60",
};

export default async function AdminRolesPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const { data } = await gate.supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true })
    .limit(1000);
  const profiles = (data ?? []) as Profile[];

  return (
    <AdminShell active="roles" title="Roles" email={gate.email}>
      <Card className="border-bone/15 bg-ink2 p-[26px]">
        <h2 className="text-[17px] font-extrabold text-bone">Set a role by email</h2>
        <p className="mt-1 text-[13px] text-bone/50">
          Coaches and admins are provisioned here — never self-selected at signup. The account must
          already exist.
        </p>
        <form action={updateUserRole} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="grow">
            <label className={adminLabel}>Account email</label>
            <input name="email" type="email" required placeholder="person@email.com" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Role</label>
            <select name="role" className={adminField} defaultValue="instructor">
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="cursor-pointer rounded-pill bg-green px-5 py-2.5 text-[14px] font-bold text-white">
            Update role
          </button>
        </form>
      </Card>

      <Card className="mt-7 overflow-x-auto border-bone/15 bg-ink2 p-0">
        <table className="w-full text-left text-[13.5px]">
          <thead className="border-b border-bone/15 text-[11px] uppercase tracking-[0.1em] text-bone/45">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="text-bone/80">
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-bone/10">
                <td className="px-4 py-2.5 font-semibold text-bone">{p.email ?? "—"}</td>
                <td className="px-4 py-2.5">
                  <span className={`rounded-pill px-2.5 py-1 text-[12px] font-bold ${ROLE_TONE[p.role] ?? ""}`}>
                    {p.role}
                  </span>
                </td>
                <td className="px-4 py-2.5">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}
