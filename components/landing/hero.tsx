"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-start space-y-8 text-left">
            <Badge
              variant="outline"
              className="rounded-full px-4 py-1 border-primary/30 text-primary"
            >
              v2.0 Artık Yayında!
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Fikirlerinizi{" "}
              <span className="text-primary underline decoration-primary/20">
                Kodlara
              </span>{" "}
              Dönüştürün
            </h1>

            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl text-pretty">
              Modern arayüz bileşenleri ile projenizi sıfırdan zirveye taşıyın.
              Geliştiriciler için optimize edilmiş, erişilebilir ve şık tasarım
              sistemi.
            </p>

            <div className="flex flex-col gap-3 min-[400px]:flex-row w-full sm:w-auto">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href="/basla">
                  Ücretsiz Başla <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link href="/demo">
                  <PlayCircle className="mr-2 h-4 w-4" /> Demoyu İzle
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-8 w-full">
              <div>
                <span className="block font-bold text-foreground">10k+</span>
                Aktif Kullanıcı
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="block font-bold text-foreground">99.9%</span>
                Çalışma Süresi
              </div>
            </div>
          </div>

          <div className="lg:ml-4">
            <div>
              <img
                src="/images/hero/landing_page_1.png"
                alt="Dashboard Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /** Notlar:
   * 1. Grid Düzeni: lg:grid-cols-2 kullanarak büyük ekranlarda içeriği ikiye böldük, mobilde otomatik olarak alt alta gelmesini sağladık.
   * 2. lg:items-center: Metin içeriği görselden kısa kalsa bile iki tarafın dikeyde birbirine göre ortalı durmasını sağlar.
   * 3. Text Balance/Pretty: Başlıkların ve paragrafların satır sonlarında daha estetik bölünmesi için Tailwind'in modern text sınıflarını kullandık.
   */
}
