import type { PuzzleTheme, PuzzleThemeWithTheme } from "@/features/puzzle-theme/types/puzzle-theme";
import { parseThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import { type DbTheme, toTheme } from "@/features/theme/mapper/theme.mapper";

export type DbPuzzleTheme = {
  id: string;
  puzzle_id: string;
  theme_id: string;
  weight: number;
  created_at: string;
};

export type DbPuzzleThemeWithTheme = DbPuzzleTheme & {
  themes: DbTheme | null;
};

export function toPuzzleTheme(db: DbPuzzleTheme): PuzzleTheme | null {
  const weight = parseThemeLinkWeight(db.weight);
  if (weight === null) {
    console.error("puzzle-theme.mapper.toPuzzleTheme: invalid weight", db.id, db.weight);
    return null;
  }

  return {
    id: db.id,
    puzzleId: db.puzzle_id,
    themeId: db.theme_id,
    weight,
    createdAt: db.created_at,
  };
}

export function toPuzzleThemes(rows: DbPuzzleTheme[]): PuzzleTheme[] {
  const items: PuzzleTheme[] = [];
  for (const row of rows) {
    const item = toPuzzleTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export function toPuzzleThemeWithTheme(db: DbPuzzleThemeWithTheme): PuzzleThemeWithTheme | null {
  const puzzleTheme = toPuzzleTheme(db);
  if (!puzzleTheme || !db.themes) return null;

  const theme = toTheme(db.themes);
  if (!theme) return null;

  return { ...puzzleTheme, theme };
}

export function toPuzzleThemesWithTheme(rows: DbPuzzleThemeWithTheme[]): PuzzleThemeWithTheme[] {
  const items: PuzzleThemeWithTheme[] = [];
  for (const row of rows) {
    const item = toPuzzleThemeWithTheme(row);
    if (item) items.push(item);
  }
  return items;
}
