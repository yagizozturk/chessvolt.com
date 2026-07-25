import type { Theme } from "@/features/theme/types/theme";
import { formatThemeCategoryLabel } from "@/features/theme/types/theme-category";

export function filterThemes(themes: Theme[], searchQuery: string): Theme[] {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return themes;

  return themes.filter((theme) => {
    const haystack = [theme.title, theme.description ?? "", formatThemeCategoryLabel(theme.category)]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function buildThemeFilterUrl(searchQuery: string): string {
  const q = searchQuery.trim();
  return q ? `/riddles?q=${encodeURIComponent(q)}` : "/riddles";
}
