"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/galleryPhotos";

const SIZES = "(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw";
const SRC = (photo: GalleryPhoto) => `/images/gallery/${encodeURIComponent(photo.file)}`;

/** How far a drag has to travel before it counts as "next photo". */
const SWIPE_PX = 70;
/** Length of the slide-out before the next photo is swapped in. */
const STEP_MS = 140;

function shuffle(input: GalleryPhoto[]) {
  const next = [...input];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** One tile. Reserves its aspect ratio up front so the columns never reflow. */
function Tile({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo ${index + 1} full size`}
      className="tile"
      data-reveal
      // Only the first screenful staggers; past that the delay would read as lag.
      style={{
        aspectRatio: `${photo.width} / ${photo.height}`,
        transitionDelay: `${Math.min(index, 7) * 45}ms`,
      }}
    >
      <Image
        src={SRC(photo)}
        alt={`Santa's Knights community photo ${index + 1}`}
        fill
        sizes={SIZES}
        loading={index < 8 ? "eager" : "lazy"}
      />
    </button>
  );
}

type Motion = { x: number; opacity: number; instant: boolean };
const AT_REST: Motion = { x: 0, opacity: 1, instant: false };

/** Full-size viewer: click, arrow keys, Escape, and drag/swipe between photos. */
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
  const closeRef = useRef<HTMLButtonElement>(null);
  const [motion, setMotion] = useState<Motion>(AT_REST);
  // Held in a ref, not state: the drag handlers read it every pointermove.
  const dragFrom = useRef<number | null>(null);
  const stepping = useRef<number | null>(null);

  /** Slide the current photo out, swap, and let the CSS transition slide the
   *  next one back in from the same side. */
  const step = useCallback(
    (delta: 1 | -1) => {
      if (stepping.current !== null) return;
      setMotion({ x: delta * 40, opacity: 0, instant: false });
      stepping.current = window.setTimeout(() => {
        stepping.current = null;
        onStep(delta);
        setMotion(AT_REST);
      }, STEP_MS);
    },
    [onStep],
  );

  // Lock the page behind the viewer, and hand focus to it and back.
  useEffect(() => {
    const restoreTo = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (stepping.current !== null) window.clearTimeout(stepping.current);
      restoreTo?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      // Keep focus inside the viewer while it's open.
      else if (event.key === "Tab") event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  const photo = photos[index];

  const endDrag = (event: React.PointerEvent<HTMLImageElement>) => {
    if (dragFrom.current === null) return;
    const travelled = event.clientX - dragFrom.current;
    dragFrom.current = null;
    if (Math.abs(travelled) > SWIPE_PX) step(travelled < 0 ? 1 : -1);
    else setMotion(AT_REST);
  };

  return (
    <div
      className={`lightbox${motion.instant ? " is-drag" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- full-size viewer; next/image's fixed sizing buys nothing here */}
      <img
        src={SRC(photo)}
        alt={`Santa's Knights community photo ${index + 1}`}
        draggable={false}
        style={{
          transform: motion.x ? `translateX(${motion.x}px)` : undefined,
          opacity: motion.opacity,
        }}
        onPointerDown={(event) => {
          dragFrom.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
          setMotion({ x: 0, opacity: 1, instant: true });
        }}
        onPointerMove={(event) => {
          if (dragFrom.current === null) return;
          const travelled = event.clientX - dragFrom.current;
          setMotion({
            x: travelled,
            opacity: Math.max(0.35, 1 - Math.abs(travelled) / 460),
            instant: true,
          });
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="lb-btn lb-close"
      >
        ×
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          step(-1);
        }}
        aria-label="Previous photo"
        className="lb-btn lb-prev"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          step(1);
        }}
        aria-label="Next photo"
        className="lb-btn lb-next"
      >
        ›
      </button>
      <p className="lb-count">
        {index + 1} / {photos.length}
      </p>
      <p className="lb-hint">Drag · Esc to close</p>
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
      setOpenIndex((current) =>
        current === null ? current : (current + delta + ordered.length) % ordered.length,
      );
    },
    [ordered.length],
  );

  return (
    <>
      <div className="masonry">
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
    </>
  );
}
