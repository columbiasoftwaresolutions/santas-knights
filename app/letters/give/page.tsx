import { permanentRedirect } from "next/navigation";

/**
 * The adopt/submit experience now lives on the single `/letters` page. This
 * route is kept so old links and bookmarks land there (preserving the submit
 * deep-link).
 */
export default async function LettersGiveRedirect({
  searchParams,
}: {
  searchParams: Promise<{ do?: string }>;
}) {
  const params = await searchParams;
  permanentRedirect(params.do === "submit" ? "/letters?do=submit" : "/letters");
}
