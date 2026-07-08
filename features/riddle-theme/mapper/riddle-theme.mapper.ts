// TODO: Refactor
import type { RiddleTheme, RiddleThemeWithTheme } from "@/features/riddle-theme/types/riddle-theme";
import { parseThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import { toTheme, type DbTheme } from "@/features/theme/mapper/theme.mapper";

export type DbRiddleTheme = {
  id: string;
  riddle_id: string;
  theme_id: string;
  weight: number;
  created_at: string;
};

export type DbRiddleThemeWithTheme = DbRiddleTheme & {
  themes: DbTheme | null;
};

export function toRiddleTheme(db: DbRiddleTheme): RiddleTheme | null {
  const weight = parseThemeLinkWeight(db.weight);
  if (weight === null) {
    console.error("riddle-theme.mapper.toRiddleTheme: invalid weight", db.id, db.weight);
    return null;
  }

  return {
    id: db.id,
    riddleId: db.riddle_id,
    themeId: db.theme_id,
    weight,
    createdAt: db.created_at,
  };
}

export function toRiddleThemes(rows: DbRiddleTheme[]): RiddleTheme[] {
  const items: RiddleTheme[] = [];
  for (const row of rows) {
    const item = toRiddleTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export function toRiddleThemeWithTheme(db: DbRiddleThemeWithTheme): RiddleThemeWithTheme | null {
  const riddleTheme = toRiddleTheme(db);
  if (!riddleTheme || !db.themes) return null;

  const theme = toTheme(db.themes);
  if (!theme) return null;

  return { ...riddleTheme, theme };
}

export function toRiddleThemesWithTheme(rows: DbRiddleThemeWithTheme[]): RiddleThemeWithTheme[] {
  const items: RiddleThemeWithTheme[] = [];
  for (const row of rows) {
    const item = toRiddleThemeWithTheme(row);
    if (item) items.push(item);
  }
  return items;
}
