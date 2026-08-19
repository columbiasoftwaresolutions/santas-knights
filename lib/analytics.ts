import { INDEXABLE } from "@/content/site";

/**
 * Analytics is GTM-first: this app never talks to GA4 directly.
 *
 * It loads exactly one Google Tag Manager container and pushes semantic events
 * onto the dataLayer. Which of those become GA4 events, Google Ads conversions,
 * or anything else is decided in the GTM UI by whoever owns marketing — no
 * deploy, no code review, no release. That is the whole reason for the indirection:
 * a marketer can add a conversion on a Tuesday without touching this repo.
 *
 * Consequence: there is no GA4 Measurement ID in this codebase, and there should
 * never be one. The only ID the app knows is the container. See ANALYTICS.md.
 *
 * ⚠️ Never push PII onto the dataLayer. No child first names, no wish text, no
 * guardian emails, no gift descriptions, no auth user IDs. Google's terms
 * prohibit sending personally identifiable data to GA4, and on this site that
 * data belongs to children — the privacy invariant in CLAUDE.md applies to the
 * dataLayer exactly as it applies to the `public_letters` view. Events carry
 * counts, slugs, and enum-ish labels only.
 */

/** The one ID the app knows. Absent → no tag loads at all, anywhere. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

/**
 * Tags stay off until the cutover commit flips `INDEXABLE` — the same single
 * switch that drives robots.txt and the sitewide robots meta tag.
 *
 * This is deliberate and it matters more than it looks. The plan (ANALYTICS.md)
 * is to put the *same* container on the live Wix site now, so a real
 * pre-cutover baseline accumulates in one GA4 property. If the Vercel beta also
 * fired into that property, every QA click, every Playwright run, and every
 * internal review would be indistinguishable from real traffic — and the
 * baseline the whole rollout is measured against would be fiction.
 *
 * `NEXT_PUBLIC_ANALYTICS_PREVIEW=1` is the escape hatch for verifying the
 * container itself (GTM Preview mode needs the container present to connect).
 * Set it on a preview deployment, never on production.
 */
export const ANALYTICS_ENABLED =
  GTM_ID !== "" && (INDEXABLE || process.env.NEXT_PUBLIC_ANALYTICS_PREVIEW === "1");

/**
 * Every event the site is allowed to emit.
 *
 * GTM triggers are built against these exact strings, so a typo at a call site
 * is a silently dead conversion — hence a union rather than a free-form string.
 * Adding one here is half the job; the other half is a trigger in GTM.
 */
export type SiteEvent =
  /** Outbound click to PayPal/Venmo. NOT a completed donation — payment is off-site. */
  | "donate_click"
  /** A membership tier was chosen on /membership. Carries the tier label + amount. */
  | "membership_tier_select"
  /** A guardian successfully submitted a letter. Carries no letter content. */
  | "letter_submit"
  /** A donor claimed a letter to gift. Carries no child details. */
  | "gift_claim"
  /** Volunteer application submitted on /contact#volunteer. */
  | "volunteer_apply"
  /** Contact form submitted. Carries the `reason` enum only, never the message. */
  | "contact_submit"
  /** Newsletter signup. Never carries the email address. */
  | "newsletter_signup"
  /** Any outbound click to gladiators.nyc (booking, shop, armory). */
  | "gladiators_outbound";

/** dataLayer values must stay primitive — GTM variables can't read nested objects reliably. */
type EventParams = Record<string, string | number | boolean>;

/**
 * Push a site event onto the dataLayer.
 *
 * No-ops when analytics is disabled, so call sites never need their own guard
 * and local/beta development stays silent by default.
 */
export function track(event: SiteEvent, params: EventParams = {}): void {
  if (!ANALYTICS_ENABLED) return;
  if (typeof window === "undefined") return;

  // Written directly rather than via `sendGTMEvent` so a call that lands before
  // the container script has parsed still queues instead of being dropped —
  // GTM replays whatever is already on the array when it initialises.
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
}
