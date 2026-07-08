// TODO: Refactor
import type { Theme } from "@/features/theme/types/theme";
import { parseThemeCategory, type ThemeCategory } from "@/features/theme/types/theme-category";

export type DbTheme = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function toTheme(db: DbTheme): Theme | null {
  const category = parseThemeCategory(db.category);
  if (!category) {
    console.error("theme.mapper.toTheme: unknown category", db.category, "for theme", db.id);
    return null;
  }

  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    description: db.description,
    category,
    sortOrder: db.sort_order,
    isActive: db.is_active,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function toThemes(rows: DbTheme[]): Theme[] {
  const themes: Theme[] = [];
  for (const row of rows) {
    const theme = toTheme(row);
    if (theme) themes.push(theme);
  }
  return themes;
}
