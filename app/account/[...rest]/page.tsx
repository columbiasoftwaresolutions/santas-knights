import { redirect } from "next/navigation";

/**
 * Companion to `app/account/page.tsx` — catches the old sub-paths
 * (`/account/login`, `/account/register`) and hands them to their `/members/…`
 * equivalents, which then run their own redirects onto `/login` and `/signup`.
 * The query string carries through so `?next=` survives the hop.
 */
export default async function AccountSubpathRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ rest: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ rest }, sp] = await Promise.all([params, searchParams]);
  const qs = new URLSearchParams(
    Object.entries(sp).flatMap(([k, v]) =>
      v === undefined ? [] : Array.isArray(v) ? v.map((x) => [k, x] as [string, string]) : [[k, v] as [string, string]],
    ),
  ).toString();
  const path = `/members/${rest.join("/")}`;
  redirect(qs ? `${path}?${qs}` : path);
}
