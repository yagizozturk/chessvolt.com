import { Navbar } from "@/features/landing/components/navbar";
import { Hero } from "@/features/landing/components/hero";
import { Features } from "@/features/landing/components/features";
import { ChallengePreview } from "@/features/landing/components/challenge-preview";
import { GamificationFeatures } from "@/features/landing/components/gamification-features";
import { Pricing } from "@/features/landing/components/pricing";
import { Footer } from "@/features/landing/components/footer";
import { GameModes } from "@/features/landing/components/game-modes";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <GameModes />
      <ChallengePreview />
      <GamificationFeatures />
      <Pricing />
      <Footer />
    </>
  );
}
