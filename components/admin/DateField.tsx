"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { addDaysToDateKey } from "@/lib/dates";
import { cn } from "@/lib/cn";

/**
 * A date input that adapts to the device:
 *  - Touch / coarse-pointer (phones, tablets) → native `<input type="date">`,
 *    so iOS/Android show their OS-level date picker.
 *  - Desktop → a custom calendar popover matching the admin's square, warm UI.
 *
 * Either way it only ever calls `onCommit` with a *complete, in-range* date —
 * never a half-typed value — so the parent can navigate on commit without the
 * per-keystroke thrash the old native inputs caused.
 */
export function DateField({
  value,
  min,
  max,
  onCommit,
  ariaLabel,
}: {
  value: string;
  min?: string;
  max?: string;
  onCommit: (value: string) => void;
  ariaLabel: string;
}) {
  const touch = useSyncExternalStore(
    subscribeToCoarsePointer,
    coarsePointerSnapshot,
    () => false,
  );

  // Native path for touch devices (renders the OS picker).
  if (touch) {
    return (
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        aria-label={ariaLabel}
        onChange={(event) => {
          const next = event.target.value;
          if (next && next !== value) onCommit(next);
        }}
        className="h-11 w-[168px] border-[1.5px] border-line bg-card px-3 text-[14px] font-medium text-ink focus:border-red focus:outline-none"
      />
    );
  }

  // Desktop custom calendar — also the SSR / pre-mount baseline, so the trigger
  // never flips shape on desktop (only touch devices swap to the native input).
  return <CalendarField value={value} min={min} max={max} onCommit={onCommit} ariaLabel={ariaLabel} />;
}

const COARSE_POINTER_QUERY = "(pointer: coarse)";

