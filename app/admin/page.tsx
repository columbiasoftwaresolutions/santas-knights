import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { requireAdmin } from "@/components/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { LETTERS_BUCKET } from "@/lib/supabase/config";
import { updateLetterStatus, type LetterAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Letters · Santa's Knights Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUSES = ["live", "fulfilled", "deleted"] as const;
type LetterStatus = (typeof STATUSES)[number];

const STATUS_LABEL: Record<LetterStatus, string> = {
  live: "Live",
  fulfilled: "Fulfilled",
  deleted: "Deleted",
};

/** Which management verbs make sense from each status. */
const ACTIONS_FOR_STATUS: Record<LetterStatus, { action: LetterAction; label: string; primary?: boolean }[]> = {
  live: [
    { action: "fulfill", label: "Mark fulfilled", primary: true },
    { action: "release", label: "Release claim" },
    { action: "delete", label: "Delete" },
  ],
  fulfilled: [
    { action: "restore", label: "Return live", primary: true },
    { action: "delete", label: "Delete" },
  ],
  deleted: [{ action: "restore", label: "Restore live", primary: true }],
};

type AdminLetter = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  amazon_urls: string[];
  wishlist_url: string | null;
  letter_image_path: string | null;
  status: LetterStatus;
  guardian_name: string;
  guardian_email: string;
  fulfilled_by_email: string | null;
  claimed_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
  imageUrl?: string | null;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;
  const supabase = gate.supabase;

  const params = await searchParams;
  const activeStatus: LetterStatus = STATUSES.includes(params.status as LetterStatus)
    ? (params.status as LetterStatus)
    : "live";

  // A single status scan is sufficient for the expected seasonal volume.
  const { data: statusRows } = await supabase.from("santa_letters").select("status");
  const counts = new Map<string, number>();
  statusRows?.forEach((row) => counts.set(row.status, (counts.get(row.status) ?? 0) + 1));
  const total = statusRows?.length ?? 0;

  const { data: letterRows, error: letterError } = await supabase
    .from("santa_letters")
    .select(
      "id, child_first_name, child_age, wish_note, amazon_urls, wishlist_url, letter_image_path, status, guardian_name, guardian_email, fulfilled_by_email, claimed_at, fulfilled_at, created_at",
    )
    .eq("status", activeStatus)
    .order("created_at", { ascending: true })
    .limit(200);

  if (letterError) console.error("Failed to load letters:", letterError.message);
  const letters = (letterRows ?? []) as AdminLetter[];

  const paths = letters.map((l) => l.letter_image_path).filter(Boolean) as string[];
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from(LETTERS_BUCKET)
      .createSignedUrls(paths, 60 * 60);
    const byPath = new Map(signed?.map((s) => [s.path, s.signedUrl]) ?? []);
    letters.forEach((letter) => {
      letter.imageUrl = letter.letter_image_path
        ? (byPath.get(letter.letter_image_path) ?? null)
        : null;
    });
  }

  return (
    <AdminShell active="letters" title="Letters" email={gate.email}>
        {/* Season totals */}
        <div className="mt-8 grid grid-cols-2 gap-[14px] sm:grid-cols-4">
          <Stat label="Submitted (all)" value={total} />
          <Stat label="Live" value={counts.get("live") ?? 0} />
          <Stat label="Fulfilled" value={counts.get("fulfilled") ?? 0} />
          <Stat label="Deleted" value={counts.get("deleted") ?? 0} />
        </div>

        {/* Status filter — underline tabs, matching the admin nav */}
        <nav className="mt-9 flex flex-wrap gap-7">
          {STATUSES.map((status) => (
            <Link
              key={status}
              href={`/admin?status=${status}`}
              className={cn(
                "border-b-2 pb-1.5 text-[13.5px] font-bold tracking-[0.05em] uppercase transition-colors",
                status === activeStatus
                  ? "border-red text-bone"
                  : "border-transparent text-bone/45 hover:text-bone",
              )}
            >
              {STATUS_LABEL[status]} · {counts.get(status) ?? 0}
            </Link>
          ))}
        </nav>

        {/* Letters */}
        <div className="mt-7 grid gap-[18px]">
          {letters.length === 0 ? (
            <Card className="border-bone/15 bg-ink2 p-[34px] text-center text-bone/60">
              Nothing with status “{STATUS_LABEL[activeStatus]}”.
            </Card>
          ) : (
            letters.map((letter) => (
              <Card key={letter.id} className="grid gap-6 border-bone/15 bg-ink2 p-[26px] lg:grid-cols-[220px_1fr]">
                {letter.imageUrl ? (
                  <a href={letter.imageUrl} target="_blank" rel="noopener noreferrer">
                    {/* Signed URL from Supabase Storage. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={letter.imageUrl}
                      alt={`${letter.child_first_name}'s letter`}
                      className="max-h-[260px] w-full border border-line bg-paper-raised object-contain"
                    />
                  </a>
                ) : (
                  <div className="flex h-[160px] items-center justify-center border border-dashed border-line text-[13px] font-bold text-muted uppercase">
                    No image
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-[20px] font-extrabold tracking-[-0.01em]">
                      {letter.child_first_name}, {letter.child_age}
                    </h2>
                    <span className="text-[13px] font-semibold text-muted">
                      submitted {new Date(letter.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 font-serif text-[15.5px] italic text-bone">“{letter.wish_note}”</p>
                  <p className="mt-2 text-[14px] text-bone/60">
                    {letter.wishlist_url ? (
                      <a
                        href={letter.wishlist_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-2 font-semibold text-red underline"
                      >
                        Amazon wishlist ↗
                      </a>
                    ) : (
                      letter.amazon_urls.map((url, i) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mr-2 font-semibold text-red underline"
                        >
                          Amazon link{letter.amazon_urls.length > 1 ? ` ${i + 1}` : ""} ↗
                        </a>
                      ))
                    )}
                    · Guardian: {letter.guardian_name} &lt;{letter.guardian_email}&gt;
                  </p>
                  {letter.claimed_at && letter.status === "live" && (
                    <p className="mt-2 bg-gold-soft/60 px-3 py-2 text-[13.5px] text-[#6c5418]">
                      <strong className="font-bold">Claimed:</strong>{" "}
                      {letter.fulfilled_by_email ?? "donor"} on{" "}
                      {new Date(letter.claimed_at).toLocaleDateString()}.
                    </p>
                  )}
                  {letter.fulfilled_at && letter.status === "fulfilled" && (
                    <p className="mt-2 bg-green-soft px-3 py-2 text-[13.5px] text-green">
                      <strong className="font-bold">Fulfilled:</strong>{" "}
                      {new Date(letter.fulfilled_at).toLocaleDateString()}.
                    </p>
                  )}

                  <form action={updateLetterStatus} className="mt-4">
                    <input type="hidden" name="letter_id" value={letter.id} />
                    <div className="flex flex-wrap gap-2">
                      {ACTIONS_FOR_STATUS[letter.status]?.map(({ action, label, primary }) => {
                        if (action === "release" && !letter.claimed_at) return null;
                        return (
                        <button
                          key={action}
                          type="submit"
                          name="action"
                          value={action}
                          className={cn(
                            "cursor-pointer border-[1.5px] px-4 py-2 text-[13px] font-bold uppercase tracking-[0.04em] transition-colors",
                            primary
                              ? "border-green bg-green text-white"
                              : action === "delete"
                                ? "border-red/60 bg-transparent text-[#e7705e]"
                                : "border-bone/25 bg-transparent text-bone",
                          )}
                        >
                          {label}
                        </button>
                        );
                      })}
                    </div>
                  </form>
                </div>
              </Card>
            ))
          )}
        </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-bone/15 bg-ink2 p-5">
      <p className="font-display text-[34px] font-black tracking-[-0.03em] text-amber">{value}</p>
      <p className="text-[11px] font-bold text-bone/55 uppercase tracking-[0.12em]">{label}</p>
    </Card>
  );
}
