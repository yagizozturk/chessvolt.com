// TODO: Refactor
import Link from "next/link";

import { buildThemePlayUrl } from "@/features/riddle/utilities/build-riddle-url";
import { ThemeBadge } from "@/features/theme/components/theme-badge";
import type { Theme } from "@/features/theme/types/theme";
import { THEME_CATEGORIES, formatThemeCategoryLabel } from "@/features/theme/types/theme-category";
import { groupThemesByCategory } from "@/features/theme/utilities/group-themes-by-category";

type ThemeListProps = {
  themes: Theme[];
  groupByCategory?: boolean;
};

export function ThemeList({ themes, groupByCategory = true }: ThemeListProps) {
  if (themes.length === 0) {
    return <p className="text-muted-foreground text-sm">No themes to show.</p>;
  }

  if (!groupByCategory) {
    return (
      <ul className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <ThemeListItem key={theme.id} theme={theme} />
        ))}
      </ul>
    );
  }

  const grouped = groupThemesByCategory(themes);

  return (
    <div className="space-y-6">
      {THEME_CATEGORIES.map((category) => {
        const items = grouped.get(category) ?? [];
        if (items.length === 0) return null;

        return (
          <section key={category}>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium tracking-wide uppercase">
              {formatThemeCategoryLabel(category)}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {items.map((theme) => (
                <ThemeListItem key={theme.id} theme={theme} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// ================================================================================
// Theme list item component. This link redirect to /riddle/[id]
// ================================================================================
function ThemeListItem({ theme }: { theme: Theme }) {
  return (
    <li>
      <Link href={buildThemePlayUrl(theme.slug)} className="inline-flex transition-opacity hover:opacity-80">
        <ThemeBadge theme={theme} />
      </Link>
    </li>
  );
}
