import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { JourneyPreview } from "@/components/journey-preview";
import { GamificationFeatures } from "@/components/gamification-features";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer"; 
import { GameModes } from "@/components/game-modes";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <GameModes />
      <JourneyPreview />
      <GamificationFeatures />
      <Pricing />
      <Footer />
    </>
  );
}
