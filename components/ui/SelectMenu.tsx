"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

/**
 * A small, self-contained dropdown built on the WAI-ARIA combobox/listbox
 * pattern (focus stays on the trigger; the active option is tracked with
 * `aria-activedescendant`). It opens and closes with a soft scale/fade, supports
 * full keyboard control (arrows, Home/End, type-ahead, Enter/Escape), closes on
 * outside-click, and keeps the highlighted row scrolled into view.
 *
 * Two trigger treatments, mirroring the two form treatments in the redesign
 * (see design-demos/REDESIGN-SYSTEM.md): `boxed` sits flush with the site's
 * square, filled text inputs; `ruled` is the `.form-paper` field — no box, just
 * the hairline the field is written on. Pick the one the fields beside it use.
 */
export function SelectMenu({
  options,
  value,
  onChange,
  placeholder = "Select",
  ariaLabel,
  id,
  invalid = false,
  variant = "boxed",
  className,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  invalid?: boolean;
  /** `ruled` matches `.form-paper`'s underlined fields; `boxed` the filled ones. */
  variant?: "boxed" | "ruled";
  className?: string;
}) {
  const reactId = useId();
  const baseId = id ?? reactId;
  const listId = `${baseId}-list`;

  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [active, setActive] = useState(selectedIndex >= 0 ? selectedIndex : 0);

  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef<{ str: string; t: number | null }>({ str: "", t: null });

  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const close = useCallback((focusBtn = true) => {
    setOpen(false);
    if (focusBtn) requestAnimationFrame(() => btnRef.current?.focus());
  }, []);

  const openMenu = useCallback(() => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [selectedIndex]);

  // Close when clicking anywhere outside the control.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the highlighted option visible as it moves.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const commit = useCallback(
    (idx: number) => {
      const opt = options[idx];
      if (opt) {
        onChange(opt.value);
        close();
      }
    },
    [options, onChange, close],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
          e.preventDefault();
          openMenu();
        }
        return;
      }
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "ArrowDown":
          e.preventDefault();
          setActive((i) => Math.min(options.length - 1, i + 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActive((i) => Math.max(0, i - 1));
          break;
        case "Home":
          e.preventDefault();
          setActive(0);
          break;
        case "End":
          e.preventDefault();
          setActive(options.length - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          commit(active);
          break;
        case "Tab":
          setOpen(false);
          break;
        default:
          if (e.key.length === 1) {
            const ta = typeahead.current;
            ta.str += e.key.toLowerCase();
            if (ta.t) window.clearTimeout(ta.t);
            ta.t = window.setTimeout(() => (ta.str = ""), 700);
            const found = options.findIndex((o) => o.label.toLowerCase().startsWith(ta.str));
            if (found >= 0) setActive(found);
          }
      }
    },
    [open, options, active, commit, close, openMenu],
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={btnRef}
        type="button"
        id={baseId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${baseId}-opt-${active}` : undefined}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 text-left transition-colors",
          "focus:outline-2 focus:outline-offset-1 focus:outline-red",
          variant === "ruled"
            ? "border-0 border-b-[1.5px] bg-transparent px-0 py-[9px] text-[17px]"
            : "border-[1.5px] bg-paper px-[18px] py-[13px] text-[15.5px]",
          open
            ? "border-red"
            : invalid
              ? "border-red/70"
              : variant === "ruled"
                ? "border-line-strong hover:border-muted/70"
                : "border-line hover:border-muted/60",
        )}
      >
        <span className={cn("truncate", selected ? "text-ink" : "text-muted/70")}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={cn(
            "h-4 w-4 flex-none text-muted transition-colors duration-200",
            open && "rotate-180",
          )}
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={cn(
          "absolute inset-x-0 z-50 mt-1.5 max-h-[264px] origin-top overflow-y-auto border-[1.5px] border-ink bg-paper-raised py-1",
          "shadow-[0_18px_44px_-20px_rgba(15,17,19,0.55)]",
          "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0",
        )}
      >
        {options.map((o, i) => {
          const isSelected = o.value === value;
          const isActive = i === active;
          return (
            <li
              key={o.value}
              id={`${baseId}-opt-${i}`}
              data-idx={i}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setActive(i)}
              onClick={() => commit(i)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 px-[18px] py-[9px] text-[15px]",
                isActive ? "bg-red text-white" : "text-ink",
              )}
            >
              <span className="truncate">{o.label}</span>
              {isSelected && (
                <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 flex-none">
                  <path
                    d="M4 10.5 8 14.5 16 5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
