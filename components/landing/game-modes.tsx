import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Headphones,
  Puzzle,
  Zap,
  MousePointer2,
  Type,
  Sparkles,
} from "lucide-react";

export function GameModes() {
  const modes = [
    {
      title: "Hızlı Eşleştirme",
      description:
        "Kelime ve anlamlarını zamanla yarışarak eşleştir, reflekslerini geliştir.",
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-500/15",
      accent: "border-l-4 border-l-amber-500",
    },
    {
      title: "Boşluk Doldurma",
      description:
        "Cümle yapısını anlamak için doğru kelimeleri yerlerine yerleştir.",
      icon: <Type className="h-8 w-8 text-sky-500" />,
      color: "bg-sky-500/15",
      accent: "border-l-4 border-l-sky-500",
    },
    {
      title: "Dinle ve Yaz",
      description:
        "Duyduğun cümleleri hatasız yazarak telaffuz ve dinleme yetini güçlendir.",
      icon: <Headphones className="h-8 w-8 text-violet-500" />,
      color: "bg-violet-500/15",
      accent: "border-l-4 border-l-violet-500",
    },
    {
      title: "Sürükle Bırak",
      description:
        "Karmaşık kelimeleri sürükleyerek doğru cümle dizilimini oluştur.",
      icon: <MousePointer2 className="h-8 w-8 text-emerald-500" />,
      color: "bg-emerald-500/15",
      accent: "border-l-4 border-l-emerald-500",
    },
    {
      title: "Diyalog Simülasyonu",
      description:
        "Yapay zeka ile gerçekçi senaryolarda karşılıklı konuşma pratiği yap.",
      icon: <MessageSquare className="h-8 w-8 text-orange-500" />,
      color: "bg-orange-500/15",
      accent: "border-l-4 border-l-orange-500",
    },
    {
      title: "Zeka Bulmacaları",
      description: "Dil mantığını çözen zorlu bulmacalarla seviye atla.",
      icon: <Puzzle className="h-8 w-8 text-rose-500" />,
      color: "bg-rose-500/15",
      accent: "border-l-4 border-l-rose-500",
    },
  ];

  return (
    <section className="bg-secondary/40 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex gap-2 rounded-full px-6 py-2 text-base backdrop-blur-md [&_svg]:size-5"
          >
            <Sparkles />
            Çeşitli ve Eğlenceli Modlar
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Sıkılmaya Vakit Yok
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            Her seviyeye uygun farklı oyun modları ile öğrenme sürecini bir
            maceraya dönüştürün.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modes.map((mode, index) => (
            <Card
              key={index}
              className={`${mode.accent} border border-border/50 bg-background shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl`}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className={`rounded-2xl p-3 ${mode.color}`}>
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
  );
}

{
  /** Notlar:
   * 1. Renk Paleti: Her oyun modu için farklı bir soft arka plan (bg-color/10) kullanarak görsel çeşitlilik sağladık.
   * 2. İkon Tasarımı: Lucide ikonlarını 2xl boyutunda ve yuvarlatılmış kutular (rounded-2xl) içinde kullanarak oyunsu (playful) bir hava kattık.
   * 3. Hover Efektleri: Kartlara hafif bir arka plan değişimi ekleyerek kullanıcının etkileşimde olduğunu hissettirdik.
   * 4. Düzen: Grid yapısı sayesinde 6 farklı oyun modunu ekranda dengeli bir şekilde dağıttık.
   */
}
