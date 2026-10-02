import DiamondStats from "@/components/diamond-stats/diamond-stats";
import { Curve } from "@/features/landing/components/curve";
import { Features } from "@/features/landing/components/features";
import { Footer } from "@/features/landing/components/footer";
import { Hero } from "@/features/landing/components/hero";
import { Information } from "@/features/landing/components/information";
import { Navbar } from "@/features/landing/components/navbar";
import { Rocket } from "@/features/landing/components/rocket";

export default function HomePage() {
  return (
    <div className="bg-brand">
      <Navbar />
      <Hero />
      <Curve />
      <DiamondStats />
      <Rocket />
      <Footer />
    </div>
  );
}
