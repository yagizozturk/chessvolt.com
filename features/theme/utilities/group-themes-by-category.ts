import { THEME_CATEGORIES, type ThemeCategory } from "@/features/theme/types/theme-category";
import type { Theme } from "@/features/theme/types/theme";

export function groupThemesByCategory(themes: Theme[]): Map<ThemeCategory, Theme[]> {
  const grouped = new Map<ThemeCategory, Theme[]>();

  for (const category of THEME_CATEGORIES) {
    grouped.set(category, []);
  }

  for (const theme of themes) {
    grouped.get(theme.category)?.push(theme);
  }

  return grouped;
}
