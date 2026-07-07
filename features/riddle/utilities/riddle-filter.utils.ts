import {
  ATTEMPTED_RIDDLES_SORT_OPTIONS,
  DEFAULT_ATTEMPTED_RIDDLES_SORT,
  RIDDLES_THEME_FILTER_ALL,
  type AttemptedRiddlesSortBy,
} from "@/features/riddle/constants/riddles-list.constants";

export type RiddlesFilterState = {
  themeFilter: string;
  sortBy: AttemptedRiddlesSortBy;
};

const RIDDLES_PAGE_PATH = "/riddles";

export function parseRiddlesFilterStateFromSearchParams(params: {
  theme?: string;
  sort?: string;
}): RiddlesFilterState {
  const themeFilter = params.theme?.trim() || RIDDLES_THEME_FILTER_ALL;
  const sortParam = params.sort?.trim() ?? "";
  const sortBy = ATTEMPTED_RIDDLES_SORT_OPTIONS.some((option) => option.value === sortParam)
    ? (sortParam as AttemptedRiddlesSortBy)
    : DEFAULT_ATTEMPTED_RIDDLES_SORT;

  return { themeFilter, sortBy };
}

export function hasActiveRiddlesFilters(filters: RiddlesFilterState): boolean {
  return filters.themeFilter !== RIDDLES_THEME_FILTER_ALL || filters.sortBy !== DEFAULT_ATTEMPTED_RIDDLES_SORT;
}

export function buildRiddlesFilterHref(current: RiddlesFilterState, next: Partial<RiddlesFilterState>): string {
  const merged: RiddlesFilterState = {
    themeFilter: next.themeFilter ?? current.themeFilter,
    sortBy: next.sortBy ?? current.sortBy,
  };

  const searchParams = new URLSearchParams();
  const theme = merged.themeFilter.trim();

  if (theme && theme !== RIDDLES_THEME_FILTER_ALL) searchParams.set("theme", theme);
  if (merged.sortBy !== DEFAULT_ATTEMPTED_RIDDLES_SORT) searchParams.set("sort", merged.sortBy);

  const query = searchParams.toString();
  return query ? `${RIDDLES_PAGE_PATH}?${query}` : RIDDLES_PAGE_PATH;
}
