import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/content/site";

/**
 * robots.txt, modelled on the one Wix generates for the live site (a copy is in
 * `seo-baseline/robots.txt`). The deliberate choices Wix's file encodes — block
 * PetalBot outright, slow down dotbot and AhrefsBot, publish the sitemap — are
 * carried over. Its Wix-implementation rules are not:
 *
 * - `Disallow: *?lightbox=` — a Wix gallery URL param; no equivalent here.
 * - The AdsBot-Google block on `/_partials*` and `/pro-gallery-webapp/*` — Wix
 *   internals. Worth knowing that AdsBot ignores `User-agent: *` entirely and
 *   only obeys AdsBot-specific rules, so having no AdsBot section means ad
 *   landing pages are freely crawlable, which is what we want.
 *
 * Until `INDEXABLE` flips, this serves a blanket disallow — the beta must never
 * compete with the live Wix site in search (ROLLOUT.md).
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin console. Not secret — it's auth-gated — but there is
        // nothing to crawl and no reason to spend crawl budget on it.
        disallow: "/admin",
      },
      // Kept from the Wix file: PetalBot is blocked outright.
      { userAgent: "PetalBot", disallow: "/" },
      // Kept from the Wix file: throttle the SEO crawlers rather than ban them.
      { userAgent: ["dotbot", "AhrefsBot"], crawlDelay: 10 },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
