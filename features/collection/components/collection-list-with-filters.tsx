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
  title?: string;
  description?: string;
  className?: string;
};

export function CollectionListWithFilters({
  collections,
  emptyMessage,
  noResultsMessage = "No collections match your filters.",
  title = "Collections",
  description = "Explore curated riddle collections.",
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

  const header = (
    <div className="flex flex-col gap-4 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {collections.length > 0 && (
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
      )}
    </div>
  );

  if (collections.length === 0) {
    return (
      <div className={cn("flex flex-col gap-8", className)}>
        {header}
        <EmptyDataMessage message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {header}

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
