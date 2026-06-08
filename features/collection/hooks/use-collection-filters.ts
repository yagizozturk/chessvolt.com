"use client";

import { useCallback, useMemo, useState } from "react";

import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import {
  type CollectionDifficultyOptions,
  type CollectionFilterState,
  filterCollections,
  getThemeFilterOptions,
  hasActiveCollectionFilters,
} from "@/features/collection/utilities/collection-filter.utils";

/** Client-side filter state for a collection list. Filtering logic lives in `collection-filter.utils`. */
export function useCollectionFilters(collections: CollectionWithRiddleCountAndThemes[]) {
  // "All" means no filter for difficulty and theme
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<CollectionDifficultyOptions>("All");
  const [themeFilter, setThemeFilter] = useState("all");

  // ============================================================================
  // Without the filterState memo, FE get a new object each render, so React would treat
  // the dependency as changed even when searchQuery, difficultyFilter, and themeFilter didn't.
  // ============================================================================
  const collectionFilterState: CollectionFilterState = useMemo(
    () => ({ searchQuery, difficultyFilter, themeFilter }),
    [searchQuery, difficultyFilter, themeFilter],
  );

  // ============================================================================
  // Gets the theme filter options
  // ============================================================================
  const themeOptions = useMemo(() => getThemeFilterOptions(collections), [collections]);

  // ============================================================================
  // Filters the collections
  // ============================================================================
  const filteredCollections = useMemo(
    () => filterCollections(collections, collectionFilterState),
    [collections, collectionFilterState],
  );

  // ============================================================================
  // Checks if there are any active filters
  // ============================================================================
  const hasActiveFilters = hasActiveCollectionFilters(collectionFilterState);

  // ============================================================================
  // Resets to the same defaults used on initial mount
  // ============================================================================
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDifficultyFilter("All");
    setThemeFilter("all");
  }, []);

  return {
    collectionFilterState,
    themeOptions,
    filteredCollections,
    hasActiveFilters,
    setSearchQuery,
    setDifficultyFilter,
    setThemeFilter,
    clearFilters,
  };
}
