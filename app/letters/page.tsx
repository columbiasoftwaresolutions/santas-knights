import { redirect } from "next/navigation";

/**
 * The portal moved to `/letters-to-santa` to match the path the live Wix site
 * has ranked on for years (SEO-PARITY.md §2). This route keeps every beta link,
 * bookmark, and QR code that went out while it was `/letters` working, and
 * carries the query string so `?do=submit` still lands on the submit tab.
 *
 * Not `permanentRedirect`: the beta is still `noindex` and this is an internal
 * path that never existed publicly, so nothing should cache a 308 before
 * cutover (ROLLOUT.md).
 */
export default async function LettersRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const qs = new URLSearchParams(
    Object.entries(await searchParams).flatMap(([k, v]) =>
      v === undefined ? [] : Array.isArray(v) ? v.map((x) => [k, x] as [string, string]) : [[k, v] as [string, string]],
    ),
  ).toString();
  redirect(qs ? `/letters-to-santa?${qs}` : "/letters-to-santa");
}
