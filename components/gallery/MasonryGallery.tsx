"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { GalleryPhoto } from "@/content/galleryPhotos";

const SIZES = "(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 23vw";

function shuffle(input: GalleryPhoto[]) {
  const next = [...input];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** One tile: reserves its aspect ratio up front (no reflow), shimmers while
 *  loading, fades the image in, and settles into place on scroll. */
function Tile({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo ${index + 1} full size`}
      className={cn(
        "relative mb-3 block w-full cursor-zoom-in overflow-hidden sm:mb-4 lg:mb-5",
        !loaded && "img-skeleton",
      )}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <Image
        src={`/images/gallery/${encodeURIComponent(photo.file)}`}
        alt={`Santa's Knights community photo ${index + 1}`}
        fill
        sizes={SIZES}
        loading={index < 8 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-[opacity,transform] duration-500 hover:scale-[1.03]",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
}

/** Full-size viewer: prev/next, Escape to close, click outside to close. */
function Lightbox({
  photos,
  index,
  onClose,
  onStep,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onStep: (delta: 1 | -1) => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onStep(1);
      else if (event.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-6 text-[34px] leading-none text-paper/80 transition-colors hover:text-paper"
      >
        ×
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onStep(-1);
        }}
        aria-label="Previous photo"
        className="absolute left-3 grid h-12 w-12 shrink-0 place-items-center text-[30px] text-paper/70 transition-colors hover:text-paper sm:left-6"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onStep(1);
        }}
        aria-label="Next photo"
        className="absolute right-3 grid h-12 w-12 shrink-0 place-items-center text-[30px] text-paper/70 transition-colors hover:text-paper sm:right-6"
      >
        ›
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- full-size viewer, not worth Next/Image's fixed-size optimization */}
      <img
        src={`/images/gallery/${encodeURIComponent(photo.file)}`}
        alt={`Santa's Knights community photo ${index + 1}`}
        className="max-h-[86vh] max-w-[92vw] object-contain"
        onClick={(event) => event.stopPropagation()}
      />
      <p className="absolute bottom-5 text-[13px] font-semibold tracking-[0.08em] text-paper/60">
        {index + 1} / {photos.length}
      </p>
    </div>
  );
}

export function MasonryGallery({ photos }: { photos: GalleryPhoto[] }) {
  // SSR renders the given order (no hydration mismatch); reshuffle once on the
  // client after first paint so each visit opens on a different arrangement.
  const [ordered, setOrdered] = useState(photos);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOrdered((prev) => shuffle(prev)));
    return () => cancelAnimationFrame(id);
  }, []);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const step = useCallback(
    (delta: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + ordered.length) % ordered.length;
      });
    },
    [ordered.length],
  );

  return (
    <section className="relative bg-ink">
      <div className="columns-2 gap-3 px-3 py-8 sm:columns-3 sm:gap-4 sm:px-4 sm:py-10 lg:columns-4 lg:gap-5 lg:px-[max(16px,4vw)]">
        {ordered.map((photo, index) => (
          <Tile key={photo.file} photo={photo} index={index} onOpen={() => setOpenIndex(index)} />
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          photos={ordered}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onStep={step}
        />
      )}
    </section>
  );
}
