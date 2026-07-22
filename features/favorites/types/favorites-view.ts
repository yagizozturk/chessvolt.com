export const FAVORITES_VIEW_VALUES = ["openings", "riddles"] as const;

export type FavoritesView = (typeof FAVORITES_VIEW_VALUES)[number];

export const DEFAULT_FAVORITES_VIEW: FavoritesView = "openings";

export const FAVORITES_VIEW_OPTIONS = [
  { label: "Opening variants", value: "openings" as const, href: "/favorites?view=openings" },
  { label: "Riddles", value: "riddles" as const, href: "/favorites?view=riddles" },
] as const;

export function parseFavoritesView(value: string | undefined): FavoritesView {
  if (value && FAVORITES_VIEW_VALUES.includes(value as FavoritesView)) {
    return value as FavoritesView;
  }

  return DEFAULT_FAVORITES_VIEW;
}
