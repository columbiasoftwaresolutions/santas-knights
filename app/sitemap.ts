import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/**
 * The public sitemap. Wix generated one automatically and Search Console has it
 * submitted, so this URL has to keep resolving through cutover (SEO-PARITY.md §4).
 *
 * Only canonical, publicly-crawlable 200s belong here. Deliberately absent:
 *
 * - **Redirects** — `/letters`, `/account`, `/about`, `/sponsors`,
 *   `/get-involved`, `/training`. A sitemap listing redirects tells Google the
 *   wrong URL is canonical.
 * - **Auth-gated pages** — `/members` bounces anonymous visitors (and crawlers)
 *   to `/login`, so it has no indexable content of its own. This is a live
 *   difference from Wix, which had an indexed `/members` page.
 * - **`/login`, `/signup`, `/admin/*`** — nothing to rank.
 *
 * `SITE_URL` is the host these resolve against; it is currently the apex while
 * the live canonical is `www`. That is the one decision to settle before
 * cutover (SEO-PARITY.md §4) — fix it there and every URL here follows.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    // The seasonal peak page — the pile changes as letters arrive and get claimed.
    { path: "/letters-to-santa", changeFrequency: "daily", priority: 0.9 },
    { path: "/donate", changeFrequency: "monthly", priority: 0.9 },
    { path: "/santas-knights", changeFrequency: "monthly", priority: 0.8 },
    { path: "/membership", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency,
    priority,
  }));
}
