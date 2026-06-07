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
    filterState,
    themeOptions,
    filteredCollections,
    hasActiveFilters,
    setSearchQuery,
    setDifficultyBand,
    setThemeSlug,
    clearFilters,
  } = useCollectionFilters(collections);

  if (collections.length === 0) {
    return (
      <div className={className}>
        <EmptyDataMessage message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <CollectionFilters
        themeOptions={themeOptions}
        searchQuery={filterState.searchQuery}
        difficultyBand={filterState.difficultyBand}
        themeSlug={filterState.themeSlug}
        onSearchQueryChange={setSearchQuery}
        onDifficultyBandChange={setDifficultyBand}
        onThemeSlugChange={setThemeSlug}
        onClear={hasActiveFilters ? clearFilters : undefined}
      />

      {filteredCollections.length === 0 ? (
        <EmptyDataMessage message={noResultsMessage} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
