import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Zap, Shield, Smartphone } from "lucide-react"
  
  export function Features() {
    const features = [
      {
        title: "Yüksek Performans",
        description: "Next.js 14 ve Tailwind CSS ile optimize edilmiş, ışık hızında yüklenen arayüzler.",
        icon: <Zap className="h-10 w-10 text-primary" />,
      },
      {
        title: "Güvenli Altyapı",
        description: "Kurumsal seviyede güvenlik standartları ve modern yetkilendirme çözümleri.",
        icon: <Shield className="h-10 w-10 text-primary" />,
      },
      {
        title: "Tam Mobil Uyum",
        description: "Tüm ekran boyutlarında kusursuz çalışan, responsive tasarım yaklaşımı.",
        icon: <Smartphone className="h-10 w-10 text-primary" />,
      },
    ]
  
    return (
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Geliştirme sürecinizi hızlandıran ve kullanıcı deneyimini önceliklendiren özelliklerle tanışın.
            </p>
          </div>
  
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
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
       * 1. Grid Yapısı: sm:grid-cols-2 ve lg:grid-cols-3 kullanarak ekran genişliğine göre 1, 2 veya 3 kolonlu bir düzen sağladık.
       * 2. Hover Efekti: transition-all ve hover sınıfları ile kartlara hafif bir etkileşim (border rengi değişimi ve shadow) ekledik.
       * 3. İkon Kullanımı: Lucide-react ikonlarını bir array içinde tutarak kodun okunabilirliğini ve yönetilebilirliğini artırdık.
       * 4. Arka Plan: Hero bölümünden ayrılması için hafif bir gri tonu (bg-slate-50/50) kullandık.
       */
  }