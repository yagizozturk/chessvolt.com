import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Headphones, Puzzle, Zap, MousePointer2, Type } from "lucide-react"

export function GameModes() {
  const modes = [
    {
      title: "Hızlı Eşleştirme",
      description: "Kelime ve anlamlarını zamanla yarışarak eşleştir, reflekslerini geliştir.",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      color: "bg-yellow-500/10",
    },
    {
      title: "Boşluk Doldurma",
      description: "Cümle yapısını anlamak için doğru kelimeleri yerlerine yerleştir.",
      icon: <Type className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-500/10",
    },
    {
      title: "Dinle ve Yaz",
      description: "Duyduğun cümleleri hatasız yazarak telaffuz ve dinleme yetini güçlendir.",
      icon: <Headphones className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-500/10",
    },
    {
      title: "Sürükle Bırak",
      description: "Karmaşık kelimeleri sürükleyerek doğru cümle dizilimini oluştur.",
      icon: <MousePointer2 className="h-8 w-8 text-emerald-500" />,
      color: "bg-emerald-500/10",
    },
    {
      title: "Diyalog Simülasyonu",
      description: "Yapay zeka ile gerçekçi senaryolarda karşılıklı konuşma pratiği yap.",
      icon: <MessageSquare className="h-8 w-8 text-orange-500" />,
      color: "bg-orange-500/10",
    },
    {
      title: "Zeka Bulmacaları",
      description: "Dil mantığını çözen zorlu bulmacalarla seviye atla.",
      icon: <Puzzle className="h-8 w-8 text-pink-500" />,
      color: "bg-pink-500/10",
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Sıkılmaya Vakit Yok
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
            Her seviyeye uygun farklı oyun modları ile öğrenme sürecini bir maceraya dönüştürün.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modes.map((mode, index) => (
            <Card key={index} className="border-none shadow-none bg-slate-50/50 transition-all hover:bg-slate-100/80">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className={`p-3 rounded-2xl ${mode.color}`}>
                  {mode.icon}
                </div>
                <CardTitle className="text-xl">{mode.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

{
    /** Notlar:
     * 1. Renk Paleti: Her oyun modu için farklı bir soft arka plan (bg-color/10) kullanarak görsel çeşitlilik sağladık.
     * 2. İkon Tasarımı: Lucide ikonlarını 2xl boyutunda ve yuvarlatılmış kutular (rounded-2xl) içinde kullanarak oyunsu (playful) bir hava kattık.
     * 3. Hover Efektleri: Kartlara hafif bir arka plan değişimi ekleyerek kullanıcının etkileşimde olduğunu hissettirdik.
     * 4. Düzen: Grid yapısı sayesinde 6 farklı oyun modunu ekranda dengeli bir şekilde dağıttık.
     */
}