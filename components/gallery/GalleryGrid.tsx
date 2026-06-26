"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

export type GalleryTile = {
  id: string;
  url: string | null;
  type: "image" | "video";
  caption: string | null;
  meta: string | null;
  alt: string;
};

/**
 * Client gallery: category filter chips + a keyboard-dismissable lightbox.
 * Images and videos both open in the overlay. Pure presentation — the data is
 * fetched server-side and passed in.
 */
export function GalleryGrid({ items }: { items: GalleryTile[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.meta && set.add(i.meta));
    return ["All", ...Array.from(set)];
  }, [items]);

  const [active, setActive] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = active === "All" ? items : items.filter((i) => i.meta === active);
  const open = items.find((i) => i.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {categories.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setActive(label)}
              className={`cursor-pointer border px-4 py-2 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors ${
                label === active
                  ? "border-red bg-red text-paper"
                  : "border-bone/25 text-bone/70 hover:text-bone"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="grid auto-rows-[190px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((item) => (
          <figure
            key={item.id}
            className="group relative cursor-zoom-in overflow-hidden bg-ink2"
            onClick={() => setOpenId(item.id)}
          >
            {item.type === "video" ? (
              <video
                src={item.url ?? undefined}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url ?? undefined}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-transparent" />
            {item.type === "video" && (
              <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-paper">
                ▶
              </span>
            )}
            {(item.caption || item.meta) && (
              <figcaption className="absolute right-5 bottom-4 left-5">
                {item.caption && (
                  <p className="font-serif text-[17px] italic text-paper">{item.caption}</p>
                )}
                {item.meta && (
                  <p className="mt-1 text-[10px] font-bold tracking-[0.13em] text-paper/60 uppercase">
                    {item.meta}
                  </p>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/90 p-5"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-6 text-[34px] leading-none text-paper/80 hover:text-paper"
          >
            ×
          </button>
          <figure className="max-h-[88vh] max-w-[1100px]" onClick={(e) => e.stopPropagation()}>
            {open.type === "video" ? (
              <video
                src={open.url ?? undefined}
                controls
                autoPlay
                className="max-h-[80vh] w-auto"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={open.url ?? undefined} alt={open.alt} className="max-h-[80vh] w-auto" />
            )}
            {open.caption && (
              <figcaption className="mt-3 text-center font-serif text-[17px] italic text-paper">
                {open.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
