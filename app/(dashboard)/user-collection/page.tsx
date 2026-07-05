import { PageHeader } from "@/components/page-header";
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
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Your collections"
          description="Collections you've created to organize your riddles."
        />
        {/* First-visit auto-open only; skipped once localStorage marks the intro as seen. */}
        <VoltExplainDialogAutoStart />
        <UserCollectionList userCollections={userCollections} />
      </div>
    </div>
  );
}
