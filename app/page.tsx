import { Hero } from "@/components/sections/Hero";
import { ImpactStrip } from "@/components/sections/ImpactStrip";
import { Mission } from "@/components/sections/Mission";
import { Pillars } from "@/components/sections/Pillars";
import { GladiatorsTeaser } from "@/components/sections/GladiatorsTeaser";
import { LettersToSanta } from "@/components/sections/LettersToSanta";
import { GetInvolved } from "@/components/sections/GetInvolved";
import { Press } from "@/components/sections/Press";
import { DonateBand } from "@/components/sections/DonateBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ImpactStrip />
      <Mission />
      <Pillars />
      <LettersToSanta />
      <GladiatorsTeaser />
      <GetInvolved />
      <Press />
      <DonateBand />
    </>
  );
}
