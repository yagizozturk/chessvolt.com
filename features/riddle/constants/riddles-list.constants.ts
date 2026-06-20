import type { RiddleRatingBand } from "@/features/riddle/types/riddle-rating";

export const RANDOM_RIDDLES_COUNT = 4;
export const RIDDLES_THEME_FILTER_ALL = "all";

export type RiddlesListFilters = {
  themeSlug: string;
  ratingBand: RiddleRatingBand;
};

export const DEFAULT_RIDDLES_LIST_FILTERS: RiddlesListFilters = {
  themeSlug: RIDDLES_THEME_FILTER_ALL,
  ratingBand: "all",
};
