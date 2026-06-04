import { Plus } from "lucide-react";
import Link from "next/link";

import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Button } from "@/components/ui/button";
import { CollectionCard } from "@/features/collection/components/collection-card";
import { getMyCustomCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MyCollectionsPage() {
  const { user, supabase } = await getAuthenticatedUser();
  const collections = await getMyCustomCollectionsWithRiddleCountAndThemes(supabase, user.id);

  return (
    <>
      <div className="container mx-auto flex max-w-5xl justify-end px-4 pt-6">
        <Button variant="volt" asChild>
          <Link href="/my-collections/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create collection
          </Link>
        </Button>
      </div>
      <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
        {collections.length === 0 ? (
          <EmptyDataMessage message="You don't have any collections yet." />
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
