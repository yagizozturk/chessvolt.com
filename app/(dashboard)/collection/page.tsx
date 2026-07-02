import { CollectionListWithFilters } from "@/features/collection/components/collection-list-with-filters";
import { getActiveCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function CollectionPage() {
  const { supabase } = await getPublicUser();
  const collections = await getActiveCollectionsWithRiddleCountAndThemes(supabase);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10">
      <CollectionListWithFilters collections={collections} emptyMessage="No collections available yet." />
    </div>
  );
}
