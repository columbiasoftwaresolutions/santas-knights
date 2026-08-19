import { Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { ANALYTICS_ENABLED, GTM_ID } from "@/lib/analytics";
import { RouteChangeTracker } from "./RouteChangeTracker";

/**
 * The site's entire analytics surface: one Google Tag Manager container, plus
 * page views for client-side navigation. GA4 lives inside the container, not
 * here — see lib/analytics.ts for why, and ANALYTICS.md for the GTM-side setup.
 *
 * Renders nothing at all when analytics is disabled, which is the state the
 * repo ships in today: no script tag, no dataLayer, no cookies, no requests to
 * Google. Nothing starts happening until `NEXT_PUBLIC_GTM_ID` is set *and*
 * `INDEXABLE` flips at cutover.
 */
export function Analytics() {
  if (!ANALYTICS_ENABLED) return null;

  return (
    <>
      <GoogleTagManager gtmId={GTM_ID} />
      {/*
        `useSearchParams` opts its subtree out of static rendering, so without
        this boundary the tracker would drag every page in the app down to
        client-side rendering — a real cost in TTFB and SEO, paid on every
        route, for a component that renders nothing. Suspense confines it.
      */}
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}
