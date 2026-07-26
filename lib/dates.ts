export const SITE_TIME_ZONE = "America/New_York";

const DATE_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const siteDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const siteDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export const siteTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export function formatSiteDate(value: string | Date): string {
  return siteDateFormatter.format(typeof value === "string" ? new Date(value) : value);
}

export function formatSiteDateTime(value: string | Date): string {
  return siteDateTimeFormatter.format(typeof value === "string" ? new Date(value) : value);
}

export function formatSiteTime(value: string | Date): string {
  return siteTimeFormatter.format(typeof value === "string" ? new Date(value) : value);
}

export function siteDateKey(value: string | Date = new Date()): string {
  const parts = DATE_PARTS.formatToParts(typeof value === "string" ? new Date(value) : value);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export function addDaysToDateKey(dateKey: string, amount: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12));
  return date.toISOString().slice(0, 10);
}

export function dateKeysBetween(start: string, end: string): string[] {
  const keys: string[] = [];
  for (let key = start; key <= end; key = addDaysToDateKey(key, 1)) keys.push(key);
  return keys;
}

/**
 * Converts midnight at the beginning of a New York calendar date to UTC.
 * The short iteration accounts for EST/EDT without hardcoding either offset.
 */
export function siteDateStartUtc(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  const wanted = Date.UTC(year, month - 1, day);
  let guess = wanted;

  for (let iteration = 0; iteration < 3; iteration += 1) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: SITE_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(guess));
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((item) => item.type === type)?.value);
    const observed = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"), part("second"));
    guess += wanted - observed;
  }

  return new Date(guess);
}

export function isDateKey(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)));
}

/* ------------------------------------------------------------------ *
 * Chart bucketing — collapse a date range into day / week / month buckets
 * so a graph never renders more than ~100 points.
 * ------------------------------------------------------------------ */

export type Grain = "day" | "week" | "month";

/** Inclusive day count between two date keys. */
export function dayCountBetween(start: string, end: string): number {
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  const a = Date.UTC(ys, ms - 1, ds);
  const b = Date.UTC(ye, me - 1, de);
  return Math.round((b - a) / 86_400_000) + 1;
}

/**
 * Pick the coarsest grain that keeps the range at or under ~100 points:
 * ≤100 days stay daily, up to ~100 weeks (≈700 days) go weekly, beyond that
 * monthly. This is the "auto" default; callers may override with a fixed grain.
 */
export function autoGrain(start: string, end: string): Grain {
  const days = dayCountBetween(start, end);
  if (days <= 100) return "day";
  if (Math.ceil(days / 7) <= 100) return "week";
  return "month";
}

/** The bucket a given day falls into, as a date key (week = its Monday). */
export function bucketKeyFor(dateKey: string, grain: Grain): string {
  if (grain === "day") return dateKey;
  if (grain === "month") return `${dateKey.slice(0, 7)}-01`;
  const d = new Date(`${dateKey}T12:00:00Z`);
  const backToMonday = (d.getUTCDay() + 6) % 7; // Sun→6, Mon→0, …, Sat→5
  d.setUTCDate(d.getUTCDate() - backToMonday);
  return d.toISOString().slice(0, 10);
}

/** Ordered, de-duplicated bucket keys spanning [start, end] at the given grain. */
export function bucketKeys(start: string, end: string, grain: Grain): string[] {
  if (grain === "day") return dateKeysBetween(start, end);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const day of dateKeysBetween(start, end)) {
    const key = bucketKeyFor(day, grain);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(key);
    }
  }
  return out;
}
