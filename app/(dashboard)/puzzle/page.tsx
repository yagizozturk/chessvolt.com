import { getNextPuzzleForUser } from "@/features/puzzle/services/puzzle";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

export default async function PuzzlePage() {
  const { user, supabase } = await getAuthenticatedUser();
  const nextPuzzle = await getNextPuzzleForUser(supabase, user.id);

  if (!nextPuzzle) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          You have solved all available puzzles. 🎉
        </p>
      </div>
    );
  }

  redirect(`/puzzle/${nextPuzzle.id}`);
}
