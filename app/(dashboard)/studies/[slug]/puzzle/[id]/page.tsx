import PuzzleController from "@/features/puzzle/components/puzzle-controller";
import { loadStudyPuzzlePage } from "@/features/puzzle/loaders/puzzle-page.loader";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

// ==================================================================
// Getting study puzzle details for a single puzzle
// Creating collage data for PuzzleController
// ==================================================================
export default async function StudyPuzzlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  // ==================================================================
  // Loader request for a single Puzzle and passing data.
  // ==================================================================
  const puzzleData = await loadStudyPuzzlePage({
    supabase,
    user,
    slug,
    puzzleId: id,
  });

  return (
    <PuzzleController
      puzzle={puzzleData.puzzle}
      nextPuzzleUrl={puzzleData.nextPuzzleUrl}
      backUrl={puzzleData.backUrl}
      isUserLoggedIn={puzzleData.isUserLoggedIn}
      isFavorited={puzzleData.isFavorited}
    />
  );
}
