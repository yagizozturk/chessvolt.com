import {
  toCollectionWithRiddleCount,
  type DbCollectionWithRiddleCount,
} from "@/features/collection/mapper/collection.mapper";
import type { CollectionTheme, CollectionThemeWithTheme } from "@/features/collection-theme/types/collection-theme";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { parseThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";
import { toTheme, type DbTheme } from "@/features/theme/mapper/theme.mapper";

export const DEFAULT_TOP_COLLECTION_THEME_COUNT = 2;

export type DbCollectionTheme = {
  id: string;
  collection_id: string;
  theme_id: string;
  weight: number;
  created_at: string;
};

export type DbCollectionThemeWithTheme = DbCollectionTheme & {
  themes: DbTheme | null;
};

export function toCollectionTheme(db: DbCollectionTheme): CollectionTheme | null {
  const weight = parseThemeLinkWeight(db.weight);
  if (weight === null) {
    console.error("collection-theme.mapper.toCollectionTheme: invalid weight", db.id, db.weight);
    return null;
  }

  return {
    id: db.id,
    collectionId: db.collection_id,
    themeId: db.theme_id,
    weight,
    createdAt: db.created_at,
  };
}

export function toCollectionThemes(rows: DbCollectionTheme[]): CollectionTheme[] {
  const items: CollectionTheme[] = [];
  for (const row of rows) {
    const item = toCollectionTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export function toCollectionThemeWithTheme(db: DbCollectionThemeWithTheme): CollectionThemeWithTheme | null {
  const collectionTheme = toCollectionTheme(db);
  if (!collectionTheme || !db.themes) return null;

  const theme = toTheme(db.themes);
  if (!theme) return null;

  return { ...collectionTheme, theme };
}

export function toCollectionThemesWithTheme(rows: DbCollectionThemeWithTheme[]): CollectionThemeWithTheme[] {
  const items: CollectionThemeWithTheme[] = [];
  for (const row of rows) {
    const item = toCollectionThemeWithTheme(row);
    if (item) items.push(item);
  }
  return items;
}

export type DbCollectionWithRiddleCountAndThemes = DbCollectionWithRiddleCount & {
  collection_themes: DbCollectionThemeWithTheme[] | null;
};

export function takeTopCollectionThemesWithTheme(
  rows: DbCollectionThemeWithTheme[] | null | undefined,
  limit = DEFAULT_TOP_COLLECTION_THEME_COUNT,
): CollectionThemeWithTheme[] {
  const items = toCollectionThemesWithTheme(rows ?? []);
  items.sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.createdAt.localeCompare(b.createdAt);
  });
  return items.slice(0, limit);
}

export function toCollectionWithRiddleCountAndThemes(
  db: DbCollectionWithRiddleCountAndThemes,
  topThemeLimit = DEFAULT_TOP_COLLECTION_THEME_COUNT,
): CollectionWithRiddleCountAndThemes {
  return {
    ...toCollectionWithRiddleCount(db),
    themes: takeTopCollectionThemesWithTheme(db.collection_themes, topThemeLimit),
  };
}
