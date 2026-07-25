"use client";

import { useRouter } from "next/navigation";

export type LetterStatusFilter = "all" | "fulfilled" | "active" | "inactive";

const STATUS_OPTIONS: { value: LetterStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

/**
 * Shared status + date-range controls for the Letters admin section. Every
 * change navigates immediately (no submit button) and both subtabs read the
 * same `status`/`start`/`end` params, so switching between them keeps the
 * filter. `section` is threaded through so the navigation stays on the
 * current subtab.
 */
export function LettersFilters({
  section,
  status,
  start,
  end,
  today,
}: {
  section: string;
  status: LetterStatusFilter;
  start: string;
  end: string;
  today: string;
}) {
  const router = useRouter();

  function navigate(next: { status?: string; start?: string; end?: string }) {
    const params = new URLSearchParams({
      section,
      status: next.status ?? status,
      start: next.start ?? start,
      end: next.end ?? end,
    });
    router.push(`/admin?${params.toString()}`);
  }

  return (
    <div className="mt-7 flex flex-wrap items-end gap-4 border-y border-line bg-paper-raised px-5 py-4">
      <label className="grid gap-1.5 text-[12px] font-bold text-muted">
        Status
        <select
          value={status}
          onChange={(event) => navigate({ status: event.target.value })}
          className="h-10 cursor-pointer border-[1.5px] border-line bg-card px-3 text-[14px] font-medium text-ink focus:border-red focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-[12px] font-bold text-muted">
        Start date
        <input
          type="date"
          value={start}
          max={end}
          onChange={(event) => navigate({ start: event.target.value })}
          className="h-10 border-[1.5px] border-line bg-card px-3 text-[14px] font-medium text-ink focus:border-red focus:outline-none"
        />
      </label>
      <label className="grid gap-1.5 text-[12px] font-bold text-muted">
        End date
        <input
          type="date"
          value={end}
          min={start}
          max={today}
          onChange={(event) => navigate({ end: event.target.value })}
          className="h-10 border-[1.5px] border-line bg-card px-3 text-[14px] font-medium text-ink focus:border-red focus:outline-none"
        />
      </label>
      <span className="pb-2 text-[12px] text-muted">All dates use ET.</span>
    </div>
  );
}
