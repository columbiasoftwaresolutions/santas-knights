import type { Metadata } from "next";
import Link from "next/link";
import { adminMarkGifted, adminReleaseClaim } from "@/app/admin/gift-actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { GiftChart } from "@/components/admin/GiftChart";
import { requireAdmin } from "@/components/admin/guard";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import {
  addDaysToDateKey,
  dateKeysBetween,
  formatSiteDateTime,
  isDateKey,
  siteDateKey,
  siteDateStartUtc,
} from "@/lib/dates";

export const metadata: Metadata = {
  title: "Gifts · Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type GiftRow = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  status: string;
  fulfilled_by_email: string | null;
  claimed_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
};

function maskEmail(email: string | null): string {
  if (!email) return "—";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 1)}***@${domain}`;
}

export default async function AdminGiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; start?: string; end?: string }>;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const params = await searchParams;
  const section = params.section === "all" ? "all" : "stats";
  const today = siteDateKey();
  let start = isDateKey(params.start) ? params.start : addDaysToDateKey(today, -6);
  let end = isDateKey(params.end) ? params.end : today;
  if (start > end) [start, end] = [end, start];

  const rangeStart = siteDateStartUtc(start).toISOString();
  const rangeEnd = siteDateStartUtc(addDaysToDateKey(end, 1)).toISOString();

  if (section === "all") {
    const { data, error } = await gate.supabase
      .from("santa_letters")
      .select(
        "id, child_first_name, child_age, wish_note, status, fulfilled_by_email, claimed_at, fulfilled_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) console.error("Failed to load gifts:", error.message);

    return (
      <AdminShell active="gifts" title="Gifts" email={gate.email}>
        <GiftSubnav section={section} start={start} end={end} />
        <AllGifts rows={(data ?? []) as GiftRow[]} />
      </AdminShell>
    );
  }

  const [{ data: submittedRows, error: submittedError }, { data: claimRows, error: claimsError }] =
    await Promise.all([
      gate.supabase
        .from("santa_letters")
        .select("created_at, status, claimed_at")
        .gte("created_at", rangeStart)
        .lt("created_at", rangeEnd),
      gate.supabase
        .from("santa_letters")
        .select("claimed_at")
        .gte("claimed_at", rangeStart)
        .lt("claimed_at", rangeEnd),
    ]);
  if (submittedError) console.error("Failed to load gift submissions:", submittedError.message);
  if (claimsError) console.error("Failed to load gift claims:", claimsError.message);

  const days = dateKeysBetween(start, end);
  const submittedCounts = new Map(days.map((day) => [day, 0]));
  const claimCounts = new Map(days.map((day) => [day, 0]));
  submittedRows?.forEach((row) => {
    const key = siteDateKey(row.created_at);
    submittedCounts.set(key, (submittedCounts.get(key) ?? 0) + 1);
  });
  claimRows?.forEach((row) => {
    if (!row.claimed_at) return;
    const key = siteDateKey(row.claimed_at);
    claimCounts.set(key, (claimCounts.get(key) ?? 0) + 1);
  });

  const submitted = submittedRows?.length ?? 0;
  const claimed = claimRows?.length ?? 0;
  const unclaimed =
    submittedRows?.filter((row) => row.status === "live" && row.claimed_at === null).length ?? 0;

  return (
    <AdminShell active="gifts" title="Gifts" email={gate.email}>
      <GiftSubnav section={section} start={start} end={end} />

      <form className="mt-7 flex flex-wrap items-end gap-4 border-y border-line bg-paper-raised px-5 py-4">
        <input type="hidden" name="section" value="stats" />
        <label className="grid gap-1.5 text-[12px] font-bold text-muted">
          Start date
          <input
            type="date"
            name="start"
            defaultValue={start}
            max={end}
            className="h-10 border-[1.5px] border-line bg-card px-3 text-[14px] font-medium text-ink focus:border-red focus:outline-none"
          />
        </label>
        <label className="grid gap-1.5 text-[12px] font-bold text-muted">
          End date
          <input
            type="date"
            name="end"
            defaultValue={end}
            min={start}
            max={today}
            className="h-10 border-[1.5px] border-line bg-card px-3 text-[14px] font-medium text-ink focus:border-red focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="h-10 cursor-pointer border-[1.5px] border-red bg-red px-5 text-[13px] font-extrabold text-white transition-colors hover:bg-red-deep"
        >
          Update stats
        </button>
        <span className="pb-2 text-[12px] text-muted">All dates use New York time.</span>
      </form>

      <div className="mt-7 grid border-y border-line bg-card sm:grid-cols-3">
        <Metric label="Gifts submitted" value={submitted} />
        <Metric label="Gifts claimed" value={claimed} className="border-t sm:border-t-0 sm:border-l" />
        <Metric label="Unclaimed gifts" value={unclaimed} className="border-t sm:border-t-0 sm:border-l" />
      </div>

      <div className="mt-7 grid min-w-0 gap-5 xl:grid-cols-2">
        <GiftChart
          title="Gifts submitted"
          color="red"
          points={days.map((date) => ({ date, value: submittedCounts.get(date) ?? 0 }))}
        />
        <GiftChart
          title="Gifts claimed"
          color="amber"
          points={days.map((date) => ({ date, value: claimCounts.get(date) ?? 0 }))}
        />
      </div>
    </AdminShell>
  );
}

function GiftSubnav({
  section,
  start,
  end,
}: {
  section: "stats" | "all";
  start: string;
  end: string;
}) {
  return (
    <nav className="flex gap-7 border-b border-line">
      <Link
        href={`/admin/gifts?section=stats&start=${start}&end=${end}`}
        className={cn(
          "-mb-px border-b-2 pb-3 text-[13px] font-extrabold uppercase tracking-[0.06em]",
          section === "stats" ? "border-red text-ink" : "border-transparent text-muted hover:text-ink",
        )}
      >
        Stats
      </Link>
      <Link
        href="/admin/gifts?section=all"
        className={cn(
          "-mb-px border-b-2 pb-3 text-[13px] font-extrabold uppercase tracking-[0.06em]",
          section === "all" ? "border-red text-ink" : "border-transparent text-muted hover:text-ink",
        )}
      >
        All gifts
      </Link>
    </nav>
  );
}

function Metric({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className={cn("border-line px-6 py-5", className)}>
      <p className="font-display text-[38px] font-black leading-none tracking-[-0.04em] text-red">{value}</p>
      <p className="mt-2 text-[12px] font-bold text-muted">{label}</p>
    </div>
  );
}

function AllGifts({ rows }: { rows: GiftRow[] }) {
  return (
    <Card className="mt-7 overflow-x-auto p-0">
      {rows.length === 0 ? (
        <p className="p-6 text-muted">No gifts have been submitted yet.</p>
      ) : (
        <table className="w-full min-w-[980px] text-left text-[13.5px]">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3">Child</th>
              <th className="px-4 py-3">Wish</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Claimed</th>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="text-ink/80">
            {rows.map((row) => {
              const gifted = row.status === "fulfilled";
              const claimed = row.status === "live" && Boolean(row.claimed_at);
              const state = gifted ? "Gifted" : claimed ? "Claimed" : row.status === "deleted" ? "Deleted" : "Unclaimed";
              return (
                <tr key={row.id} className="border-b border-line align-top">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap text-ink">
                    {row.child_first_name}, {row.child_age}
                  </td>
                  <td className="max-w-[300px] truncate px-4 py-3">{row.wish_note}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatSiteDateTime(row.created_at)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.claimed_at ? formatSiteDateTime(row.claimed_at) : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{maskEmail(row.fulfilled_by_email)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block px-2.5 py-1 text-[12px] font-bold",
                        gifted
                          ? "bg-green-soft text-green"
                          : claimed
                            ? "bg-gold-soft text-[#6c5418]"
                            : state === "Deleted"
                              ? "bg-line text-muted"
                              : "bg-paper text-ink",
                      )}
                    >
                      {state}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {claimed && (
                      <div className="flex gap-2">
                        <form action={adminMarkGifted}>
                          <input type="hidden" name="letter_id" value={row.id} />
                          <button type="submit" className="cursor-pointer bg-green px-3 py-1.5 text-[12px] font-bold text-white">
                            Mark gifted
                          </button>
                        </form>
                        <form action={adminReleaseClaim}>
                          <input type="hidden" name="letter_id" value={row.id} />
                          <button type="submit" className="cursor-pointer border border-line px-3 py-1 text-[12px] font-bold text-ink">
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
  );
}
