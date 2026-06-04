import { MyCollectionsTabs } from "@/features/collection/components/my-collections-tabs";
import { getMyCustomCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getUserPracticeOpeningVariantsForUserWithDetails } from "@/features/user-practice-opening-variant/services/user-practice-opening-variant.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MyCollectionsPage() {
  const { user, supabase } = await getAuthenticatedUser();
  const [collections, practiceVariants] = await Promise.all([
    getMyCustomCollectionsWithRiddleCountAndThemes(supabase, user.id),
    getUserPracticeOpeningVariantsForUserWithDetails(supabase, user.id, { activeOnly: true }),
  ]);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <MyCollectionsTabs collections={collections} practiceVariants={practiceVariants} />
    </div>
  );
}
