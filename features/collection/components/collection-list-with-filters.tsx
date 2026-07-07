"use client";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { CollectionCard } from "@/features/collection/components/collection-card";
import { CollectionFilters } from "@/features/collection/components/collection-filters";
import { useCollectionFilters } from "@/features/collection/hooks/use-collection-filters";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";

type CollectionListWithFiltersProps = {
  collections: CollectionWithRiddleCountAndThemes[];
  emptyMessage: string;
  noResultsMessage?: string;
  title?: string;
  description?: string;
};

export function CollectionListWithFilters({
  collections,
  emptyMessage,
  noResultsMessage = "No collections match your filters.",
  title = "Collections",
  description = "Explore curated riddle collections.",
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

  return (
    <div className="page-container-list-layout">
      <PageHeader
        title={title}
        description={description}
        actions={
          collections.length > 0 ? (
            <CollectionFilters
              variant="inline"
              themeOptions={themeOptions}
              searchQuery={collectionFilterState.searchQuery}
              difficultyFilter={collectionFilterState.difficultyFilter}
              themeFilter={collectionFilterState.themeFilter}
              onSearchQueryChange={setSearchQuery}
              onDifficultyFilterChange={setDifficultyFilter}
              onThemeFilterChange={setThemeFilter}
              onClear={hasActiveFilters ? clearFilters : undefined}
            />
          ) : undefined
        }
      />

      {collections.length === 0 ? (
        <EmptyDataMessage message={emptyMessage} />
      ) : filteredCollections.length === 0 ? (
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
