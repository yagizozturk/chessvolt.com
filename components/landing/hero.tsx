import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PlayCircle } from "lucide-react";
import { MotionWrapper } from "./hero-content"; // Yukarıdaki client component

export function Hero() {
  return (
    <section className="bg-background relative w-full overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1A1147] via-[#2D1B69] via-[#3D2580] via-60% to-[#1A1147]" />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <MotionWrapper x={-40}>
            <div className="flex flex-col items-start space-y-8 text-left">
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 text-primary rounded-full px-4 py-1 backdrop-blur-md"
              >
                v2.0 Artık Yayında!
              </Badge>

              <div className="space-y-6 text-white">
                <h1 className="text-4xl leading-tight font-extrabold tracking-tighter sm:text-6xl lg:text-7xl/none">
                  Chess{" "}
                  <span className="text-primary underline decoration-white/20 underline-offset-8">
                    Improvement
                  </span>{" "}
                  <br /> With Games
                </h1>
                <p className="text-muted-foreground max-w-[600px] text-lg leading-relaxed md:text-xl">
                  Satranç stratejilerinizi oyunun içinde kalarak geliştirin.
                  Gerçek zamanlı analizlerle hatalarınızı fırsata çevirin.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  variant="default"
                  size="lg"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/journey/legend_games">
                    Start Playing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="vghost"
                  size="lg"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/demo">
                    <PlayCircle className="mr-2 h-4 w-4" /> Demoyu İzle
                  </Link>
                </Button>
              </div>

              <dl className="flex items-center gap-8 border-t border-white/10 pt-8">
                <div>
                  <dt className="text-2xl font-bold text-white">10k+</dt>
                  <dd className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                    Kullanıcı
                  </dd>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <dt className="text-2xl font-bold text-white">99.9%</dt>
                  <dd className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                    Uptime
                  </dd>
                </div>
              </dl>
            </div>
          </MotionWrapper>

          <div className="relative mt-8 flex justify-center lg:mt-0 lg:justify-end">
            <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />

            <MotionWrapper delay={0.3} float={true}>
              <Image
                src="/images/hero/landing_page_1.png"
                alt="Chessvolt Dashboard Preview"
                width={600}
                height={400}
                priority
                className="relative z-10 h-auto w-full max-w-[600px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              />
            </MotionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
