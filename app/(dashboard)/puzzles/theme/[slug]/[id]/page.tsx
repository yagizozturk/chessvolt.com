import PuzzleController from "@/features/puzzle/components/puzzle-controller";
import { loadThemePuzzlePage } from "@/features/puzzle/loaders/theme-puzzle-page.loader";
import { getPublicUser } from "@/lib/supabase/auth";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

// ================================================================================================
// Metadata of the page
// ================================================================================================
export const metadata: Metadata = {
  title: "Puzzle",
  description: "Your ChessVolt puzzle for studying and practicing.",
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
