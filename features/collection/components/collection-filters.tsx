"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  COLLECTION_DIFFICULTY_OPTIONS,
  type CollectionDifficultyOptions,
} from "@/features/collection/utilities/collection-filter.utils";
import type { Theme } from "@/features/theme/types/theme";

type CollectionFiltersProps = {
  themeOptions: Theme[];
  searchQuery: string;
  difficultyFilter: CollectionDifficultyOptions;
  themeFilter: string;
  onSearchQueryChange: (value: string) => void;
  onDifficultyFilterChange: (value: CollectionDifficultyOptions) => void;
  onThemeFilterChange: (value: string) => void;
  onClear?: () => void;
};

export function CollectionFilters({
  themeOptions,
  searchQuery,
  difficultyFilter,
  themeFilter,
  onSearchQueryChange,
  onDifficultyFilterChange,
  onThemeFilterChange,
  onClear,
}: CollectionFiltersProps) {
  return (
    <div className="bg-muted/50 flex w-full flex-col gap-3 rounded-xl p-4 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Search input */}
      <div className="min-w-0 flex-1 sm:min-w-[12rem] sm:basis-full lg:max-w-sm lg:basis-auto">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search collections..."
          aria-label="Search collections"
        />
      </div>
      {/* Difficulty filter */}
      <div className="min-w-0 flex-1 sm:max-w-56">
        <Select value={difficultyFilter} onValueChange={onDifficultyFilterChange}>
          <SelectTrigger
            id="collection-difficulty"
            className="w-full rounded-xl border-2"
            aria-label="Filter by difficulty"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {COLLECTION_DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* Theme filter */}
      <div className="min-w-0 flex-1 sm:max-w-64">
        <Select value={themeFilter} onValueChange={onThemeFilterChange} disabled={themeOptions.length === 0}>
          <SelectTrigger id="collection-theme" className="w-full rounded-xl border-2" aria-label="Filter by theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All themes</SelectItem>
              {themeOptions.map((theme) => (
                <SelectItem key={theme.slug} value={theme.slug}>
                  {theme.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* Clear filters button */}
      {onClear && (
        <div className="-mt-1 flex justify-end sm:ml-auto">
          <Button type="button" variant="volt" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
