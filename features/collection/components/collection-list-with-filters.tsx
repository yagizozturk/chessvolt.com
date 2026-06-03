"use client";

import { useMemo, useState, type ReactNode } from "react";

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
  toolbar?: ReactNode;
  className?: string;
};

export function CollectionListWithFilters({
  collections,
  emptyMessage,
  noResultsMessage = "No collections match your filters.",
  toolbar,
  className,
}: CollectionListWithFiltersProps) {
  const [difficultyBand, setDifficultyBand] = useState<CollectionDifficultyBand>("all");
  const [themeSlug, setThemeSlug] = useState("all");

  const themeOptions = useMemo(() => getThemeFilterOptions(collections), [collections]);

  const filteredCollections = useMemo(
    () => filterCollections(collections, { difficultyBand, themeSlug }),
    [collections, difficultyBand, themeSlug],
  );

  const showFilters = collections.length > 0;
  const hasActiveFilters = hasActiveCollectionFilters({ difficultyBand, themeSlug });

  if (collections.length === 0) {
    return (
      <div className={className}>
        {toolbar && <div className="mb-6 flex justify-end">{toolbar}</div>}
        <div className="bg-muted/50 rounded-xl px-4 py-8 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className={cn("flex flex-col gap-4", toolbar && "lg:flex-row lg:items-start lg:justify-between")}>
        {showFilters && (
          <CollectionFilters
            themeOptions={themeOptions}
            difficultyBand={difficultyBand}
            themeSlug={themeSlug}
            onDifficultyBandChange={(value) => setDifficultyBand(value as CollectionDifficultyBand)}
            onThemeSlugChange={setThemeSlug}
            onClear={
              hasActiveFilters
                ? () => {
                    setDifficultyBand("all");
                    setThemeSlug("all");
                  }
                : undefined
            }
          />
        )}
        {toolbar && <div className="flex shrink-0 justify-end lg:pt-6">{toolbar}</div>}
      </div>

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
