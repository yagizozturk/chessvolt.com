import {
  ATTEMPTED_PUZZLES_SORT_OPTIONS,
  DEFAULT_ATTEMPTED_PUZZLES_SORT,
  PUZZLES_THEME_FILTER_ALL,
  type AttemptedPuzzlesSortBy,
} from "@/features/puzzle/constants/puzzles-list.constants";

export type PuzzlesFilterState = {
  themeFilter: string;
  sortBy: AttemptedPuzzlesSortBy;
};

const PUZZLES_PAGE_PATH = "/puzzles";

export function parsePuzzlesFilterStateFromSearchParams(params: {
  theme?: string;
  sort?: string;
}): PuzzlesFilterState {
  const themeFilter = params.theme?.trim() || PUZZLES_THEME_FILTER_ALL;
  const sortParam = params.sort?.trim() ?? "";
  const sortBy = ATTEMPTED_PUZZLES_SORT_OPTIONS.some((option) => option.value === sortParam)
    ? (sortParam as AttemptedPuzzlesSortBy)
    : DEFAULT_ATTEMPTED_PUZZLES_SORT;

  return { themeFilter, sortBy };
}

export function hasActivePuzzlesFilters(filters: PuzzlesFilterState): boolean {
  return filters.themeFilter !== PUZZLES_THEME_FILTER_ALL || filters.sortBy !== DEFAULT_ATTEMPTED_PUZZLES_SORT;
}

export function buildPuzzlesFilterHref(current: PuzzlesFilterState, next: Partial<PuzzlesFilterState>): string {
  const merged: PuzzlesFilterState = {
    themeFilter: next.themeFilter ?? current.themeFilter,
    sortBy: next.sortBy ?? current.sortBy,
  };

  const searchParams = new URLSearchParams();
  const theme = merged.themeFilter.trim();

  if (theme && theme !== PUZZLES_THEME_FILTER_ALL) searchParams.set("theme", theme);
  if (merged.sortBy !== DEFAULT_ATTEMPTED_PUZZLES_SORT) searchParams.set("sort", merged.sortBy);

  const query = searchParams.toString();
  return query ? `${PUZZLES_PAGE_PATH}?${query}` : PUZZLES_PAGE_PATH;
}
