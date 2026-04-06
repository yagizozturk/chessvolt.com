import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Zap } from "lucide-react";

export default function StorybookPage() {
  return (
    <div className="flex min-h-full">
      {/* Left column - Section list */}
      <aside className="border-border w-56 shrink-0 border-r p-6">
        <Link
          href="/"
          className="text-foreground hover:text-primary mb-6 flex items-center gap-2 text-xl font-bold tracking-tighter"
        >
          <Zap className="h-6 w-6 text-[#fcc800]" />
          <span>chessvolt</span>
        </Link>
        <h2 className="text-muted-foreground text-sm font-semibold tracking-wider">
          Components
        </h2>
        <nav className="mt-4 space-y-1">
          <a
            href="#backgrounds"
            className="text-foreground hover:bg-accent block rounded-md px-3 py-2 text-sm font-medium"
          >
            Backgrounds
          </a>
        </nav>
      </aside>

      {/* Right column - Preview area */}
      <main className="flex-1 overflow-auto p-8">
        

        <section id="cards" className="space-y-8">
          <div>
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              Cards
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              shadcn default card yapilari
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>
                  Basit baslik ve aciklama iceren default kart.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Icerik alani, metin veya kisa bir ozet gostermek icin
                  kullanilir.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card With Actions</CardTitle>
                <CardDescription>
                  Footer icinde birincil ve ikincil buton ornegi.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Bu varyasyon, kartin altinda aksiyon gostermeye uygundur.
                </p>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Continue</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stats Card</CardTitle>
                <CardDescription>
                  Bilgi karti tarzinda sade bir default kullanim.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-semibold">1,284</p>
                <p className="text-sm text-muted-foreground">
                  Son 30 gunde tamamlanan puzzle
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="px-0">
                  Tum istatistikleri gor
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <h3 className="text-foreground text-lg font-semibold">
              Filled Variations
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Ici boyali (filled) kart ornekleri
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card className="bg-primary text-primary-foreground ring-primary/20">
              <CardHeader>
                <CardTitle>Primary Filled</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Vurgu gereken durumlar icin dolu kart stili.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-foreground/90">
                  Oncelikli bilgi veya CTA alanlari icin kullanilabilir.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary text-secondary-foreground ring-secondary/40">
              <CardHeader>
                <CardTitle>Secondary Filled</CardTitle>
                <CardDescription className="text-secondary-foreground/80">
                  Daha yumusak tonlu dolu kart varyasyonu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-secondary-foreground/90">
                  Ikincil bilgi panelleri icin ideal bir gorunum saglar.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent text-accent-foreground ring-accent/40">
              <CardHeader>
                <CardTitle>Accent Filled</CardTitle>
                <CardDescription className="text-accent-foreground/80">
                  Ozellikle dikkat cekmesi gereken kisa mesajlar icin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-accent-foreground/90">
                  Durum etiketi, duyuru veya mini ozetler icin uygun.
                </p>
                <Button variant="secondary" size="sm" className="w-fit">
                  Detay
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
