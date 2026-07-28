export const FAVORITES_VIEW_VALUES = ["all", "openings", "riddles"] as const;

export type FavoritesView = (typeof FAVORITES_VIEW_VALUES)[number];

export const DEFAULT_FAVORITES_VIEW: FavoritesView = "all";

export const FAVORITES_VIEW_OPTIONS = [
  { label: "All", value: "all" as const, href: "/favorites" },
  { label: "Opening variants", value: "openings" as const, href: "/favorites?view=openings" },
  { label: "Riddles", value: "riddles" as const, href: "/favorites?view=riddles" },
] as const;

export function parseFavoritesView(value: string | undefined): FavoritesView {
  if (value && FAVORITES_VIEW_VALUES.includes(value as FavoritesView)) {
    return value as FavoritesView;
  }

  return DEFAULT_FAVORITES_VIEW;
}
