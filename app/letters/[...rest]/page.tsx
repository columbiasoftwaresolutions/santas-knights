import { redirect } from "next/navigation";

/**
 * Companion to `app/letters/page.tsx` — catches the old sub-paths (`/letters/give`,
 * `/letters/submit`, `/letters/g`, `/letters/s`) and hands them to their
 * `/letters-to-santa/…` equivalents, which then run their own redirects onto the
 * single portal page. See SEO-PARITY.md §2.
 */
export default async function LettersSubpathRedirectPage({
  params,
}: {
  params: Promise<{ rest: string[] }>;
}) {
  const { rest } = await params;
  redirect(`/letters-to-santa/${rest.join("/")}`);
}