function subscribeToCoarsePointer(onChange: () => void): () => void {
  const query = window.matchMedia(COARSE_POINTER_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function coarsePointerSnapshot(): boolean {
  return window.matchMedia(COARSE_POINTER_QUERY).matches;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function keyOf(y: number, month1: number, day: number) {
  return `${y}-${pad(month1)}-${pad(day)}`;
}
function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return { y, m, d };
}
function daysInMonth(y: number, month1: number) {
  return new Date(Date.UTC(y, month1, 0)).getUTCDate();
}
function firstWeekday(y: number, month1: number) {
  return new Date(Date.UTC(y, month1 - 1, 1)).getUTCDay(); // 0 = Sunday
}
function formatTrigger(key: string) {
  if (!key) return "Select date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${key}T12:00:00Z`));
}

function CalendarField({
  value,
  min,
  max,
  onCommit,
  ariaLabel,
}: {
  value: string;
  min?: string;
  max?: string;
  onCommit: (value: string) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const anchor = value || max || min || keyOf(2026, 1, 1);
  const [view, setView] = useState(() => {
    const { y, m } = parseKey(anchor);
    return { y, m };
  });
  const [focusKey, setFocusKey] = useState(anchor);

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const outOfRange = (key: string) => (min && key < min) || (max && key > max);

  function openCal() {
    const seed = value || max || anchor;
    const { y, m } = parseKey(seed);
    setView({ y, m });
    setFocusKey(seed);
    setOpen(true);
  }

  // Close on outside-click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keep DOM focus on the active day as it moves.
  useEffect(() => {
    if (!open) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-key="${focusKey}"]`)?.focus();
  }, [open, focusKey, view.y, view.m]);

  function moveFocus(deltaDays: number) {
    const next = addDaysToDateKey(focusKey, deltaDays);
    if (outOfRange(next)) return;
    const { y, m } = parseKey(next);
    if (y !== view.y || m !== view.m) setView({ y, m });
    setFocusKey(next);
  }

  function select(key: string) {
    if (outOfRange(key)) return;
    onCommit(key);
    setOpen(false);
  }

  function onGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowLeft": event.preventDefault(); moveFocus(-1); break;
      case "ArrowRight": event.preventDefault(); moveFocus(1); break;
      case "ArrowUp": event.preventDefault(); moveFocus(-7); break;
      case "ArrowDown": event.preventDefault(); moveFocus(7); break;
      case "Enter":
      case " ": event.preventDefault(); select(focusKey); break;
    }
  }

  const grid = useMemo(() => {
    const blanks = firstWeekday(view.y, view.m);
    const total = daysInMonth(view.y, view.m);
    const cells: (string | null)[] = [];
    for (let i = 0; i < blanks; i += 1) cells.push(null);
    for (let day = 1; day <= total; day += 1) cells.push(keyOf(view.y, view.m, day));
    return cells;
  }, [view.y, view.m]);

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${keyOf(view.y, view.m, 1)}T12:00:00Z`));

  const lastOfPrev = addDaysToDateKey(keyOf(view.y, view.m, 1), -1);
  const firstOfNext = addDaysToDateKey(keyOf(view.y, view.m, daysInMonth(view.y, view.m)), 1);
  const canPrev = !(min && lastOfPrev < min);
  const canNext = !(max && firstOfNext > max);

  function shiftMonth(delta: number) {
    setView((v) => {
      const m = v.m + delta;
      if (m < 1) return { y: v.y - 1, m: 12 };
      if (m > 12) return { y: v.y + 1, m: 1 };
      return { y: v.y, m };
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openCal())}
        className={cn(
          "flex h-11 w-[168px] items-center justify-between gap-2 border-[1.5px] bg-card px-3 text-left text-[14px] font-medium transition-colors",
          "focus:outline-none",
          open ? "border-red" : "border-line hover:border-muted/60",
          value ? "text-ink" : "text-muted/70",
        )}
      >
        <span className="truncate">{formatTrigger(value)}</span>
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 flex-none text-muted">
          <rect x="3" y="4.5" width="14" height="12.5" rx="0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 8h14M7 3v3M13 3v3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={ariaLabel}
          className="absolute left-0 z-50 mt-1.5 w-[264px] border-[1.5px] border-ink bg-paper-raised p-3 shadow-[0_18px_44px_-20px_rgba(15,17,19,0.55)]"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              disabled={!canPrev}
              onClick={() => shiftMonth(-1)}
              className="grid h-8 w-8 place-items-center border border-line text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="text-[13.5px] font-extrabold text-ink">{monthLabel}</span>
            <button
              type="button"
              aria-label="Next month"
              disabled={!canNext}
              onClick={() => shiftMonth(1)}
              className="grid h-8 w-8 place-items-center border border-line text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((day) => (
              <div key={day} className="grid h-7 place-items-center text-[11px] font-bold uppercase tracking-[0.04em] text-muted">
                {day}
              </div>
            ))}
          </div>

          <div ref={gridRef} role="grid" onKeyDown={onGridKeyDown} className="mt-0.5 grid grid-cols-7 gap-0.5">
            {grid.map((key, i) =>
              key === null ? (
                <div key={`blank-${i}`} className="h-8" aria-hidden />
              ) : (
                (() => {
                  const disabled = Boolean(outOfRange(key));
                  const selected = key === value;
                  const isFocusable = key === focusKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      data-key={key}
                      role="gridcell"
                      aria-label={formatTrigger(key)}
                      aria-selected={selected}
                      disabled={disabled}
                      tabIndex={isFocusable ? 0 : -1}
                      onClick={() => select(key)}
                      className={cn(
                        "grid h-8 place-items-center text-[13px] font-medium transition-colors focus:outline-none",
                        disabled && "cursor-not-allowed text-muted/30",
                        !disabled && !selected && "text-ink hover:bg-red/10 focus:bg-red/10",
                        selected && "bg-red font-bold text-white",
                      )}
                    >
                      {parseKey(key).d}
                    </button>
                  );
                })()
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
