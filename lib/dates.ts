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
