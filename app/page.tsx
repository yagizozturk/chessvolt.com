import { Faq } from "@/features/landing/components/faq";
import { Features } from "@/features/landing/components/features";
import { Footer } from "@/features/landing/components/footer";
import { Hero } from "@/features/landing/components/hero";
import { Navbar } from "@/features/landing/components/navbar";
import { PuzzleDemo } from "@/features/landing/components/puzzle-demo";
import { WhatIsVoltSection } from "@/features/landing/components/what-is-volt";

export default function HomePage() {
  return (
    <div className="bg-brand">
      <Navbar />
      <Hero />
      <Features />
      <WhatIsVoltSection />
      <PuzzleDemo />
      <Faq />
      <Footer />
    </div>
  );
}
