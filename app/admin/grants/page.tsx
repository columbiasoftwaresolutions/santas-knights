import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { getGrantRows } from "@/lib/training";

export const metadata: Metadata = {
  title: "Grant export · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminGrantsPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const rows = await getGrantRows();
  const veterans = rows.filter((r) => r.veteran).length;
  const totalAttendance = rows.reduce((s, r) => s + r.attendance, 0);

  return (
    <AdminShell active="grants" title="Grant export" email={gate.email}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[60ch] text-[14px] text-bone/55">
          Participant XP, attendance, and veteran status for grant applications. Download the full
          dataset as CSV.
        </p>
        <Button href="/admin/grants/export" variant="red">Download CSV</Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-[14px] sm:grid-cols-4">
        <Stat label="Participants" value={String(rows.length)} />
        <Stat label="Veterans" value={String(veterans)} />
        <Stat label="Total check-ins" value={String(totalAttendance)} />
        <Stat label="Total XP" value={String(rows.reduce((s, r) => s + r.totalXp, 0))} />
      </div>

      <Card className="mt-7 overflow-x-auto border-bone/15 bg-ink2 p-0">
        {rows.length === 0 ? (
          <p className="p-6 text-bone/60">No participants yet.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead className="border-b border-bone/15 text-[11px] uppercase tracking-[0.1em] text-bone/45">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Veteran</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Waiver</th>
              </tr>
            </thead>
            <tbody className="text-bone/80">
              {rows.map((r, i) => (
                <tr key={r.email ?? i} className="border-b border-bone/10">
                  <td className="px-4 py-2.5 font-semibold text-bone">{r.email ?? "—"}</td>
                  <td className="px-4 py-2.5">{r.role}</td>
                  <td className="px-4 py-2.5">{r.veteran ? "Yes" : "—"}</td>
                  <td className="px-4 py-2.5">{r.totalXp}</td>
                  <td className="px-4 py-2.5">{r.attendance}</td>
                  <td className="px-4 py-2.5">{r.waiverSignedAt ? new Date(r.waiverSignedAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-bone/15 bg-ink2 p-5">
      <p className="font-display text-[30px] font-black tracking-[-0.03em] text-amber">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-bone/55">{label}</p>
    </Card>
  );
}
