"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section 
      className="relative w-full overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 flex items-center"
      style={{
        background: "linear-gradient(135deg, rgb(26, 17, 71) 0%, rgb(45, 27, 105) 35%, rgb(61, 37, 128) 60%, rgb(45, 27, 105) 80%, rgb(26, 17, 71) 100%)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          
          <div className="flex flex-col items-start space-y-6 text-left">
            <Badge
              variant="outline"
              className="rounded-full px-4 py-1 border-white/20 text-white bg-white/10 backdrop-blur-md text-xs font-medium"
            >
              v2.0 Artık Yayında!
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white text-balance leading-tight">
                Fikirlerinizi <span className="text-primary-foreground underline decoration-white/20 underline-offset-4">Kodlara</span> Dönüştürün
              </h1>

              <p className="max-w-[550px] text-lg text-white/70 md:text-xl text-pretty leading-relaxed">
                Modern arayüz bileşenleri ile projenizi sıfırdan zirveye taşıyın.
                Geliştiriciler için optimize edilmiş, erişilebilir ve şık tasarım sistemi.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-[400px]:flex-row w-full sm:w-auto pt-2">
              <Button size="lg" className="h-12 px-8 bg-white text-slate-900 hover:bg-white/90 font-bold" asChild>
                <Link href="/basla">
                  Ücretsiz Başla <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 border-white/20 hover:bg-white/10" asChild>
                <Link href="/demo">
                  <PlayCircle className="mr-2 h-4 w-4" /> Demoyu İzle
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/50 border-t border-white/10 pt-6 w-full max-w-sm">
              <div className="flex flex-col">
                <span className="font-bold text-white text-base">10k+</span>
                <span className="text-[10px] uppercase tracking-wider">Kullanıcı</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="font-bold text-white text-base">99.9%</span>
                <span className="text-[10px] uppercase tracking-wider">Uptime</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-500/15 rounded-full blur-[80px] pointer-events-none" />
            <img
              src="/images/hero/landing_page_1.png"
              alt="Dashboard Preview"
              className="relative z-10 w-full h-auto max-w-[600px]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

{
    /** Notes:
     * 1. Balanced Padding: "pt-32" (mobilde) ve "lg:pt-48" (masaüstü) yaparak Navbar'ı kurtardık ama abartmadık.
     * 2. Typography: Yazı boyutlarını text-6xl ve text-xl seviyesine çekerek daha okunabilir bir hiyerarşi kurduk.
     * 3. Glow Fix: Parlamayı %110 genişliğe ve blur-[80px] değerine çekerek daha odaklı ve temiz bir ışık elde ettik.
     * 4. Visual Cleanup: Sayfa sonundaki istatistiklerin (10k+, 99.9%) dizilimini daha kompakt hale getirdik.
     */
}