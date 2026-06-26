import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Donations · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  amount: number | null;
  frequency: string;
  designation: string | null;
  dedicate_to: string | null;
  created_at: string;
};

const DESIGNATION_LABEL: Record<string, string> = {
  santas_letters: "Santa's Letters",
  free_classes: "Free classes",
  events: "Events",
};

export default async function AdminDonationsPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const { data } = await gate.supabase
    .from("donations")
    .select("id, first_name, last_name, email, amount, frequency, designation, dedicate_to, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  const rows = (data ?? []) as Row[];

  const total = rows.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const monthly = rows.filter((r) => r.frequency === "monthly").length;

  return (
    <AdminShell active="donations" title="Donations" email={gate.email}>
      <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-3">
        <Stat label="Leads" value={String(rows.length)} />
        <Stat label="Pledged total" value={`$${total.toLocaleString()}`} />
        <Stat label="Monthly pledges" value={String(monthly)} />
      </div>

      <Card className="mt-7 overflow-x-auto border-bone/15 bg-ink2 p-0">
        {rows.length === 0 ? (
          <p className="p-6 text-bone/60">No donation leads yet.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead className="border-b border-bone/15 text-[11px] uppercase tracking-[0.1em] text-bone/45">
              <tr>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Freq</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Dedication</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="text-bone/80">
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-bone/10">
                  <td className="px-4 py-2.5 font-semibold text-bone">{r.first_name} {r.last_name}</td>
                  <td className="px-4 py-2.5">{r.email}</td>
                  <td className="px-4 py-2.5">{r.amount != null ? `$${r.amount}` : "—"}</td>
                  <td className="px-4 py-2.5">{r.frequency === "monthly" ? "Monthly" : "Once"}</td>
                  <td className="px-4 py-2.5">{r.designation ? (DESIGNATION_LABEL[r.designation] ?? r.designation) : "—"}</td>
                  <td className="px-4 py-2.5">{r.dedicate_to ?? "—"}</td>
                  <td className="px-4 py-2.5">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <p className="mt-4 text-[13px] text-bone/45">
        Leads captured from the donate form. Payment is processed externally; these rows record
        donor intent and designation for receipts and follow-up.
      </p>
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
