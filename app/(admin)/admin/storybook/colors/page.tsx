
type ColorItem = {
  name: string;
  cssVar?: string;
  isRgb?: boolean;
  hex?: string;
  /** Usage note aligned with docs/colors.md */
  description?: string;
};

type ColorGroup = {
  id: string;
  title: string;
  description?: string;
  items: ColorItem[];
};

const colorGroups: ColorGroup[] = [
  {
    id: "base",
    title: "1. Base Colors",
    description:
      "Foundation colors for the page shell and default typography, matching docs/colors.md §1.",
    items: [
      {
        name: "Background",
        cssVar: "--background",
        description: "The main background color of your entire page or body.",
      },
      {
        name: "Foreground",
        cssVar: "--foreground",
        description: "The default text color for the application. Used for standard body text.",
      },
    ],
  },
  {
    id: "surface",
    title: "2. Surface Elements (Containers)",
    description: "Raised surfaces and floating containers — cards, menus, and overlays (docs §2).",
    items: [
      {
        name: "Card",
        cssVar: "--card",
        description: "Background for card components.",
      },
      {
        name: "Card foreground",
        cssVar: "--card-foreground",
        description: "Title and body text inside cards.",
      },
      {
        name: "Popover",
        cssVar: "--popover",
        description: "Background for floating elements like dropdowns, tooltips, and hover cards.",
      },
      {
        name: "Popover foreground",
        cssVar: "--popover-foreground",
        description: "Text on popover surfaces.",
      },
    ],
  },
  {
    id: "action",
    title: "3. Action & Branding",
    description: "Brand emphasis, actions, and interactive feedback fills (docs §3).",
    items: [
      {
        name: "Primary",
        cssVar: "--primary",
        description: "Main brand color — primary buttons and high-emphasis UI.",
      },
      {
        name: "Primary foreground",
        cssVar: "--primary-foreground",
        description: "Text on top of primary for readability.",
      },
      {
        name: "Secondary",
        cssVar: "--secondary",
        description: "Less prominent actions — cancel buttons, secondary navigation.",
      },
      {
        name: "Secondary foreground",
        cssVar: "--secondary-foreground",
        description: "Text/icons on secondary surfaces.",
      },
      {
        name: "Accent",
        cssVar: "--accent",
        description: "Hover states on buttons, links, or list items — subtle interaction feedback.",
      },
      {
        name: "Accent foreground",
        cssVar: "--accent-foreground",
        description: "Text/icons on accent surfaces.",
      },
    ],
  },
  {
    id: "status",
    title: "4. Status & Feedback",
    description: "De-emphasized UI and danger states (docs §4).",
    items: [
      {
        name: "Muted",
        cssVar: "--muted",
        description: "De-emphasized backgrounds — helper regions, disabled inputs.",
      },
      {
        name: "Muted foreground",
        cssVar: "--muted-foreground",
        description: "De-emphasized text — labels, helper text.",
      },
      {
        name: "Destructive",
        cssVar: "--destructive",
        description: "Danger or error actions — delete, destructive confirmations, errors.",
      },
    ],
  },
  {
    id: "form",
    title: "5. Form & Layout Details",
    description: "Dividers, field chrome, and focus rings (docs §5).",
    items: [
      {
        name: "Border",
        cssVar: "--border",
        description: "Standard dividers and outlines around components.",
      },
      {
        name: "Input",
        cssVar: "--input",
        description: "Border color for form fields such as inputs and textareas.",
      },
      {
        name: "Ring",
        cssVar: "--ring",
        description: "Focus ring when focusing inputs or moving focus with the keyboard.",
      },
    ],
  },
  {
    id: "sidebar",
    title: "6. Sidebar (Complex Layouts)",
    description:
      "Tokens for the shadcn sidebar layout — panel chrome, emphasis, and separators (docs §6, extended with full sidebar token set).",
    items: [
      {
        name: "Sidebar",
        cssVar: "--sidebar",
        description: "Background of the navigation panel.",
      },
      {
        name: "Sidebar foreground",
        cssVar: "--sidebar-foreground",
        description: "Default text color inside the sidebar.",
      },
      {
        name: "Sidebar primary",
        cssVar: "--sidebar-primary",
        description: "Primary actions or highlights in the sidebar.",
      },
      {
        name: "Sidebar primary foreground",
        cssVar: "--sidebar-primary-foreground",
        description: "Text/icons on sidebar primary surfaces.",
      },
      {
        name: "Sidebar accent",
        cssVar: "--sidebar-accent",
        description: "Hovered or active sidebar item background.",
      },
      {
        name: "Sidebar accent foreground",
        cssVar: "--sidebar-accent-foreground",
        description: "Text/icons on sidebar accent rows.",
      },
      {
        name: "Sidebar border",
        cssVar: "--sidebar-border",
        description: "Vertical line separating the sidebar from main content.",
      },
      {
        name: "Sidebar ring",
        cssVar: "--sidebar-ring",
        description: "Focus ring color within the sidebar.",
      },
    ],
  },
  {
    id: "charts",
    title: "7. Data Visualization",
    description: "Coordinated palette for charts and data graphics (docs §7).",
    items: [
      { name: "Chart 1", cssVar: "--chart-1", description: "First series or segment color." },
      { name: "Chart 2", cssVar: "--chart-2", description: "Second series or segment color." },
      { name: "Chart 3", cssVar: "--chart-3", description: "Third series or segment color." },
      { name: "Chart 4", cssVar: "--chart-4", description: "Fourth series or segment color." },
      { name: "Chart 5", cssVar: "--chart-5", description: "Fifth series or segment color." },
    ],
  },
  {
    id: "volt",
    title: "Project-specific",
    description: "Standalone hex values used outside the shadcn theme token system.",
    items: [
      {
        name: "Volt button background",
        hex: "#1899d6",
        description: "Volt CTA / accent button base fill.",
      },
      {
        name: "Volt button highlight",
        hex: "#1cb0f6",
        description: "Volt button highlight / hover emphasis.",
      },
    ],
  },
];

