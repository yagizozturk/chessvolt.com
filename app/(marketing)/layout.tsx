import { Footer } from "@/features/landing/components/footer";
import { Navbar } from "@/features/landing/components/navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand min-h-svh">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
