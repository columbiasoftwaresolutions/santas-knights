import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell, adminField, adminLabel } from "@/components/admin/AdminShell";
import { GALLERY_BUCKET, publicStorageUrl } from "@/lib/supabase/config";
import { createPartner, togglePartnerPublished, deletePartner } from "@/app/admin/content-actions";

export const metadata: Metadata = {
  title: "Partners · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  website_url: string | null;
  logo_path: string | null;
  sort_order: number;
  is_published: boolean;
};

export default async function AdminPartnersPage() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const { data } = await gate.supabase
    .from("partners")
    .select("id, name, website_url, logo_path, sort_order, is_published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="partners" title="Partners" email={gate.email}>
      <Card className="border-bone/15 bg-ink2 p-[26px]">
        <h2 className="text-[17px] font-extrabold text-bone">Add partner</h2>
        <form action={createPartner} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={adminLabel}>Name</label>
            <input name="name" required className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Website URL</label>
            <input name="website_url" placeholder="https://…" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Logo (optional)</label>
            <input type="file" name="file" accept="image/*" className={adminField} />
          </div>
          <div>
            <label className={adminLabel}>Sort order</label>
            <input name="sort_order" type="number" defaultValue={0} className={adminField} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="cursor-pointer rounded-pill bg-green px-5 py-2.5 text-[14px] font-bold text-white">
              Add partner
            </button>
          </div>
        </form>
      </Card>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.length === 0 ? (
          <Card className="border-bone/15 bg-ink2 p-6 text-bone/60">No partners yet.</Card>
        ) : (
          rows.map((row) => {
            const logo = row.logo_path ? publicStorageUrl(GALLERY_BUCKET, row.logo_path) : null;
            return (
              <Card key={row.id} className="border-bone/15 bg-ink2 p-5">
                <div className="flex h-[60px] items-center">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt={row.name} className="h-[44px] w-auto object-contain" />
                  ) : (
                    <span className="text-[16px] font-extrabold text-bone">{row.name}</span>
                  )}
                </div>
                <p className="mt-2 text-[12px] text-bone/50">
                  #{row.sort_order} · {row.is_published ? "published" : "hidden"}
                  {row.website_url ? " · linked" : ""}
                </p>
                <div className="mt-3 flex gap-2">
                  <form action={togglePartnerPublished}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="is_published" value={String(!row.is_published)} />
                    <button type="submit" className="cursor-pointer rounded-pill border border-bone/25 px-3 py-1.5 text-[12.5px] font-bold text-bone">
                      {row.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deletePartner}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="logo_path" value={row.logo_path ?? ""} />
                    <button type="submit" className="cursor-pointer rounded-pill border border-red/50 px-3 py-1.5 text-[12.5px] font-bold text-[#e7705e]">
                      Delete
                    </button>
                  </form>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
