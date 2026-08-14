import { redirect } from "next/navigation";

export default async function LegacyLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  redirect(`/login${params.next ? `?next=${encodeURIComponent(params.next)}` : ""}`);
}
