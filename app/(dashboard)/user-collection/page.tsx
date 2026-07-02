import { VoltExplainDialogAutoStart } from "@/components/volt-explain-dialog/volt-explain-dialog-auto-start";
import { getUserCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { UserCollectionList } from "@/features/user-collection/components/user-collection-list";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function UserCollectionPage() {
  const { user, supabase } = await getAuthenticatedUser();

  // ================================================================================================
  // Getting user collections with riddle count and themes
  // ================================================================================================
  const userCollections = await getUserCollectionsWithRiddleCountAndThemes(supabase, user.id);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Your collections</h1>
            <p className="text-muted-foreground">Collections you've created to organize your riddles.</p>
          </div>
        </div>
        {/* First-visit auto-open only; skipped once localStorage marks the intro as seen. */}
        <VoltExplainDialogAutoStart />
        <UserCollectionList userCollections={userCollections} />
      </div>
    </div>
  );
}
