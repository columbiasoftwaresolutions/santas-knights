import { redirect } from "next/navigation";

export default async function LegacyRegisterRedirect({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  redirect(`/signup${params.next ? `?next=${encodeURIComponent(params.next)}` : ""}`);
}
