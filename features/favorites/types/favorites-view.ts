export const FAVORITES_VIEW_VALUES = ["all", "openings", "puzzles"] as const;

export type FavoritesView = (typeof FAVORITES_VIEW_VALUES)[number];

export const DEFAULT_FAVORITES_VIEW: FavoritesView = "all";

export const FAVORITES_VIEW_OPTIONS = [
  { label: "All", value: "all" as const, href: "/volt-tracker" },
  { label: "Openings", value: "openings" as const, href: "/volt-tracker?view=openings" },
  { label: "Puzzles", value: "puzzles" as const, href: "/volt-tracker?view=puzzles" },
] as const;

export function parseFavoritesView(value: string | undefined): FavoritesView {
  if (value && FAVORITES_VIEW_VALUES.includes(value as FavoritesView)) {
    return value as FavoritesView;
  }

  return DEFAULT_FAVORITES_VIEW;
}
