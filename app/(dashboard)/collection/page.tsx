import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { VoltExplainDialogAutoStart } from "@/components/volt-explain-dialog/volt-explain-dialog-auto-start";
import { CollectionCard } from "@/features/collection/components/collection-card";
import { CollectionFilters } from "@/features/collection/components/collection-filters";
import { getActiveCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import {
  filterCollections,
  getThemeFilterOptions,
  hasActiveCollectionFilters,
  parseCollectionFilterStateFromUrl,
} from "@/features/collection/utilities/collection-filter.utils";
import { getPublicUser } from "@/lib/supabase/auth";

type SearchParams = Promise<{ q?: string; difficulty?: string; theme?: string }>;

export default async function CollectionPage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await getPublicUser();
  const params = await searchParams;

  // ========================================================================
  // Get active collections with riddle count and themes
  // ========================================================================
  const collections = await getActiveCollectionsWithRiddleCountAndThemes(supabase);

  // ========================================================================
  // Parse collection filter state from theme filter, difficulty filter and
  // search textbox params
  // ========================================================================
  const filterState = parseCollectionFilterStateFromUrl(params);

  // ========================================================================
  // Get theme filter options. If collections dont have a theme,
  // theme will not appear
  // ========================================================================
  const themeOptions = getThemeFilterOptions(collections);

  // ========================================================================
  // Filter collections based on filter state
  // ========================================================================
  const filteredCollections = filterCollections(collections, filterState);

  // ========================================================================
  // Check if there are active filters. This is for to show or hide
  // "Clear Filters" button. If there are any active filter, user can clear
  // ========================================================================
  const hasActiveFilters = hasActiveCollectionFilters(filterState);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* === START Page header === */}
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

        <VoltExplainDialogAutoStart />

        {/* === START Collections list === */}
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
