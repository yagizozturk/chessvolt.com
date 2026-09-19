export const FAVORITES_SORT_VALUES = ["newest-first", "oldest-first"] as const;

export type FavoritesSort = (typeof FAVORITES_SORT_VALUES)[number];

export const DEFAULT_FAVORITES_SORT: FavoritesSort = "newest-first";

export const FAVORITES_SORT_OPTIONS = [
  { label: "Newest first", value: "newest-first" as const },
  { label: "Oldest first", value: "oldest-first" as const },
] as const;

export function parseFavoritesSort(value: string | undefined): FavoritesSort {
  if (value && FAVORITES_SORT_VALUES.includes(value as FavoritesSort)) {
    return value as FavoritesSort;
  }

  return DEFAULT_FAVORITES_SORT;
}
