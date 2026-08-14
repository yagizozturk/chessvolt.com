import PuzzleController from "@/features/puzzle/components/puzzle-controller";
import { loadThemePuzzlePage } from "@/features/puzzle/loaders/theme-puzzle-page.loader";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function ThemePuzzlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  const puzzleData = await loadThemePuzzlePage({
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
      theme={puzzleData.theme}
    />
  );
}