function ColorSwatch({ color }: { color: ColorItem }) {
  const backgroundStyle = color.hex
    ? { backgroundColor: color.hex }
    : color.isRgb
      ? { backgroundColor: `rgb(var(${color.cssVar}))` }
      : { backgroundColor: `var(${color.cssVar})` };

  const valueLabel = color.hex
    ? color.hex
    : color.isRgb
      ? `rgb(var(${color.cssVar}))`
      : color.cssVar
        ? `var(${color.cssVar})`
        : "";

  return (
    <div className="bg-card text-card-foreground flex flex-col overflow-hidden rounded-lg border">
      <div className="h-20 w-full border-b" style={backgroundStyle} />
      <div className="space-y-1 p-3">
        <p className="text-sm leading-none font-medium">{color.name}</p>
        <p className="text-muted-foreground font-mono text-xs">{valueLabel}</p>
        {color.description ? (
          <p className="text-muted-foreground mt-1 text-xs leading-snug">{color.description}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function StorybookColorsPage() {
  return (
    <section id="colors" className="space-y-12">
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">Colors</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Projede kullanılan tüm temel renk token&apos;larının bir önizlemesi. Gruplar{" "}
            <code className="text-foreground rounded bg-muted px-1 py-0.5 text-xs">docs/colors.md</code> ile aynı
            yapıdadır; aşağıdaki kutular hem aydınlık hem de karanlık tema için güncel değerleri yansıtır.
          </p>
        </div>

        {colorGroups.map((group) => (
          <section key={group.id} aria-labelledby={`colors-${group.id}`} className="space-y-4">
            <div>
              <h3 id={`colors-${group.id}`} className="text-foreground text-lg font-semibold tracking-tight">
                {group.title}
              </h3>
              {group.description ? (
                <p className="text-muted-foreground mt-1 max-w-3xl text-sm">{group.description}</p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {group.items.map((color) => (
                <ColorSwatch key={color.name} color={color} />
              ))}
            </div>
          </section>
        ))}
    </section>
  );
}
