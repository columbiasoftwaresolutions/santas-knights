import type { Metadata } from "next";
import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { updateLetterStatus, type LetterAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { GiftChart } from "@/components/admin/GiftChart";
import { LetterViewer } from "@/components/admin/LetterViewer";
import {
  LettersFilters,
  type LetterStatusFilter,
  type GrainSetting,
} from "@/components/admin/LettersFilters";
import { requireAdmin } from "@/components/admin/guard";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import {
  addDaysToDateKey,
  autoGrain,
  bucketKeyFor,
  bucketKeys,
  formatSiteDateTime,
  isDateKey,
  siteDateKey,
  siteDateStartUtc,
  type Grain,
} from "@/lib/dates";
import { LETTERS_BUCKET } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type DbStatus = "live" | "fulfilled" | "deleted";

const DB_STATUS_FOR_FILTER: Record<Exclude<LetterStatusFilter, "all">, DbStatus> = {
  active: "live",
  fulfilled: "fulfilled",
  inactive: "deleted",
};

const STATE_LABEL: Record<DbStatus, string> = {
  live: "Active",
  fulfilled: "Fulfilled",
  deleted: "Inactive",
};

/** Which management verbs make sense from each status. */
const ACTIONS_FOR_STATUS: Record<DbStatus, { action: LetterAction; label: string; primary?: boolean }[]> = {
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

function isStatusFilter(value: string | undefined): value is LetterStatusFilter {
  return value === "all" || value === "fulfilled" || value === "active" || value === "inactive";
}

function isGrainSetting(value: string | undefined): value is GrainSetting {
  return value === "auto" || value === "day" || value === "week" || value === "month";
}

function maskEmail(email: string | null): string {
  if (!email) return "—";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 1)}***@${domain}`;
}

type LetterRow = {
  id: string;
  child_first_name: string;
  child_age: number;
  wish_note: string;
  wishlist_url: string | null;
  letter_image_path: string | null;
  status: DbStatus;
  fulfilled_by_email: string | null;
  claimed_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
  letterImageUrl?: string | null;
};

export default async function AdminLettersPage({
  searchParams,
}: {
  searchParams: Promise<{
    section?: string;
    status?: string;
    grain?: string;
    start?: string;
    end?: string;
  }>;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.node;

  const params = await searchParams;
  const section = params.section === "stats" ? "stats" : "list";
  const status: LetterStatusFilter = isStatusFilter(params.status) ? params.status : "all";
  const today = siteDateKey();
  let start = isDateKey(params.start) ? params.start : addDaysToDateKey(today, -29);
  let end = isDateKey(params.end) ? params.end : today;
  if (start > end) [start, end] = [end, start];

  const grainSetting: GrainSetting = isGrainSetting(params.grain) ? params.grain : "auto";
  const effectiveGrain: Grain = grainSetting === "auto" ? autoGrain(start, end) : grainSetting;

  const rangeStart = siteDateStartUtc(start).toISOString();
  const rangeEnd = siteDateStartUtc(addDaysToDateKey(end, 1)).toISOString();

  return (
    <AdminShell active="letters" title="Letters" email={gate.email}>
      <LettersSubnav section={section} status={status} grain={grainSetting} start={start} end={end} />
      <LettersFilters
        section={section}
        status={status}
        grain={grainSetting}
        effectiveGrain={effectiveGrain}
        start={start}
        end={end}
        today={today}
      />
      {section === "stats" ? (
        <StatsSection
          supabase={gate.supabase}
          status={status}
          grain={effectiveGrain}
          start={start}
          end={end}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
        />
      ) : (
        <ListSection supabase={gate.supabase} status={status} rangeStart={rangeStart} rangeEnd={rangeEnd} />
      )}
    </AdminShell>
  );
}

function LettersSubnav({
  section,
  status,
  grain,
  start,
  end,
}: {
  section: "list" | "stats";
  status: LetterStatusFilter;
  grain: GrainSetting;
  start: string;
  end: string;
}) {
  const query = `status=${status}&grain=${grain}&start=${start}&end=${end}`;
  return (
    <nav className="flex gap-7 border-b border-line">
      <Link
        href={`/admin?section=list&${query}`}
        className={cn(
          "-mb-px border-b-2 pb-3 text-[13px] font-extrabold uppercase tracking-[0.06em]",
          section === "list" ? "border-red text-ink" : "border-transparent text-muted hover:text-ink",
        )}
      >
        All letters
      </Link>
      <Link
        href={`/admin?section=stats&${query}`}
        className={cn(
          "-mb-px border-b-2 pb-3 text-[13px] font-extrabold uppercase tracking-[0.06em]",
          section === "stats" ? "border-red text-ink" : "border-transparent text-muted hover:text-ink",
        )}
      >
        Stats
      </Link>
    </nav>
  );
}

async function ListSection({
  supabase,
  status,
  rangeStart,
  rangeEnd,
}: {
  supabase: SupabaseClient;
  status: LetterStatusFilter;
  rangeStart: string;
  rangeEnd: string;
}) {
  let query = supabase
    .from("santa_letters")
    .select(
      "id, child_first_name, child_age, wish_note, wishlist_url, letter_image_path, status, fulfilled_by_email, claimed_at, fulfilled_at, created_at",
    )
    .gte("created_at", rangeStart)
    .lt("created_at", rangeEnd)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (status !== "all") query = query.eq("status", DB_STATUS_FOR_FILTER[status]);

  const { data, error } = await query;
  if (error) console.error("Failed to load letters:", error.message);
  const rows = (data ?? []) as LetterRow[];

  const paths = rows.map((row) => row.letter_image_path).filter(Boolean) as string[];
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage.from(LETTERS_BUCKET).createSignedUrls(paths, 60 * 60);
    const byPath = new Map(signed?.map((s) => [s.path, s.signedUrl]) ?? []);
    rows.forEach((row) => {
      row.letterImageUrl = row.letter_image_path ? (byPath.get(row.letter_image_path) ?? null) : null;
    });
  }

  return (
    <Card className="mt-7 overflow-x-auto p-0">
      {rows.length === 0 ? (
        <p className="p-6 text-muted">No letters in this range.</p>
      ) : (
        <table className="w-full min-w-[1040px] text-left text-[13.5px]">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3">Child</th>
              <th className="px-4 py-3">Wish</th>
              <th className="px-4 py-3">Letter</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Claimed</th>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="text-ink/80">
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line align-top">
                <td className="px-4 py-3 font-semibold whitespace-nowrap text-ink">
                  {row.child_first_name}, {row.child_age}
                </td>
                <td className="max-w-[280px] truncate px-4 py-3">
                  {row.wishlist_url ? (
                    <a
                      href={row.wishlist_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-red underline underline-offset-2 hover:text-red-deep"
                    >
                      {row.wish_note}
                    </a>
                  ) : (
                    row.wish_note
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.letterImageUrl && <LetterViewer imageUrl={row.letterImageUrl} />}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{formatSiteDateTime(row.created_at)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.claimed_at ? formatSiteDateTime(row.claimed_at) : "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{maskEmail(row.fulfilled_by_email)}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-block px-2.5 py-1 text-[12px] font-bold",
                      row.status === "fulfilled"
                        ? "bg-green-soft text-green"
                        : row.status === "deleted"
                          ? "bg-line text-muted"
                          : "bg-paper text-ink",
                    )}
                  >
                    {STATE_LABEL[row.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={updateLetterStatus}>
                    <input type="hidden" name="letter_id" value={row.id} />
                    <div className="flex flex-wrap gap-2">
                      {ACTIONS_FOR_STATUS[row.status]?.map(({ action, label, primary }) => {
                        if (action === "release" && !row.claimed_at) return null;
                        return (
                          <button
                            key={action}
                            type="submit"
                            name="action"
                            value={action}
                            className={cn(
                              "cursor-pointer border-[1.5px] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.04em] transition-colors",
                              primary
                                ? "border-green bg-green text-white"
                                : action === "delete"
                                  ? "border-red/60 bg-transparent text-red"
                                  : "border-line bg-transparent text-ink",
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

async function StatsSection({
  supabase,
  status,
  grain,
  start,
  end,
  rangeStart,
  rangeEnd,
}: {
  supabase: SupabaseClient;
  status: LetterStatusFilter;
  grain: Grain;
  start: string;
  end: string;
  rangeStart: string;
  rangeEnd: string;
}) {
  const [{ data: submittedRows, error: submittedError }, { data: fulfilledRows, error: fulfilledError }] =
    await Promise.all([
      supabase
        .from("santa_letters")
        .select("created_at, status")
        .gte("created_at", rangeStart)
        .lt("created_at", rangeEnd),
      supabase
        .from("santa_letters")
        .select("fulfilled_at")
        .gte("fulfilled_at", rangeStart)
        .lt("fulfilled_at", rangeEnd),
    ]);
  if (submittedError) console.error("Failed to load letter submissions:", submittedError.message);
  if (fulfilledError) console.error("Failed to load letter fulfillments:", fulfilledError.message);

  const buckets = bucketKeys(start, end, grain);
  const submittedCounts = new Map(buckets.map((bucket) => [bucket, 0]));
  const activeCounts = new Map(buckets.map((bucket) => [bucket, 0]));
  const fulfilledCounts = new Map(buckets.map((bucket) => [bucket, 0]));

  submittedRows?.forEach((row) => {
    const key = bucketKeyFor(siteDateKey(row.created_at), grain);
    submittedCounts.set(key, (submittedCounts.get(key) ?? 0) + 1);
    if (row.status === "live") activeCounts.set(key, (activeCounts.get(key) ?? 0) + 1);
  });
  fulfilledRows?.forEach((row) => {
    if (!row.fulfilled_at) return;
    const key = bucketKeyFor(siteDateKey(row.fulfilled_at), grain);
    fulfilledCounts.set(key, (fulfilledCounts.get(key) ?? 0) + 1);
  });

  const submitted = submittedRows?.length ?? 0;
  const fulfilled = fulfilledRows?.length ?? 0;
  const active = submittedRows?.filter((row) => row.status === "live").length ?? 0;

  const series: Record<"all" | "fulfilled" | "active", { title: string; color: "red" | "amber" | "green"; counts: Map<string, number> }> = {
    all: { title: "Submitted", color: "red", counts: submittedCounts },
    fulfilled: { title: "Fulfilled", color: "green", counts: fulfilledCounts },
    active: { title: "Active", color: "amber", counts: activeCounts },
  };

  return (
    <>
      <div className="mt-7 grid border-y border-line bg-card sm:grid-cols-3">
        <Metric label="Submitted" value={submitted} />
        <Metric label="Fulfilled" value={fulfilled} className="border-t sm:border-t-0 sm:border-l" />
        <Metric label="Active" value={active} className="border-t sm:border-t-0 sm:border-l" />
      </div>

      <div className="mt-7">
        {status === "inactive" ? (
          <Card className="p-[34px] text-center text-muted">
            Inactive letters aren&apos;t charted — pick a different status above to see a graph.
          </Card>
        ) : (
          <GiftChart
            title={series[status].title}
            color={series[status].color}
            grain={grain}
            points={buckets.map((date) => ({ date, value: series[status].counts.get(date) ?? 0 }))}
          />
        )}
      </div>
    </>
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
