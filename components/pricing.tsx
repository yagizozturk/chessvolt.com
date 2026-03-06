"use client"

import { Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Temel özellikleri keşfetmek ve öğrenmeye başlamak için.",
      features: [
        "Tüm temel derslere erişim",
        "Günlük 5 can sınırı",
        "Liderlik tablolarına katılım",
        "Standart başarı rozetleri",
      ],
      buttonText: "Ücretsiz Başla",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Volt Member",
      price: "99",
      description: "Hız kesmeden öğrenmek isteyenler için efsanevi özellikler.",
      features: [
        "Sınırsız can ile kesintisiz dersler",
        "Reklamsız deneyim",
        "Volt özel başarı rozetleri",
        "Kişiselleştirilmiş hata analizi",
        "Öncelikli destek",
      ],
      buttonText: "Volt'a Yükselt",
      variant: "default" as const,
      popular: true,
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Sana En Uygun Planı Seç
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            İster ücretsiz devam et, ister Volt Member ile öğrenme hızını ikiye katla.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.popular 
                ? "border-primary shadow-2xl lg:scale-105 bg-primary/[0.01]" 
                : "border-border shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                  <Zap className="h-3 w-3 fill-current" /> EN POPÜLER
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold">₺{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/ay</span>
                </div>
                <CardDescription className="mt-2 min-h-[40px]">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow pt-4">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className={`mt-0.5 shrink-0 rounded-full p-0.5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`}>
                        <Check className="h-4 w-4 stroke-[3px]" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pb-8 pt-6">
                <Button 
                  className={`w-full h-12 text-base font-bold transition-all ${
                    plan.popular ? "shadow-lg shadow-primary/20 hover:bg-primary/90" : ""
                  }`}
                  variant={plan.variant}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

{
    /** Notlar:
     * 1. Check Hatası Çözümü: npx ile kurulmaya çalışılan "check" yerine doğrudan Lucide-React'ten gelen "Check" ikonu kullanıldı.
     * 2. Volt Member Vurgusu: "EN POPÜLER" etiketi ve hafif ölçeklendirme (scale-105) ile premium plan öne çıkarıldı.
     * 3. Tasarım Uyumu: Shadcn'in Card yapısına sadık kalarak border, shadow ve padding dengeleri sağlandı.
     * 4. Responsive Grid: Mobilde tek sütun, orta ve büyük ekranlarda yan yana iki sütun olacak şekilde yapılandırıldı.
     */
}