"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ATTEMPTED_PUZZLES_SORT_OPTIONS,
  type AttemptedPuzzlesSortBy,
  PUZZLES_THEME_FILTER_ALL,
} from "@/features/puzzle/constants/puzzles-list.constants";
import { type PuzzlesFilterState, buildPuzzlesFilterHref } from "@/features/puzzle/utilities/puzzle-filter.utils";
import type { Theme } from "@/features/theme/types/theme";

type PuzzlesFiltersProps = {
  themes: Theme[];
  themeFilter: string;
  sortBy: AttemptedPuzzlesSortBy;
  hasActiveFilters: boolean;
};

export function PuzzlesFilters({ themes, themeFilter, sortBy, hasActiveFilters }: PuzzlesFiltersProps) {
  const router = useRouter();

  const currentFilterState: PuzzlesFilterState = {
    themeFilter,
    sortBy,
  };

  return (
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
      <div className="min-w-0 sm:max-w-64">
        <Select
          value={themeFilter}
          onValueChange={(value) => router.push(buildPuzzlesFilterHref(currentFilterState, { themeFilter: value }))}
          disabled={themes.length === 0}
        >
          <SelectTrigger
            id="puzzles-theme"
            className="bg-background w-full rounded-xl border-2"
            aria-label="Filter by theme"
          >
            <SelectValue placeholder="All themes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={PUZZLES_THEME_FILTER_ALL}>All themes</SelectItem>
              {themes.map((theme) => (
                <SelectItem key={theme.slug} value={theme.slug}>
                  {theme.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-0 lg:ml-auto lg:max-w-64">
        <Select
          value={sortBy}
          onValueChange={(value) =>
            router.push(buildPuzzlesFilterHref(currentFilterState, { sortBy: value as AttemptedPuzzlesSortBy }))
          }
        >
          <SelectTrigger
            id="puzzles-sort"
            className="bg-background w-full rounded-xl border-2"
            aria-label="Sort puzzles"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ATTEMPTED_PUZZLES_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button type="button" variant="volt" size="sm" onClick={() => router.push("/puzzles")}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
