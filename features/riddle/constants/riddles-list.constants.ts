// TODO: Refactor
export const RIDDLES_THEME_FILTER_ALL = "all";
export const RANDOM_RIDDLES_COUNT = 4;

export type AttemptedRiddlesSortBy = "lastPlayed" | "accuracy";

export const DEFAULT_ATTEMPTED_RIDDLES_SORT: AttemptedRiddlesSortBy = "lastPlayed";

export const ATTEMPTED_RIDDLES_SORT_OPTIONS: { value: AttemptedRiddlesSortBy; label: string }[] = [
  { value: "lastPlayed", label: "Last played" },
  { value: "accuracy", label: "Accuracy" },
];
