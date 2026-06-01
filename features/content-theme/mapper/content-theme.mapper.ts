import type { ContentTheme, ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";
import { parseContentType } from "@/features/content-theme/types/content-type";
import { parseContentThemeWeight } from "@/features/content-theme/types/content-theme-weight";
import { toTheme, type DbTheme } from "@/features/theme/mapper/theme.mapper";

export type DbContentTheme = {
  id: string;
  content_type: string;
  content_id: string;
  theme_id: string;
  weight: number;
  created_at: string;
};

export type DbContentThemeWithTheme = DbContentTheme & {
  themes: DbTheme | null;
};

export function toContentTheme(db: DbContentTheme): ContentTheme | null {
  const contentType = parseContentType(db.content_type);
  const weight = parseContentThemeWeight(db.weight);
  if (!contentType || weight === null) {
    console.error("content-theme.mapper.toContentTheme: invalid row", db.id, {
      contentType: db.content_type,
      weight: db.weight,
    });
    return null;
  }

  return {
    id: db.id,
    contentType,
    contentId: db.content_id,
    themeId: db.theme_id,
    weight,
    createdAt: db.created_at,
  };
}

export function toContentThemes(rows: DbContentTheme[]): ContentTheme[] {
  const items: ContentTheme[] = [];
  for (const row of rows) {
    const item = toContentTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export function toContentThemeWithTheme(db: DbContentThemeWithTheme): ContentThemeWithTheme | null {
  const contentTheme = toContentTheme(db);
  if (!contentTheme || !db.themes) return null;

  const theme = toTheme(db.themes);
  if (!theme) return null;

  return { ...contentTheme, theme };
}

export function toContentThemesWithTheme(rows: DbContentThemeWithTheme[]): ContentThemeWithTheme[] {
  const items: ContentThemeWithTheme[] = [];
  for (const row of rows) {
    const item = toContentThemeWithTheme(row);
    if (item) items.push(item);
  }
  return items;
}
