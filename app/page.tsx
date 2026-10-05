import { DiamondStats } from "@/features/landing/components/diamond-stats";
import { Features } from "@/features/landing/components/features";
import { Footer } from "@/features/landing/components/footer";
import { Hero } from "@/features/landing/components/hero";
import { Information } from "@/features/landing/components/information";
import { Navbar } from "@/features/landing/components/navbar";
import { LandingCarousel } from "@/features/landing/components/landing-carousel";
import { Rocket } from "@/features/landing/components/rocket";

export default function HomePage() {
  return (
    <div className="bg-brand">
      <Navbar />
      <Hero />
      <Features />
      <DiamondStats />
      <Rocket />
      <LandingCarousel />
      <Footer />
    </div>
  );
}
