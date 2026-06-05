"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COLLECTION_DIFFICULTY_BAND_OPTIONS } from "@/features/collection/utilities/collection-filter.utils";
import type { Theme } from "@/features/theme/types/theme";

const selectClassName =
  "border-input focus-visible:ring-primary/50 h-9 w-full rounded-xl border-2 bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-3";

type CollectionFiltersProps = {
  themeOptions: Theme[];
  searchQuery: string;
  difficultyBand: string;
  themeSlug: string;
  onSearchQueryChange: (value: string) => void;
  onDifficultyBandChange: (value: string) => void;
  onThemeSlugChange: (value: string) => void;
  onClear?: () => void;
};

export function CollectionFilters({
  themeOptions,
  searchQuery,
  difficultyBand,
  themeSlug,
  onSearchQueryChange,
  onDifficultyBandChange,
  onThemeSlugChange,
  onClear,
}: CollectionFiltersProps) {
  return (
    <div className="bg-muted/50 flex w-full flex-col gap-3 rounded-xl p-4 md:flex-row md:flex-wrap md:items-end">
      <div className="flex min-w-0 flex-1 md:min-w-[12rem] md:basis-full lg:max-w-sm lg:basis-auto">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search collections..."
          aria-label="Search collections"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 md:max-w-56">
        <label htmlFor="collection-difficulty" className="text-muted-foreground text-xs font-medium">
          Difficulty
        </label>
        <select
          id="collection-difficulty"
          value={difficultyBand}
          onChange={(e) => onDifficultyBandChange(e.target.value)}
          aria-label="Filter by difficulty"
          className={selectClassName}
        >
          {COLLECTION_DIFFICULTY_BAND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 md:max-w-64">
        <label htmlFor="collection-theme" className="text-muted-foreground text-xs font-medium">
          Theme
        </label>
        <select
          id="collection-theme"
          value={themeSlug}
          onChange={(e) => onThemeSlugChange(e.target.value)}
          aria-label="Filter by theme"
          className={selectClassName}
          disabled={themeOptions.length === 0}
        >
          <option value="all">All themes</option>
          {themeOptions.map((theme) => (
            <option key={theme.slug} value={theme.slug}>
              {theme.title}
            </option>
          ))}
        </select>
      </div>

      {onClear && (
        <div className="flex justify-end md:ml-auto">
          <Button type="button" variant="outline" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
