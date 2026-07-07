"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ATTEMPTED_RIDDLES_SORT_OPTIONS,
  RIDDLES_THEME_FILTER_ALL,
  type AttemptedRiddlesSortBy,
} from "@/features/riddle/constants/riddles-list.constants";
import {
  buildRiddlesFilterHref,
  type RiddlesFilterState,
} from "@/features/riddle/utilities/riddle-filter.utils";
import type { Theme } from "@/features/theme/types/theme";

type RiddlesFiltersProps = {
  themes: Theme[];
  themeFilter: string;
  sortBy: AttemptedRiddlesSortBy;
  hasActiveFilters: boolean;
};

export function RiddlesFilters({ themes, themeFilter, sortBy, hasActiveFilters }: RiddlesFiltersProps) {
  const router = useRouter();

  const currentFilterState: RiddlesFilterState = {
    themeFilter,
    sortBy,
  };

  return (
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
      <div className="min-w-0 sm:max-w-64">
        <Select
          value={themeFilter}
          onValueChange={(value) => router.push(buildRiddlesFilterHref(currentFilterState, { themeFilter: value }))}
          disabled={themes.length === 0}
        >
          <SelectTrigger
            id="riddles-theme"
            className="w-full rounded-xl border-2 bg-background"
            aria-label="Filter by theme"
          >
            <SelectValue placeholder="All themes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={RIDDLES_THEME_FILTER_ALL}>All themes</SelectItem>
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
            router.push(buildRiddlesFilterHref(currentFilterState, { sortBy: value as AttemptedRiddlesSortBy }))
          }
        >
          <SelectTrigger
            id="riddles-sort"
            className="w-full rounded-xl border-2 bg-background"
            aria-label="Sort riddles"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ATTEMPTED_RIDDLES_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button type="button" variant="volt" size="sm" onClick={() => router.push("/riddles")}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
