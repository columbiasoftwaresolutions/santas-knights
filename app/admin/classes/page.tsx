import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell, adminField, adminLabel } from "@/components/admin/AdminShell";
import { createClass, setClassPublished, deleteClass } from "@/app/admin/training-actions";

export const metadata: Metadata = {
  title: "Classes · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  class_type: string;
  location: string | null;
  starts_at: string;
  capacity: number;
  is_published: boolean;
};

const CLASS_TYPES = ["standard", "community", "women", "veterans", "workshop", "armor", "sparring", "volunteer"];

export default async function AdminClassesPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const { data } = await gate.supabase
    .from("classes")
    .select("id, title, class_type, location, starts_at, capacity, is_published")
    .order("starts_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="classes" title="Classes" email={gate.email}>
      <Card className="border-bone/15 bg-ink2 p-[26px]">
        <h2 className="text-[17px] font-extrabold text-bone">Schedule a class</h2>
        <form action={createClass} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={adminLabel}>Title</label>
            <input name="title" required placeholder="Gladiator Bootcamp" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Type</label>
            <select name="class_type" className={adminField} defaultValue="standard">
              {CLASS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={adminLabel}>Catalog slug (optional)</label>
            <input name="slug" placeholder="bootcamp" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Starts</label>
            <input name="starts_at" type="datetime-local" required className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Ends (optional)</label>
            <input name="ends_at" type="datetime-local" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Location</label>
            <input name="location" placeholder="Manhattanville Community Center" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Capacity</label>
            <input name="capacity" type="number" defaultValue={20} className={adminField} />
          </div>
          <div className="md:col-span-2">
            <label className={adminLabel}>Description</label>
            <input name="description" className={adminField} />
          </div>
          <label className="flex items-center gap-2 text-[13.5px] text-bone/70">
            <input type="checkbox" name="requires_approval" className="h-4 w-4 accent-amber" />
            Requires instructor approval (armor / sparring)
          </label>
          <div className="flex items-end justify-end">
            <button type="submit" className="cursor-pointer rounded-pill bg-green px-5 py-2.5 text-[14px] font-bold text-white">
              Add class
            </button>
          </div>
        </form>
      </Card>

      <Card className="mt-7 overflow-x-auto border-bone/15 bg-ink2 p-0">
        {rows.length === 0 ? (
          <p className="p-6 text-bone/60">No classes scheduled.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead className="border-b border-bone/15 text-[11px] uppercase tracking-[0.1em] text-bone/45">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Cap</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="text-bone/80">
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-bone/10">
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {new Date(r.starts_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-bone">{r.title}</td>
                  <td className="px-4 py-2.5">{r.class_type}</td>
                  <td className="px-4 py-2.5">{r.capacity}</td>
                  <td className="px-4 py-2.5">{r.is_published ? "published" : "hidden"}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-2">
                      <form action={setClassPublished}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="is_published" value={String(!r.is_published)} />
                        <button type="submit" className="cursor-pointer rounded-pill border border-bone/25 px-3 py-1 text-[12px] font-bold text-bone">
                          {r.is_published ? "Hide" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteClass}>
                        <input type="hidden" name="id" value={r.id} />
                        <button type="submit" className="cursor-pointer rounded-pill border border-red/50 px-3 py-1 text-[12px] font-bold text-[#e7705e]">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </AdminShell>
  );
}
