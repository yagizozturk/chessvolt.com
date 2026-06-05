"use client";

import { useMemo, useState } from "react";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { CollectionCard } from "@/features/collection/components/collection-card";
import { CollectionFilters } from "@/features/collection/components/collection-filters";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import {
  type CollectionDifficultyBand,
  filterCollections,
  getThemeFilterOptions,
  hasActiveCollectionFilters,
} from "@/features/collection/utilities/collection-filter.utils";
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
  noResultsMessage = "No collections match your filters.", // TODO: Move to a constants file
  className,
}: CollectionListWithFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyBand, setDifficultyBand] = useState<CollectionDifficultyBand>("all");
  const [themeSlug, setThemeSlug] = useState("all");

  const themeOptions = useMemo(() => getThemeFilterOptions(collections), [collections]);

  const filterState = { searchQuery, difficultyBand, themeSlug };

  const filteredCollections = useMemo(
    () => filterCollections(collections, filterState),
    [collections, searchQuery, difficultyBand, themeSlug],
  );

  const showFilters = collections.length > 0;
  const hasActiveFilters = hasActiveCollectionFilters(filterState);

  if (collections.length === 0) {
    return (
      <div className={className}>
        <EmptyDataMessage message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {showFilters && (
        <CollectionFilters
          themeOptions={themeOptions}
          searchQuery={searchQuery}
          difficultyBand={difficultyBand}
          themeSlug={themeSlug}
          onSearchQueryChange={setSearchQuery}
          onDifficultyBandChange={(value) => setDifficultyBand(value as CollectionDifficultyBand)}
          onThemeSlugChange={setThemeSlug}
          onClear={
            hasActiveFilters
              ? () => {
                  setSearchQuery("");
                  setDifficultyBand("all");
                  setThemeSlug("all");
                }
              : undefined
          }
        />
      )}

      {filteredCollections.length === 0 ? (
        <EmptyDataMessage message={noResultsMessage} />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
