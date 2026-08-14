import { permanentRedirect } from "next/navigation";

/**
 * The adopt/submit experience now lives on the single `/letters-to-santa` page. This
 * route is kept so old links and bookmarks land there (preserving the submit
 * deep-link).
 */
export default async function LettersGiveRedirect({
  searchParams,
}: {
  searchParams: Promise<{ do?: string; demo?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.do === "submit") query.set("do", "submit");
  if (params.demo === "1") query.set("demo", "1");
  const qs = query.toString();
  permanentRedirect(qs ? `/letters-to-santa?${qs}` : "/letters-to-santa");
}
