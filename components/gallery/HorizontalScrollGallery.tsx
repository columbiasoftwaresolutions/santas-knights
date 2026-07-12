"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/galleryPhotos";

const NAV_OFFSET = 72;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** One photo: reserves its exact box (aspect-ratio) so the track has full
 *  width before anything loads, shimmers while loading, then fades the image
 *  in over the skeleton. */
function GalleryFigure({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`relative h-[clamp(320px,68vh,720px)] shrink-0 ${loaded ? "" : "img-skeleton"}`}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <Image
        src={`/images/gallery/${encodeURIComponent(photo.file)}`}
        alt={`Santa's Knights community photo ${index + 1}`}
        fill
        // Height-constrained filmstrip: widths hover around ~60vw on desktop,
        // near-full-width on phones. Enough to pick a sharp srcset entry
        // without ever serving the multi-thousand-pixel originals.
        sizes="(max-width: 768px) 92vw, 60vw"
        loading={index < 3 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function shuffle(input: GalleryPhoto[]) {
  const next = [...input];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function HorizontalScrollGallery({ photos }: { photos: GalleryPhoto[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distanceRef = useRef(0);
  const rangeRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [nativeScroll, setNativeScroll] = useState(false);
  // SSR renders the given order (no hydration mismatch); we reshuffle once on
  // the client — after first paint — so each visit opens on a different photo.
  const [ordered, setOrdered] = useState(photos);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOrdered((prev) => shuffle(prev)));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePosition = () => {
      frameRef.current = null;

      if (reducedQuery.matches || distanceRef.current <= 0) {
        track.style.transform = "none";
        return;
      }

      const rect = container.getBoundingClientRect();
      const progress = clamp((NAV_OFFSET - rect.top) / rangeRef.current, 0, 1);
      track.style.transform = `translate3d(${-progress * distanceRef.current}px, 0, 0)`;
    };

    const requestPosition = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updatePosition);
      }
    };

    const updateMetrics = () => {
      const reduced = reducedQuery.matches;
      const viewportHeight = Math.max(420, window.innerHeight - NAV_OFFSET);
      const distance = Math.max(0, track.scrollWidth - window.innerWidth);
      const range = clamp(distance * 0.42, viewportHeight * 1.65, viewportHeight * 7);

      distanceRef.current = distance;
      rangeRef.current = range;
      setNativeScroll(reduced || distance === 0);
      container.style.height = reduced || distance === 0 ? "auto" : `${viewportHeight + range}px`;
      requestPosition();
    };

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(track);
    window.addEventListener("resize", updateMetrics);
    window.addEventListener("scroll", requestPosition, { passive: true });
    reducedQuery.addEventListener("change", updateMetrics);

    updateMetrics();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("scroll", requestPosition);
      reducedQuery.removeEventListener("change", updateMetrics);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-ink">
      <div
        className={
          nativeScroll
            ? "overflow-x-auto overscroll-x-contain py-8"
            : "sticky top-[72px] flex h-[calc(100vh-72px)] items-center overflow-hidden"
        }
      >
        <div
          ref={trackRef}
          className="flex gap-5 px-[max(16px,4vw)] will-change-transform motion-reduce:will-change-auto"
        >
          {ordered.map((photo, index) => (
            <GalleryFigure key={photo.file} photo={photo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
