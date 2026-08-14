import { redirect } from "next/navigation";

/**
 * The member ledger moved to `/members` to match the path the live Wix site
 * already has indexed (SEO-PARITY.md §2). This keeps every beta link and
 * bookmark that went out while it was `/account` working, query string included.
 *
 * Not `permanentRedirect`: the beta is still `noindex` and Wix serves a live
 * /members page, so nothing should cache a 308 before cutover (ROLLOUT.md).
 */
export default async function AccountRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const qs = new URLSearchParams(
    Object.entries(await searchParams).flatMap(([k, v]) =>
      v === undefined ? [] : Array.isArray(v) ? v.map((x) => [k, x] as [string, string]) : [[k, v] as [string, string]],
    ),
  ).toString();
  redirect(qs ? `/members?${qs}` : "/members");
}
