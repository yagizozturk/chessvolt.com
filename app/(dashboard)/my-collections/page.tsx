import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CollectionCard } from "@/features/collection/components/collection-card";
import { getMyCustomCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MyCollectionsPage() {
  const { user, supabase } = await getAuthenticatedUser();
  const collections = await getMyCustomCollectionsWithRiddleCountAndThemes(supabase, user.id);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <div className="mt-12 flex justify-end">
        <Button variant="volt" asChild>
          <Link href="/my-collections/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create collection
          </Link>
        </Button>
      </div>
      <div className="mt-6">
        {collections.length === 0 && (
          <div className="bg-muted/40 rounded-xl px-4 py-8 text-center">
            <p className="text-muted-foreground">You don&apos;t have any collections yet.</p>
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
