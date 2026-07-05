"use client";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { CollectionCard } from "@/features/collection/components/collection-card";
import { CollectionFilters } from "@/features/collection/components/collection-filters";
import { useCollectionFilters } from "@/features/collection/hooks/use-collection-filters";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { cn } from "@/lib/utils";

type CollectionListWithFiltersProps = {
  collections: CollectionWithRiddleCountAndThemes[];
  emptyMessage: string;
  noResultsMessage?: string;
  className?: string;
};

export function CollectionListWithFilters({
  collections,
  emptyMessage,
  noResultsMessage = "No collections match your filters.",
  className,
}: CollectionListWithFiltersProps) {
  const {
    collectionFilterState,
    themeOptions,
    filteredCollections,
    hasActiveFilters,
    setSearchQuery,
    setDifficultyFilter,
    setThemeFilter,
    clearFilters,
  } = useCollectionFilters(collections);

  if (collections.length === 0) {
    return (
      <div className={cn("flex flex-col gap-8", className)}>
        <EmptyDataMessage message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <CollectionFilters
        themeOptions={themeOptions}
        searchQuery={collectionFilterState.searchQuery}
        difficultyFilter={collectionFilterState.difficultyFilter}
        themeFilter={collectionFilterState.themeFilter}
        onSearchQueryChange={setSearchQuery}
        onDifficultyFilterChange={setDifficultyFilter}
        onThemeFilterChange={setThemeFilter}
        onClear={hasActiveFilters ? clearFilters : undefined}
      />

      {filteredCollections.length === 0 ? (
        <EmptyDataMessage message={noResultsMessage} />
      ) : (
        <div className="page-container-grid-data-layout">
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
