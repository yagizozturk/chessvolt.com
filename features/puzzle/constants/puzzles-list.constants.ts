export const PUZZLES_THEME_FILTER_ALL = "all";

export type AttemptedPuzzlesSortBy = "lastPlayed" | "accuracy";

export const DEFAULT_ATTEMPTED_PUZZLES_SORT: AttemptedPuzzlesSortBy = "lastPlayed";

export const ATTEMPTED_PUZZLES_SORT_OPTIONS: { value: AttemptedPuzzlesSortBy; label: string }[] = [
  { value: "lastPlayed", label: "Last played" },
  { value: "accuracy", label: "Accuracy" },
];
