import { Features } from "@/features/landing/components/features";
import { Footer } from "@/features/landing/components/footer";
import { Hero } from "@/features/landing/components/hero";
import { Information } from "@/features/landing/components/information";
import { Navbar } from "@/features/landing/components/navbar";

export default function HomePage() {
  return (
    <div className="bg-brand">
      <Navbar />
      <Hero />
      <Features />
      <Information />
      <Footer />
    </div>
  );
}
