import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { JourneyPreview } from "@/components/landing/journey-preview";
import { GamificationFeatures } from "@/components/landing/gamification-features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer"; 
import { GameModes } from "@/components/landing/game-modes";

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
