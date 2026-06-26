import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminMarkGifted, adminReleaseClaim } from "@/app/admin/gift-actions";

export const metadata: Metadata = {
  title: "Gifts · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  status: string;
  fulfilled_by_email: string | null;
  claimed_at: string | null;
  fulfilled_at: string | null;
};

function maskEmail(email: string | null): string {
  if (!email) return "—";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 1)}***@${domain}`;
}

export default async function AdminGiftsPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  // Pipeline counts across the whole pool.
  const { data: statusRows } = await gate.supabase.from("santa_letters").select("status");
  const tally = (s: string) => (statusRows ?? []).filter((r) => r.status === s).length;
  const unclaimed = tally("approved");
  const pending = tally("claimed");
  const gifted = tally("fulfilled");

  // The active gift pipeline: claimed (to send) first, then recently gifted.
  const { data } = await gate.supabase
    .from("santa_letters")
    .select("id, child_first_name, child_age, wish_note, status, fulfilled_by_email, claimed_at, fulfilled_at")
    .in("status", ["claimed", "fulfilled"])
    .order("claimed_at", { ascending: false })
    .limit(500);
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="gifts" title="Gifts" email={gate.email}>
      <p className="text-[14px] text-bone/55">
        Who adopted which letter, and what&apos;s still to send. A claimed letter drops out of the
        public pool so two people can&apos;t buy the same gift.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-[14px]">
        <Stat label="Unclaimed (live)" value={String(unclaimed)} tone="text-bone" />
        <Stat label="Claimed · to send" value={String(pending)} tone="text-amber" />
        <Stat label="Gifted" value={String(gifted)} tone="text-green" />
      </div>

      <Card className="mt-7 overflow-x-auto border-bone/15 bg-ink2 p-0">
        {rows.length === 0 ? (
          <p className="p-6 text-bone/60">No letters have been adopted yet.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead className="border-b border-bone/15 text-[11px] uppercase tracking-[0.1em] text-bone/45">
              <tr>
                <th className="px-4 py-3">Child</th>
                <th className="px-4 py-3">Wish</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="text-bone/80">
              {rows.map((r) => {
                const gifted = r.status === "fulfilled";
                return (
                  <tr key={r.id} className="border-b border-bone/10">
                    <td className="px-4 py-2.5 font-semibold whitespace-nowrap text-bone">
                      {r.child_first_name}, {r.child_age}
                    </td>
                    <td className="max-w-[280px] truncate px-4 py-2.5">{r.wish_note}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{maskEmail(r.fulfilled_by_email)}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-pill px-2.5 py-1 text-[12px] font-bold ${
                          gifted ? "bg-green/15 text-green" : "bg-amber/15 text-amber"
                        }`}
                      >
                        {gifted ? "Gifted" : "To send"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {gifted
                        ? r.fulfilled_at && new Date(r.fulfilled_at).toLocaleDateString()
                        : r.claimed_at && new Date(r.claimed_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5">
                      {!gifted && (
                        <div className="flex gap-2">
                          <form action={adminMarkGifted}>
                            <input type="hidden" name="letter_id" value={r.id} />
                            <button type="submit" className="cursor-pointer rounded-pill bg-green px-3 py-1 text-[12px] font-bold text-white">
                              Mark gifted
                            </button>
                          </form>
                          <form action={adminReleaseClaim}>
                            <input type="hidden" name="letter_id" value={r.id} />
                            <button type="submit" className="cursor-pointer rounded-pill border border-bone/25 px-3 py-1 text-[12px] font-bold text-bone">
                              Release
                            </button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </AdminShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <Card className="border-bone/15 bg-ink2 p-5">
      <p className={`font-display text-[30px] font-black tracking-[-0.03em] ${tone}`}>{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-bone/55">{label}</p>
    </Card>
  );
}
