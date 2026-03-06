import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, BookOpen, Trophy, Lock } from "lucide-react"
import Link from "next/link"

export function JourneyPreview() {
  const levels = [
    { id: 1, type: "complete", icon: <Check className="h-6 w-6" />, offset: "0" },
    { id: 2, type: "current", icon: <BookOpen className="h-6 w-6" />, offset: "40px", label: "START" },
    { id: 3, type: "locked", icon: <Star className="h-6 w-6" />, offset: "70px" },
    { id: 4, type: "locked", icon: <BookOpen className="h-6 w-6" />, offset: "40px" },
    { id: 5, type: "locked", icon: <Lock className="h-6 w-6" />, offset: "-10px" },
    { id: 6, type: "locked", icon: <Trophy className="h-6 w-6" />, offset: "-50px" },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Eğitim Yolculuğun</h2>
            <p className="text-muted-foreground mt-2">Kaldığın yerden devam et ve yeni rozetler kazan.</p>
          </div>

          <div className="relative flex flex-col items-center gap-8 w-full max-w-[400px]">
            {levels.map((level) => (
              <div 
                key={level.id}
                className="relative transition-transform hover:scale-110"
                style={{ transform: `translateX(${level.offset})` }}
              >
                {/* Mevcut Seviye Etiketi */}
                {level.type === "current" && (
                  <Badge className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 animate-bounce">
                    {level.label}
                  </Badge>
                )}

                {/* Seviye Butonu */}
                <Button
                  size="icon"
                  className={`h-16 w-16 rounded-full border-b-4 active:border-b-0 transition-all ${
                    level.type === "complete" ? "bg-orange-400 hover:bg-orange-500 border-orange-700" :
                    level.type === "current" ? "bg-orange-500 hover:bg-orange-600 border-orange-800 shadow-xl" :
                    "bg-slate-200 text-slate-400 border-slate-400 pointer-events-none"
                  }`}
                >
                  {level.icon}
                </Button>
              </div>
            ))}

            {/* Arka Planda Yol Çizgisi (Opsiyonel) */}
            <div className="absolute top-0 bottom-0 w-1 bg-slate-100 -z-10 rounded-full" />
          </div>

          <div className="mt-16">
            <Button variant="outline" size="lg" asChild>
              <Link href="/journey">Tam Haritayı Gör</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

{
    /** Notlar:
     * 1. Dinamik Offset: "offset" değerleri ile Duolingo'nun o meşhur sağa-sola kavisli yapısını simüle ettik.
     * 2. Görsel Hiyerarşi: Tamamlanan ve aktif olan seviyeler için turuncu tonlarını, kilitli olanlar için gri tonlarını kullandık.
     * 3. Buton Tasarımı: "border-b-4" kullanarak Duolingo'nun o meşhur 3D/kabartmalı buton efektini verdik.
     * 4. Etkileşim: Aktif seviye (current) için "animate-bounce" ile dikkat çeken bir label ekledik.
     */
}