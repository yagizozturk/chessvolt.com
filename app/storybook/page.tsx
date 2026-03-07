import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap } from "lucide-react";

export default function StorybookPage() {
  return (
    <div className="flex min-h-full">
      {/* Sol kolon - Bölüm listesi */}
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
          <a
            href="#texts"
            className="text-foreground hover:bg-accent block rounded-md px-3 py-2 text-sm font-medium"
          >
            Texts
          </a>
          <a
            href="#buttons"
            className="text-foreground hover:bg-accent block rounded-md px-3 py-2 text-sm font-medium"
          >
            Buttons
          </a>
        </nav>
      </aside>

      {/* Sağ kolon - Önizleme alanı */}
      <main className="flex-1 overflow-auto p-8">
        {/* Backgrounds bölümü */}
        <section id="backgrounds" className="mb-16 space-y-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Backgrounds</h3>
            <p className="text-muted-foreground mt-1">
              Arka plan renkleri (globals.css)
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "background", class: "bg-background", hex: "#121f25" },
              { name: "foreground", class: "bg-foreground", hex: "#F8F7FF" },
              { name: "primary", class: "bg-primary", hex: "#fcc800" },
              { name: "secondary", class: "bg-secondary", hex: "#1e1f26" },
              { name: "border", class: "bg-border", hex: "#37464f" },
              { name: "input", class: "bg-input", hex: "#e6e6ea" },
              {
                name: "hero",
                class:
                  "bg-gradient-to-br from-[#1A1147] via-[#2D1B69] via-[#3D2580] via-60% to-[#1A1147]",
                hex: "gradient",
              },
            ].map(({ name, class: className, hex }) => (
              <div
                key={name}
                className="border-border overflow-hidden rounded-lg border"
              >
                <div className={`h-20 ${className}`} />
                <div className="p-3">
                  <p className="font-medium">{name}</p>
                  <p className="text-muted-foreground text-sm">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Texts bölümü */}
        <section id="texts" className="mb-16 space-y-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Texts</h3>
            <p className="text-muted-foreground mt-1">
              Metin renkleri (globals.css)
            </p>
          </div>
          <div className="border-border space-y-4 rounded-lg border p-6">
            {[
              {
                name: "foreground",
                class: "text-foreground",
                hex: "#fff",
                sample: "Ana metin rengi",
              },
              {
                name: "primary",
                class: "text-primary",
                hex: "#fcc800",
                sample: "Vurgu ve CTA metni",
              },
              {
                name: "muted-foreground",
                class: "text-muted-foreground",
                hex: "var(--muted-foreground)",
                sample: "İkincil, açıklama metni",
              },
            ].map(({ name, class: className, hex, sample }) => (
              <div key={name} className="flex flex-col gap-1">
                <p className={`text-lg font-medium ${className}`}>{sample}</p>
                <p className="text-muted-foreground text-sm">
                  {name} · {hex}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons bölümü */}
        <section id="buttons" className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Buttons</h3>
            <p className="text-muted-foreground mt-1">
              Tüm buton varyantları ve boyutları
            </p>
          </div>

          {[
            { variant: "default" as const, label: "default" },
            { variant: "secondary" as const, label: "secondary" },
            { variant: "outline" as const, label: "outline" },
            { variant: "ghost" as const, label: "ghost" },
            { variant: "link" as const, label: "link" },
            { variant: "destructive" as const, label: "destructive" },
            { variant: "cta" as const, label: "cta" },
          ].map(({ variant, label }) => (
            <div key={variant} className="border-border rounded-lg border p-6">
              <h4 className="text-muted-foreground mb-4 text-sm font-medium">
                {label}
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant={variant} size="xs">
                  xs
                </Button>
                <Button variant={variant} size="sm">
                  sm
                </Button>
                <Button variant={variant} size="default">
                  default
                </Button>
                <Button variant={variant} size="lg">
                  lg
                </Button>
                <Button variant={variant} size="xl">
                  xl
                </Button>
                <Button variant={variant} size="icon">
                  <Zap className="h-4 w-4" />
                </Button>
                <Button variant={variant} size="sm">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  İkonlu
                </Button>
              </div>
            </div>
          ))}

          {/* vghost — koyu arka plan gerekli */}
          <div className="border-border rounded-lg border p-6">
            <h4 className="text-muted-foreground mb-4 text-sm font-medium">
              vghost
            </h4>
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-[#1A1147] p-8">
              <Button variant="vghost" size="xs">
                xs
              </Button>
              <Button variant="vghost" size="sm">
                sm
              </Button>
              <Button variant="vghost" size="default">
                default
              </Button>
              <Button variant="vghost" size="lg">
                lg
              </Button>
              <Button variant="vghost" size="xl">
                xl
              </Button>
              <Button variant="vghost" size="icon">
                <Zap className="h-4 w-4" />
              </Button>
              <Button variant="vghost" size="sm">
                <ChevronRight className="mr-2 h-4 w-4" />
                İkonlu
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
