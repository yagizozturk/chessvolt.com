import { Button } from "@/components/ui/button";
import { ChevronRight, Zap } from "lucide-react";

export default function StorybookPage() {
  return (
    <div className="flex min-h-full">
      {/* Sol kolon - Bölüm listesi */}
      <aside className="w-56 shrink-0 border-r border-border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Bileşenler
        </h2>
        <nav className="mt-4 space-y-1">
          <a
            href="#buttons"
            className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Buttons
          </a>
        </nav>
      </aside>

      {/* Sağ kolon - Önizleme alanı */}
      <main className="flex-1 overflow-auto p-8">
        {/* Buttons bölümü */}
        <section id="buttons" className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Buttons</h3>
            <p className="mt-1 text-muted-foreground">
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
            <div
              key={variant}
              className="rounded-lg border border-border p-6"
            >
              <h4 className="mb-4 text-sm font-medium text-muted-foreground">
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
          <div className="rounded-lg border border-border p-6">
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">
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
