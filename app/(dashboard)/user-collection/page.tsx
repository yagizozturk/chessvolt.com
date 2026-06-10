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
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <UserCollectionList userCollections={userCollections} />
    </div>
  );
}
