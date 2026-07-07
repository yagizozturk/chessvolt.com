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
      <CollectionListWithFilters collections={collections} emptyMessage="No collections available yet." />
    </div>
  );
}
