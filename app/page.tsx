import { Hero } from "@/components/sections/Hero";
import { ImpactStrip } from "@/components/sections/ImpactStrip";
import { Mission } from "@/components/sections/Mission";
import { Pillars } from "@/components/sections/Pillars";
import { LettersToSanta } from "@/components/sections/LettersToSanta";
import { GladiatorsTeaser } from "@/components/sections/GladiatorsTeaser";
import { Press } from "@/components/sections/Press";
import { Partners } from "@/components/sections/Partners";
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
      <Press />
      <Partners />
      <DonateBand />
    </>
  );
}
