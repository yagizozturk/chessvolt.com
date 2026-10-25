import { Features } from "@/features/landing/components/features";
import { Footer } from "@/features/landing/components/footer";
import { Hero } from "@/features/landing/components/hero";
import { LandingCarousel } from "@/features/landing/components/landing-carousel";
import { Navbar } from "@/features/landing/components/navbar";
import { Rocket } from "@/features/landing/components/rocket";
import { WhatIsVoltSection } from "@/features/landing/components/what-is-volt";

export default function HomePage() {
  return (
    <div className="bg-brand">
      <Navbar />
      <Hero />
      <Features />
      <WhatIsVoltSection />
      <LandingCarousel />
      <Footer />
    </div>
  );
}
