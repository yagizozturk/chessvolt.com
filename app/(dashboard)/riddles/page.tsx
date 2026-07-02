import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { RiddlesListWithFilter } from "@/features/riddle/components/riddles-list-with-filter";
import { getUserAttemptedRiddlesForDisplay } from "@/features/riddle/services/riddle-list.service";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function RiddlesPage() {
  const { user, supabase } = await getPublicUser();
  const themes = (await getAllThemes(supabase)).filter((theme) => theme.isActive);

  // ================================================================================================
  // Performance note
  // Early return for guests prevents fetching attempted riddles below, (getUserAttemptedRiddlesForDisplay)
  // so the header markup is intentionally duplicated across both branches.
  // ================================================================================================
  if (!user) {
    return (
      <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
        <div className="mb-6 flex flex-col gap-2 bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)]">
          <h1 className="text-3xl font-bold">Your riddles</h1>
          <p className="text-muted-foreground">Riddles you've tried to solve.</p>
        </div>
        <EmptyDataMessage message="Sign in to see riddles you've tried." />
      </div>
    );
  }

  const initialItems = await getUserAttemptedRiddlesForDisplay(supabase, user.id);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <div className="mb-6 flex flex-col gap-2 rounded-xl bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)] p-6">
        <h1 className="text-3xl font-bold">Your riddles</h1>
        <p className="text-muted-foreground">Riddles you've tried to solve.</p>
      </div>
      <RiddlesListWithFilter themes={themes} initialItems={initialItems} />
    </div>
  );
}
