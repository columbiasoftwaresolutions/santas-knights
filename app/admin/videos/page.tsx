import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireStaff } from "@/components/admin/guard";
import { AdminShell, adminField, adminLabel } from "@/components/admin/AdminShell";
import { createVideo, setVideoPublished, deleteVideo } from "@/app/admin/training-actions";

export const metadata: Metadata = {
  title: "Training videos · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  category: string | null;
  storage_path: string | null;
  external_url: string | null;
  is_published: boolean;
  sort_order: number;
};

export default async function AdminVideosPage() {
  const gate = await requireStaff();
  if (!gate.ok) return gate.node;

  const { data } = await gate.supabase
    .from("training_videos")
    .select("id, title, category, storage_path, external_url, is_published, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="videos" title="Training videos" email={gate.email}>
      <Card className="border-bone/15 bg-ink2 p-[26px]">
        <h2 className="text-[17px] font-extrabold text-bone">Add a video</h2>
        <p className="mt-1 text-[13px] text-bone/50">Upload a file to the private library, or paste a YouTube/Vimeo link.</p>
        <form action={createVideo} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={adminLabel}>Title</label>
            <input name="title" required className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Category</label>
            <input name="category" placeholder="Conditioning, Technique…" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Sort order</label>
            <input name="sort_order" type="number" defaultValue={0} className={adminField} />
          </div>
          <div className="md:col-span-2">
            <label className={adminLabel}>Description</label>
            <input name="description" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Upload file</label>
            <input type="file" name="file" accept="video/*" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>…or external URL</label>
            <input name="external_url" placeholder="https://youtube.com/…" className={adminField} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="cursor-pointer rounded-pill bg-green px-5 py-2.5 text-[14px] font-bold text-white">
              Add video
            </button>
          </div>
        </form>
      </Card>

      <div className="mt-7 grid gap-3">
        {rows.length === 0 ? (
          <Card className="border-bone/15 bg-ink2 p-6 text-bone/60">No videos yet.</Card>
        ) : (
          rows.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 border-bone/15 bg-ink2 p-4">
              <div>
                <p className="text-[14.5px] font-bold text-bone">{r.title}</p>
                <p className="text-[12px] text-bone/45">
                  {r.category ?? "—"} · #{r.sort_order} · {r.storage_path ? "uploaded" : "external"} ·{" "}
                  {r.is_published ? "published" : "hidden"}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={setVideoPublished}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="is_published" value={String(!r.is_published)} />
                  <button type="submit" className="cursor-pointer rounded-pill border border-bone/25 px-3 py-1.5 text-[12.5px] font-bold text-bone">
                    {r.is_published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteVideo}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="storage_path" value={r.storage_path ?? ""} />
                  <button type="submit" className="cursor-pointer rounded-pill border border-red/50 px-3 py-1.5 text-[12.5px] font-bold text-[#e7705e]">
                    Delete
                  </button>
                </form>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
