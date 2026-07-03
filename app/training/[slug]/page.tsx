import { redirect } from "next/navigation";
import { GLADIATORS_URL } from "@/content/site";

const slugRedirects: Record<string, string> = {
  bootcamp: "gladiator-bootcamp",
  "armored-practice": "gladiator-armored-practice",
  "womens-combat": "womens-medieval-combat-fitness",
  "womens-midtown": "womens-premium-combat-midtown",
  veterans: "military-veterans-combat-training",
  fundamentals: "medieval-combat-fundamentals",
};

export default async function TrainingSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`${GLADIATORS_URL}/classes/${slugRedirects[slug] ?? slug}`);
}
