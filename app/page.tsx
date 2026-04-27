import { Cta } from "@/features/landing/components/cta";
import { Features } from "@/features/landing/components/features";
import { Footer } from "@/features/landing/components/footer";
import { Hero } from "@/features/landing/components/hero";
import { Navbar } from "@/features/landing/components/navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Cta />
      <Footer />
    </div>
  );
}
