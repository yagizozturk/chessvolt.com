import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CollectionListWithFilters } from "@/features/collection/components/collection-list-with-filters";
import { getMyCustomCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MyCollectionsPage() {
  const { user, supabase } = await getAuthenticatedUser();
  const collections = await getMyCustomCollectionsWithRiddleCountAndThemes(supabase, user.id);

  const createButton = (
    <Button variant="volt" asChild>
      <Link href="/my-collections/create" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create collection
      </Link>
    </Button>
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <CollectionListWithFilters
        collections={collections}
        emptyMessage="You don't have any collections yet."
        toolbar={createButton}
      />
    </div>
  );
}
