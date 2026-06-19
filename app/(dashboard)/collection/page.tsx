import { VoltExplainDialogAutoStart } from "@/components/volt-explain-dialog/volt-explain-dialog-auto-start";
import { CollectionListWithFilters } from "@/features/collection/components/collection-list-with-filters";
import { getActiveCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function CollectionPage() {
  const { supabase } = await getPublicUser();
  const collections = await getActiveCollectionsWithRiddleCountAndThemes(supabase);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      {/* First-visit auto-open only; skipped once localStorage marks the intro as seen. */}
      <VoltExplainDialogAutoStart />
      <CollectionListWithFilters collections={collections} emptyMessage="No collections available yet." />
    </div>
  );
}
