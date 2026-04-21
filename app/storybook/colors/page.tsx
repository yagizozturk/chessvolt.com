import { StorybookPage } from "../page";

type ColorItem = {
  name: string;
  cssVar?: string;
  isRgb?: boolean;
  hex?: string;
};

const colors: ColorItem[] = [
  // Core theme tokens
  { name: "Background", cssVar: "--background" },
  { name: "Foreground", cssVar: "--foreground" },
  { name: "Card", cssVar: "--card" },
  { name: "Card foreground", cssVar: "--card-foreground" },
  { name: "Popover", cssVar: "--popover" },
  { name: "Popover foreground", cssVar: "--popover-foreground" },
  { name: "Primary", cssVar: "--primary" },
  { name: "Primary foreground", cssVar: "--primary-foreground" },
  { name: "Secondary", cssVar: "--secondary" },
  { name: "Secondary foreground", cssVar: "--secondary-foreground" },
  { name: "Muted", cssVar: "--muted" },
  { name: "Muted foreground", cssVar: "--muted-foreground" },
  { name: "Accent", cssVar: "--accent" },
  { name: "Accent foreground", cssVar: "--accent-foreground" },
  { name: "Destructive", cssVar: "--destructive" },
  { name: "Border", cssVar: "--border" },
  { name: "Input", cssVar: "--input" },
  { name: "Ring", cssVar: "--ring" },

  // Charts
  { name: "Chart 1", cssVar: "--chart-1" },
  { name: "Chart 2", cssVar: "--chart-2" },
  { name: "Chart 3", cssVar: "--chart-3" },
  { name: "Chart 4", cssVar: "--chart-4" },
  { name: "Chart 5", cssVar: "--chart-5" },

  // Sidebar
  { name: "Sidebar", cssVar: "--sidebar" },
  { name: "Sidebar foreground", cssVar: "--sidebar-foreground" },
  { name: "Sidebar primary", cssVar: "--sidebar-primary" },
  { name: "Sidebar primary foreground", cssVar: "--sidebar-primary-foreground" },
  { name: "Sidebar accent", cssVar: "--sidebar-accent" },
  { name: "Sidebar accent foreground", cssVar: "--sidebar-accent-foreground" },
  { name: "Sidebar border", cssVar: "--sidebar-border" },
  { name: "Sidebar ring", cssVar: "--sidebar-ring" },

  // Volt button (standalone CSS, not theme token)
  { name: "Volt button background", hex: "#1899d6" },
  { name: "Volt button highlight", hex: "#1cb0f6" },
];

export default function StorybookColorsPage() {
  return (
    <StorybookPage>
      <section id="colors" className="space-y-6">
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">Colors</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Projede kullanılan tüm temel renk token&apos;larının bir önizlemesi. Aşağıdaki kutular hem aydınlık hem de
            karanlık tema için güncel değerleri yansıtır.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {colors.map((color) => {
            const backgroundStyle = color.hex
              ? { backgroundColor: color.hex }
              : color.isRgb
                ? { backgroundColor: `rgb(var(${color.cssVar}))` }
                : { backgroundColor: `var(${color.cssVar})` };

            return (
              <div
                key={color.name}
                className="bg-card text-card-foreground flex flex-col overflow-hidden rounded-lg border"
              >
                <div className="h-20 w-full border-b" style={backgroundStyle} />
                <div className="space-y-1 p-3">
                  <p className="text-sm leading-none font-medium">{color.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {color.hex ? color.hex : color.isRgb ? `rgb(var(${color.cssVar}))` : `var(${color.cssVar})`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </StorybookPage>
  );
}
