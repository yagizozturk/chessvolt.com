"use client";

import { useCallback, useMemo, useState } from "react";

import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import {
  type CollectionDifficultyBand,
  type CollectionFilterState,
  filterCollections,
  getThemeFilterOptions,
  hasActiveCollectionFilters,
} from "@/features/collection/utilities/collection-filter.utils";

export function useCollectionFilters(collections: CollectionWithRiddleCountAndThemes[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyBand, setDifficultyBand] = useState<CollectionDifficultyBand>("all");
  const [themeSlug, setThemeSlug] = useState("all");

  const filterState: CollectionFilterState = useMemo(
    () => ({ searchQuery, difficultyBand, themeSlug }),
    [searchQuery, difficultyBand, themeSlug],
  );

  const themeOptions = useMemo(() => getThemeFilterOptions(collections), [collections]);

  const filteredCollections = useMemo(
    () => filterCollections(collections, filterState),
    [collections, filterState],
  );

  const hasActiveFilters = hasActiveCollectionFilters(filterState);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDifficultyBand("all");
    setThemeSlug("all");
  }, []);

  return {
    filterState,
    themeOptions,
    filteredCollections,
    hasActiveFilters,
    setSearchQuery,
    setDifficultyBand,
    setThemeSlug,
    clearFilters,
  };
}
