"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative flex w-full items-center overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32"
      style={{
        background:
          "linear-gradient(135deg, rgb(26, 17, 71) 0%, rgb(45, 27, 105) 35%, rgb(61, 37, 128) 60%, rgb(45, 27, 105) 80%, rgb(26, 17, 71) 100%)",
      }}
    >
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-start space-y-6 text-left">
            <Badge
              variant="outline"
              className="rounded-full border-white/20 bg-white/10 px-4 py-1 text-xs font-medium text-white backdrop-blur-md"
            >
              v2.0 Artık Yayında!
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
                Chess{" "}
                <span className="text-primary underline decoration-white/20 underline-offset-4">
                  Improvement
                </span>{" "}
                With Games
              </h1>

              <p className="max-w-[550px] text-lg leading-relaxed text-pretty text-white/70 md:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 pt-2 min-[400px]:flex-row sm:w-auto">
              <Button variant="default" size="xl" asChild>
                <Link href="/dashboard">
                  Start Playing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/demo">
                  <PlayCircle className="mr-2 h-4 w-4" /> Demoyu İzle
                </Link>
              </Button>
            </div>

            <div className="flex w-full max-w-sm items-center gap-6 border-t border-white/10 pt-6 text-sm text-white/50">
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">10k+</span>
                <span className="text-[10px] tracking-wider uppercase">
                  Kullanıcı
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">99.9%</span>
                <span className="text-[10px] tracking-wider uppercase">
                  Uptime
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-8 flex justify-center lg:mt-0 lg:justify-end">
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[80px]" />
            <img
              src="/images/hero/landing_page_1.png"
              alt="Dashboard Preview"
              className="relative z-10 h-auto w-full max-w-[600px]"
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
