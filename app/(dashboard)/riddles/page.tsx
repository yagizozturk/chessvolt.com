import { RiddlesListWithFilter } from "@/features/riddle/components/riddles-list-with-filter";
import { DEFAULT_RIDDLES_LIST_FILTERS } from "@/features/riddle/constants/riddles-list.constants";
import { getRandomRiddlesForDisplay } from "@/features/riddle/services/riddle-list.service";
import { getAllThemes } from "@/features/theme/services/theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

export default async function RiddlesPage() {
  const { supabase } = await getPublicUser();
  const themes = (await getAllThemes(supabase)).filter((theme) => theme.isActive);
  const initialItems = await getRandomRiddlesForDisplay(supabase, DEFAULT_RIDDLES_LIST_FILTERS);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Riddles</h1>
        <p className="text-muted-foreground">Pick a theme to discover random riddles.</p>
      </div>
      <RiddlesListWithFilter themes={themes} initialItems={initialItems} />
    </div>
  );
}
