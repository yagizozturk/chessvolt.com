import { RiddlesListWithFilter } from "@/features/riddle/components/riddles-list-with-filter";
import { getUserAttemptedRiddlesForDisplay } from "@/features/riddle/services/riddle-list.service";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function RiddlesPage() {
  const { user, supabase } = await getPublicUser();
  const themes = (await getAllThemes(supabase)).filter((theme) => theme.isActive);
  const initialItems = user ? await getUserAttemptedRiddlesForDisplay(supabase, user.id) : [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <RiddlesListWithFilter
        themes={themes}
        initialItems={initialItems}
        showFilters={!!user}
        emptyMessage={
          user ? "You haven't completed or failed any riddles yet." : "Sign in to see riddles you've tried."
        }
      />
    </div>
  );
}
