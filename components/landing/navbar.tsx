"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="absolute top-0 right-0 left-0 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white"
          >
            <Zap className="h-6 w-6" />
            chessvolt
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/login">Register</Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/register">Start Playing</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

{
  /** Notes:
   * 1. Positioning: "absolute top-0" kullanarak Navbar'ı Hero'nun üzerine bindirdik, böylece gradient sayfanın 0 noktasından başlar.
   * 2. Transparency: "bg-transparent" ve border'sız yapı sayesinde Hero ile kusursuz bir görsel bütünlük sağlandı.
   * 3. Z-Index: "z-50" vererek Navbar'ın Hero içeriğinin ve o parlamaların (glow) üstünde kalmasını garanti altına aldık.
   * 4. Spacing: Navbar yüksekliğini "h-20" yaparak içeriğe daha geniş ve ferah bir alan bıraktık.
   */
}
