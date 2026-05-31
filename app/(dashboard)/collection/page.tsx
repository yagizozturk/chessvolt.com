import { CollectionCard } from "@/features/collection/components/collection-card";
import { getActiveCollectionsWithRiddleCount } from "@/features/collection/services/collection.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function CollectionPage() {
  const { supabase } = await getPublicUser();
  const collections = await getActiveCollectionsWithRiddleCount(supabase);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <div className="mt-12">
        {collections.length === 0 && (
          <div className="bg-muted/40 rounded-xl px-4 py-8 text-center">
            <p className="text-muted-foreground">No collections available yet.</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
}
