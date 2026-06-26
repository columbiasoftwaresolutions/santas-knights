import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { updateXpValue, updateLevelThreshold } from "@/app/admin/training-actions";

export const metadata: Metadata = {
  title: "XP & Levels · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type XpRow = { id: string; event_type: string; label: string; xp_value: number; track: string; is_active: boolean };
type LevelRow = { id: string; name: string; threshold: number; track: string; sort_order: number };

export default async function AdminXpPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const [{ data: xp }, { data: levels }] = await Promise.all([
    gate.supabase.from("xp_config").select("id, event_type, label, xp_value, track, is_active").order("xp_value", { ascending: false }),
    gate.supabase.from("levels").select("id, name, threshold, track, sort_order").order("sort_order", { ascending: true }),
  ]);
  const xpRows = (xp ?? []) as XpRow[];
  const levelRows = (levels ?? []) as LevelRow[];

  return (
    <AdminShell active="xp" title="XP & Levels" email={gate.email}>
      <p className="text-[14px] text-bone/55">
        XP values, level names, and thresholds are data — edit them here, no code change needed.
        Changes apply to future awards.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-bone/15 bg-ink2 p-[22px]">
          <h2 className="text-[16px] font-extrabold text-bone">XP event values</h2>
          <div className="mt-4 grid gap-2">
            {xpRows.map((r) => (
              <form key={r.id} action={updateXpValue} className="flex items-center gap-3 border-b border-bone/10 pb-2">
                <input type="hidden" name="id" value={r.id} />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-bone">{r.label}</p>
                  <p className="text-[11px] text-bone/40">{r.event_type} · {r.track}</p>
                </div>
                <input
                  name="xp_value"
                  type="number"
                  defaultValue={r.xp_value}
                  className="w-20 border border-bone/20 bg-[#0f0c0a] px-2.5 py-1.5 text-[14px] text-bone focus:border-amber focus:outline-none"
                />
                <label className="flex items-center gap-1.5 text-[12px] text-bone/55">
                  <input type="checkbox" name="is_active" defaultChecked={r.is_active} className="h-4 w-4 accent-green" />
                  active
                </label>
                <button type="submit" className="cursor-pointer rounded-pill bg-green px-3 py-1.5 text-[12.5px] font-bold text-white">
                  Save
                </button>
              </form>
            ))}
          </div>
        </Card>

        <Card className="border-bone/15 bg-ink2 p-[22px]">
          <h2 className="text-[16px] font-extrabold text-bone">Levels (Fighter Path)</h2>
          <div className="mt-4 grid gap-2">
            {levelRows.map((r) => (
              <form key={r.id} action={updateLevelThreshold} className="flex items-center gap-2 border-b border-bone/10 pb-2">
                <input type="hidden" name="id" value={r.id} />
                <input
                  name="name"
                  defaultValue={r.name}
                  className="flex-1 border border-bone/20 bg-[#0f0c0a] px-2.5 py-1.5 text-[14px] text-bone focus:border-amber focus:outline-none"
                />
                <input
                  name="threshold"
                  type="number"
                  defaultValue={r.threshold}
                  className="w-24 border border-bone/20 bg-[#0f0c0a] px-2.5 py-1.5 text-[14px] text-bone focus:border-amber focus:outline-none"
                />
                <button type="submit" className="cursor-pointer rounded-pill bg-green px-3 py-1.5 text-[12.5px] font-bold text-white">
                  Save
                </button>
              </form>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
