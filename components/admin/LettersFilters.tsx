"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { DateField } from "@/components/admin/DateField";
import type { Grain } from "@/lib/dates";

export type LetterStatusFilter = "all" | "fulfilled" | "active" | "inactive";
export type GrainSetting = "auto" | Grain;

const STATUS_OPTIONS: { value: LetterStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const GRAIN_WORD: Record<Grain, string> = { day: "daily", week: "weekly", month: "monthly" };

/**
 * Shared status + grain + date-range controls for the Letters admin section.
 * Every control commits a *complete* value and then navigates once (via
 * `router.replace`, so filter churn doesn't pile up in history and the page
 * doesn't scroll-jump), wrapped in a transition so the UI stays responsive
 * while the server re-queries. Both subtabs read the same params, so switching
 * between them keeps the filter. The grain control only shows on Stats.
 */
export function LettersFilters({
  section,
  status,
  grain,
  effectiveGrain,
  start,
  end,
  today,
}: {
  section: string;
  status: LetterStatusFilter;
  grain: GrainSetting;
  effectiveGrain: Grain;
  start: string;
  end: string;
  today: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(next: Partial<{ status: string; grain: string; start: string; end: string }>) {
    const params = new URLSearchParams({
      section,
      status: next.status ?? status,
      grain: next.grain ?? grain,
      start: next.start ?? start,
      end: next.end ?? end,
    });
    startTransition(() => router.replace(`/admin?${params.toString()}`, { scroll: false }));
  }

  const grainOptions = [
    { value: "auto", label: `Auto · ${GRAIN_WORD[effectiveGrain]}` },
    { value: "day", label: "Daily" },
    { value: "week", label: "Weekly" },
    { value: "month", label: "Monthly" },
  ];

  return (
    <div
      aria-busy={isPending}
      className="mt-7 flex flex-wrap items-end gap-4 border-y border-line bg-paper-raised px-5 py-4"
    >
      <Field label="Status">
        <SelectMenu
          options={STATUS_OPTIONS}
          value={status}
          onChange={(value) => navigate({ status: value })}
          ariaLabel="Filter letters by status"
          className="w-[150px]"
        />
      </Field>

      {section === "stats" && (
        <Field label="Grain">
          <SelectMenu
            options={grainOptions}
            value={grain}
            onChange={(value) => navigate({ grain: value })}
            ariaLabel="Chart time grain"
            className="w-[168px]"
          />
        </Field>
      )}

      <Field label="Start date">
        <DateField
          value={start}
          max={end}
          onCommit={(value) => navigate({ start: value })}
          ariaLabel="Start date"
        />
      </Field>

      <Field label="End date">
        <DateField
          value={end}
          min={start}
          max={today}
          onCommit={(value) => navigate({ end: value })}
          ariaLabel="End date"
        />
      </Field>

      <span className="pb-3 text-[12px] text-muted" aria-live="polite">
        {isPending ? "Updating…" : "All dates use ET."}
      </span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-[12px] font-bold text-muted">{label}</span>
      {children}
    </div>
  );
}
