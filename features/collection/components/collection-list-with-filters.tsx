"use client";

import { useMemo, useState } from "react";

import { CollectionCard } from "@/features/collection/components/collection-card";
import { CollectionFilters } from "@/features/collection/components/collection-filters";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import {
  filterCollections,
  getThemeFilterOptions,
  hasActiveCollectionFilters,
  type CollectionDifficultyBand,
} from "@/features/collection/utils/collection-filter.utils";
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
        <div className="bg-muted/50 rounded-xl px-4 py-8 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
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

      {hasActiveFilters && (
        <p className="text-muted-foreground text-xs">
          Showing {filteredCollections.length} of {collections.length} collections
        </p>
      )}

      {filteredCollections.length === 0 ? (
        <div className="bg-muted/50 rounded-xl px-4 py-8 text-center">
          <p className="text-muted-foreground">{noResultsMessage}</p>
        </div>
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
