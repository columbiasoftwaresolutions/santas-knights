"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { GalleryPhoto } from "@/content/galleryPhotos";

const NAV_OFFSET = 72;
// Below this we drop the horizontal scroll experience for a clean vertical
// column of full-width photos.
const MOBILE_QUERY = "(max-width: 767px)";

type Mode = "stack" | "native" | "jack";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** One photo. `vertical` (mobile column) fills the row width and derives its
 *  height from the aspect ratio; otherwise it's a fixed-height filmstrip cell
 *  whose width comes from the aspect ratio. Either way the box is reserved
 *  before load (no reflow), shimmers while loading, then fades the image in. */
function GalleryFigure({
  photo,
  index,
  vertical,
}: {
  photo: GalleryPhoto;
  index: number;
  vertical?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={cn(
        "relative shrink-0",
        vertical ? "w-full" : "h-[clamp(320px,68vh,720px)]",
        !loaded && "img-skeleton",
      )}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <Image
        src={`/images/gallery/${encodeURIComponent(photo.file)}`}
        alt={`Santa's Knights community photo ${index + 1}`}
        fill
        // Vertical: full-width on phones. Horizontal: widths hover around ~60vw
        // on desktop. Either way, small optimized srcset — never the originals.
        sizes={vertical ? "94vw" : "(max-width: 768px) 92vw, 60vw"}
        loading={index < 3 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
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
  // "native" (plain horizontal scroll) is the SSR/first-paint default: it needs
  // no measurement and upgrades cleanly to "jack" (desktop scroll-jack) or
  // "stack" (mobile column) once we can read the viewport.
  const [mode, setMode] = useState<Mode>("native");
  // SSR renders the given order (no hydration mismatch); we reshuffle once on
  // the client — after first paint — so each visit opens on a different photo.
  const [ordered, setOrdered] = useState(photos);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOrdered((prev) => shuffle(prev)));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia(MOBILE_QUERY);

    const updatePosition = () => {
      frameRef.current = null;
      const track = trackRef.current;
      if (!track) return;

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
      // Mobile → a plain vertical column; no scroll-jack, no reserved height.
      if (mobileQuery.matches) {
        setMode("stack");
        container.style.height = "auto";
        distanceRef.current = 0;
        return;
      }

      const track = trackRef.current;
      if (!track) {
        // Returning from the mobile column: mount the horizontal track first,
        // then re-measure next frame to pick native vs jack.
        setMode("native");
        container.style.height = "auto";
        window.requestAnimationFrame(updateMetrics);
        return;
      }

      const reduced = reducedQuery.matches;
      const viewportHeight = Math.max(420, window.innerHeight - NAV_OFFSET);
      const distance = Math.max(0, track.scrollWidth - window.innerWidth);
      const range = clamp(distance * 0.42, viewportHeight * 1.65, viewportHeight * 7);

      distanceRef.current = distance;
      rangeRef.current = range;
      const jack = !reduced && distance > 0;
      setMode(jack ? "jack" : "native");
      container.style.height = jack ? `${viewportHeight + range}px` : "auto";
      requestPosition();
    };

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(container);
    window.addEventListener("resize", updateMetrics);
    window.addEventListener("scroll", requestPosition, { passive: true });
    reducedQuery.addEventListener("change", updateMetrics);
    mobileQuery.addEventListener("change", updateMetrics);

    updateMetrics();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("scroll", requestPosition);
      reducedQuery.removeEventListener("change", updateMetrics);
      mobileQuery.removeEventListener("change", updateMetrics);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-ink">
      {mode === "stack" ? (
        <div className="flex flex-col gap-3 px-3 py-3">
          {ordered.map((photo, index) => (
            <GalleryFigure key={photo.file} photo={photo} index={index} vertical />
          ))}
        </div>
      ) : (
        <div
          className={
            mode === "native"
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
      )}
    </section>
  );
}
