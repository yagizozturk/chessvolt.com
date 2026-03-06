"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl tracking-tight">
            MarkaLogo
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              {/* ÖNEMLİ: asChild kullanarak Link'i içeriye alıyoruz */}
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/hakkimizda">
                  Hakkımızda
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/hizmetler">
                  Hizmetler
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/iletisim">
                  İletişim
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Giriş Yap</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Başla</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

{
    /** Notlar:
     * 1. "use client": Dosyanın en tepesine ekledik. NavigationMenu, tarayıcıda çalışan JavaScript'e ihtiyaç duyar.
       2. asChild Kullanımı: asChild prop'u verdik. Bu sayede Radix UI, kendi <a> etiketini render etmek yerine içindeki Next.js Link bileşenini ana element olarak kabul eder. Bu, az önce aldığın hatayı (Server Component/Legacy Link hatası) tamamen çözer.
       3. Sticky Olmayan Yapı: header etiketinde sadece w-full ve border-b kullandık. fixed veya sticky sınıflarını eklemediğimiz için sayfa aşağı kayınca navbar yukarıda kalacaktır.
       4. Butonlarda asChild: Aynı mantığı butonlar için de uyguladık. Button içine Link koyarken asChild kullanmak her zaman en sağlıklı yoldur.
     */
}