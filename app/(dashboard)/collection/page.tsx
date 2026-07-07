import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { CollectionCard } from "@/features/collection/components/collection-card";
import { CollectionFilters } from "@/features/collection/components/collection-filters";
import { getActiveCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import {
  filterCollections,
  getThemeFilterOptions,
  hasActiveCollectionFilters,
  parseCollectionFilterStateFromSearchParams,
} from "@/features/collection/utilities/collection-filter.utils";
import { getPublicUser } from "@/lib/supabase/auth";

type SearchParams = Promise<{ q?: string; difficulty?: string; theme?: string }>;

export default async function CollectionPage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await getPublicUser();
  const params = await searchParams;

  const collections = await getActiveCollectionsWithRiddleCountAndThemes(supabase);
  const filterState = parseCollectionFilterStateFromSearchParams(params);
  const themeOptions = getThemeFilterOptions(collections);
  const filteredCollections = filterCollections(collections, filterState);
  const hasActiveFilters = hasActiveCollectionFilters(filterState);

  return (
    <div className="page-container">
      <div className="page-container-list-layout">
        <PageHeader
          title="Collections"
          description="Explore curated riddle collections."
          actions={
            collections.length > 0 ? (
              <CollectionFilters
                themeOptions={themeOptions}
                searchQuery={filterState.searchQuery}
                difficultyFilter={filterState.difficultyFilter}
                themeFilter={filterState.themeFilter}
                hasActiveFilters={hasActiveFilters}
              />
            ) : undefined
          }
        />

        {collections.length === 0 ? (
          <EmptyDataMessage message="No collections available yet." />
        ) : filteredCollections.length === 0 ? (
          <EmptyDataMessage message="No collections match your filters." />
        ) : (
          <div className="page-container-grid-data-layout">
            {filteredCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
