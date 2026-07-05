import { PageHeader } from "@/components/page-header";
import { CollectionListWithFilters } from "@/features/collection/components/collection-list-with-filters";
import { getActiveCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function CollectionPage() {
  const { supabase } = await getPublicUser();

  // ============================================================
  // Load collections from service
  // ============================================================
  const collections = await getActiveCollectionsWithRiddleCountAndThemes(supabase);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader title="Collections" description="Explore curated riddle collections." />
        <CollectionListWithFilters collections={collections} emptyMessage="No collections available yet." />
      </div>
    </div>
  );
}
