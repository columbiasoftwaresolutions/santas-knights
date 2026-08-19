"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Emits a `page_view` dataLayer event on client-side navigation.
 *
 * Without this the site records exactly one page view per visit. The App Router
 * swaps content without a document load, so GTM's container-load trigger fires
 * once — on whatever URL the visitor happened to land on — and every route
 * after that is invisible. A visitor going home → /letters-to-santa → /donate
 * would read as a single-page bounce on the homepage.
 *
 * GA4's "page changes based on browser history events" setting is the
 * off-the-shelf alternative, but it reads `document.title` at history-change
 * time, which on the App Router is before React has committed the new
 * `<title>` — so page views land under the *previous* page's name. Pushing the
 * event ourselves lets us wait for the title and send an accurate one.
 */
export function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // GTM's own container-load trigger already covers the landing page; pushing
  // on mount as well would double-count it and halve the measured bounce rate.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Next applies the new route's <title> in a separate commit from this
    // effect, so reading it synchronously here yields the *old* page's title.
    // One frame is enough for the document head to catch up.
    const frame = requestAnimationFrame(() => {
      const query = searchParams.toString();
      const path = query ? `${pathname}?${query}` : pathname;

      const w = window as Window & { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer ?? [];
      w.dataLayer.push({
        event: "page_view",
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  return null;
}
