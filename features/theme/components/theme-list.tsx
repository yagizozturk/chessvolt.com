// TODO: Refactor
import { ThemeBadge } from "@/features/theme/components/theme-badge";
import type { Theme } from "@/features/theme/types/theme";
import {
  formatThemeCategoryLabel,
  THEME_CATEGORIES,
  type ThemeCategory,
} from "@/features/theme/types/theme-category";

type ThemeListProps = {
  themes: Theme[];
  groupByCategory?: boolean;
};

function groupThemesByCategory(themes: Theme[]): Map<ThemeCategory, Theme[]> {
  const grouped = new Map<ThemeCategory, Theme[]>();
  for (const category of THEME_CATEGORIES) {
    grouped.set(category, []);
  }
  for (const theme of themes) {
    grouped.get(theme.category)?.push(theme);
  }
  return grouped;
}

export function ThemeList({ themes, groupByCategory = true }: ThemeListProps) {
  if (themes.length === 0) {
    return <p className="text-muted-foreground text-sm">No themes to show.</p>;
  }

  if (!groupByCategory) {
    return (
      <ul className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <li key={theme.id}>
            <ThemeBadge theme={theme} />
          </li>
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
                <li key={theme.id}>
                  <ThemeBadge theme={theme} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
