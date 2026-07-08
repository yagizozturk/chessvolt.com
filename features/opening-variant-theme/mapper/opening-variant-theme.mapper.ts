// TODO: Refactor
import type {
  OpeningVariantTheme,
  OpeningVariantThemeWithTheme,
} from "@/features/opening-variant-theme/types/opening-variant-theme";
import { parseThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import { toTheme, type DbTheme } from "@/features/theme/mapper/theme.mapper";

export type DbOpeningVariantTheme = {
  id: string;
  opening_variant_id: string;
  theme_id: string;
  weight: number;
  created_at: string;
};

export type DbOpeningVariantThemeWithTheme = DbOpeningVariantTheme & {
  themes: DbTheme | null;
};

export function toOpeningVariantTheme(db: DbOpeningVariantTheme): OpeningVariantTheme | null {
  const weight = parseThemeLinkWeight(db.weight);
  if (weight === null) {
    console.error("opening-variant-theme.mapper.toOpeningVariantTheme: invalid weight", db.id, db.weight);
    return null;
  }

  return {
    id: db.id,
    openingVariantId: db.opening_variant_id,
    themeId: db.theme_id,
    weight,
    createdAt: db.created_at,
  };
}

export function toOpeningVariantThemes(rows: DbOpeningVariantTheme[]): OpeningVariantTheme[] {
  const items: OpeningVariantTheme[] = [];
  for (const row of rows) {
    const item = toOpeningVariantTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export function toOpeningVariantThemeWithTheme(
  db: DbOpeningVariantThemeWithTheme,
): OpeningVariantThemeWithTheme | null {
  const openingVariantTheme = toOpeningVariantTheme(db);
  if (!openingVariantTheme || !db.themes) return null;

  const theme = toTheme(db.themes);
  if (!theme) return null;

  return { ...openingVariantTheme, theme };
}

export function toOpeningVariantThemesWithTheme(
  rows: DbOpeningVariantThemeWithTheme[],
): OpeningVariantThemeWithTheme[] {
  const items: OpeningVariantThemeWithTheme[] = [];
  for (const row of rows) {
    const item = toOpeningVariantThemeWithTheme(row);
    if (item) items.push(item);
  }
  return items;
}
