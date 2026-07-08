"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  buildCollectionFilterHref,
  COLLECTION_DIFFICULTY_OPTIONS,
  type CollectionDifficultyOptions,
  type CollectionFilterState,
} from "@/features/collection/utilities/collection-filter.utils";
import type { Theme } from "@/features/theme/types/theme";

type CollectionFiltersProps = {
  themeOptions: Theme[];
  searchQuery: string;
  difficultyFilter: CollectionDifficultyOptions;
  themeFilter: string;
  hasActiveFilters: boolean;
};

export function CollectionFilters({
  themeOptions,
  searchQuery,
  difficultyFilter,
  themeFilter,
  hasActiveFilters,
}: CollectionFiltersProps) {
  const router = useRouter();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const currentFilterState: CollectionFilterState = {
    searchQuery,
    difficultyFilter,
    themeFilter,
  };

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (localSearchQuery.trim() === searchQuery.trim()) return;

    const timeoutId = window.setTimeout(() => {
      router.push(buildCollectionFilterHref(currentFilterState, { searchQuery: localSearchQuery }));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [localSearchQuery, searchQuery, difficultyFilter, themeFilter, router]);

  return (
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
      <div className="min-w-0 sm:max-w-56">
        <Select
          value={difficultyFilter}
          onValueChange={(value) =>
            router.push(buildCollectionFilterHref(currentFilterState, { difficultyFilter: value as CollectionDifficultyOptions }))
          }
        >
          <SelectTrigger
            id="collection-difficulty"
            className="w-full rounded-xl border-2 bg-background"
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
      <div className="min-w-0 sm:max-w-64">
        <Select
          value={themeFilter}
          onValueChange={(value) => router.push(buildCollectionFilterHref(currentFilterState, { themeFilter: value }))}
          disabled={themeOptions.length === 0}
        >
          <SelectTrigger
            id="collection-theme"
            className="w-full rounded-xl border-2 bg-background"
            aria-label="Filter by theme"
          >
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
      <div className="min-w-0 lg:ml-auto lg:max-w-xs lg:flex-1">
        <Input
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          placeholder="Search collections..."
          aria-label="Search collections"
          className="bg-background"
        />
      </div>
      {hasActiveFilters && (
        <Button type="button" variant="volt" size="sm" onClick={() => router.push("/collection")}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
