import { CollectionListWithFilters } from "@/features/collection/components/collection-list-with-filters";
import { getActiveCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function CollectionPage() {
  const { supabase } = await getPublicUser();
  const collections = await getActiveCollectionsWithRiddleCountAndThemes(supabase);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <div className="mb-6 flex flex-col gap-2 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6">
        <h1 className="text-3xl font-bold">Collections</h1>
        <p className="text-muted-foreground">Explore curated riddle collections.</p>
      </div>
      <CollectionListWithFilters collections={collections} emptyMessage="No collections available yet." />
    </div>
  );
}
