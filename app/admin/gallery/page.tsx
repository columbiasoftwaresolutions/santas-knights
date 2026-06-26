import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell, adminField, adminLabel } from "@/components/admin/AdminShell";
import { GALLERY_BUCKET, publicStorageUrl } from "@/lib/supabase/config";
import {
  createGalleryItem,
  toggleGalleryPublished,
  deleteGalleryItem,
} from "@/app/admin/content-actions";

export const metadata: Metadata = {
  title: "Gallery · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string | null;
  caption: string | null;
  category: string | null;
  media_type: string;
  storage_path: string | null;
  external_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export default async function AdminGalleryPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const { data } = await gate.supabase
    .from("gallery_media")
    .select("id, title, caption, category, media_type, storage_path, external_url, sort_order, is_published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="gallery" title="Gallery" email={gate.email}>
      <Card className="border-bone/15 bg-ink2 p-[26px]">
        <h2 className="text-[17px] font-extrabold text-bone">Add media</h2>
        <form action={createGalleryItem} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={adminLabel}>Title</label>
            <input name="title" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Category (filter chip)</label>
            <input name="category" placeholder="Training, Santa's Letters…" className={adminField} />
          </div>
          <div className="md:col-span-2">
            <label className={adminLabel}>Caption</label>
            <input name="caption" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Alt text (accessibility)</label>
            <input name="alt_text" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Type</label>
            <select name="media_type" className={adminField} defaultValue="image">
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label className={adminLabel}>Upload file</label>
            <input type="file" name="file" accept="image/*,video/*" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>…or external URL</label>
            <input name="external_url" placeholder="https://…" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Sort order</label>
            <input name="sort_order" type="number" defaultValue={0} className={adminField} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="cursor-pointer rounded-pill bg-green px-5 py-2.5 text-[14px] font-bold text-white">
              Add to gallery
            </button>
          </div>
        </form>
      </Card>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.length === 0 ? (
          <Card className="border-bone/15 bg-ink2 p-6 text-bone/60">No media yet.</Card>
        ) : (
          rows.map((row) => {
            const url = row.storage_path
              ? publicStorageUrl(GALLERY_BUCKET, row.storage_path)
              : row.external_url;
            return (
              <Card key={row.id} className="overflow-hidden border-bone/15 bg-ink2 p-0">
                <div className="aspect-[4/3] bg-[#0f0c0a]">
                  {url && row.media_type === "video" ? (
                    <video src={url} className="h-full w-full object-cover" muted />
                  ) : url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={row.title ?? ""} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="text-[14px] font-bold text-bone">{row.title ?? "Untitled"}</p>
                  <p className="text-[12px] text-bone/50">
                    {row.category ?? "—"} · #{row.sort_order} · {row.is_published ? "published" : "hidden"}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <form action={toggleGalleryPublished}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="is_published" value={String(!row.is_published)} />
                      <button type="submit" className="cursor-pointer rounded-pill border border-bone/25 px-3 py-1.5 text-[12.5px] font-bold text-bone">
                        {row.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteGalleryItem}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="storage_path" value={row.storage_path ?? ""} />
                      <button type="submit" className="cursor-pointer rounded-pill border border-red/50 px-3 py-1.5 text-[12.5px] font-bold text-[#e7705e]">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
