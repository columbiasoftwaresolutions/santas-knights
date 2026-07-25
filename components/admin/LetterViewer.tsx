"use client";

import { useEffect, useState } from "react";

/** Trigger + popup for a signed handwritten-letter photo. Renders nothing
 *  when there's no image (callers only mount this when one exists). */
export function LetterViewer({ imageUrl }: { imageUrl: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer font-bold text-red underline underline-offset-2 hover:text-red-deep"
      >
        View letter
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 p-5"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Handwritten letter"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-5 right-6 text-[34px] leading-none text-paper/80 transition-colors hover:text-paper"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase URL, not a static asset */}
          <img
            src={imageUrl}
            alt="Handwritten letter"
            className="max-h-[86vh] max-w-[92vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
