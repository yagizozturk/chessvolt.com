import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state/empty-state";
import { PageHeader } from "@/components/page-header/page-header";
import PuzzleController from "@/features/puzzle/components/puzzle-controller";
import { loadPuzzlePage } from "@/features/puzzle/loaders/puzzle-page.loader";
import { getRandomActivePuzzleId } from "@/features/puzzle/services/puzzle.service";
import { getPublicUser } from "@/lib/supabase/auth";

// ================================================================================================
// dynamic, metadata, route segment config isimleri. Çağrılmadan Next okuyor.
// dynamic cached bir sayfa olmasını engelleyip her seferinde yüklüyor
// ================================================================================================
export const metadata: Metadata = {
  title: "Chess Puzzles: Find the Best Move | ChessVolt",
  description:
    "Solve a random chess puzzle and practice finding the best move. Test your calculation and sharpen your ability to spot tactical opportunities.",
};

export const dynamic = "force-dynamic";

// ================================================================================================
// Random bir puzzle ın sadece Id si çekilr. LoadPuzzlePage e yollanır.
// ================================================================================================
export default async function PuzzlesPage() {
  const { user, supabase } = await getPublicUser();
  const puzzleId = await getRandomActivePuzzleId(supabase, { userId: user?.id });

  if (!puzzleId) {
    return (
      <div className="page-container">
        <div className="page-container-children-layout">
          <PageHeader title="Puzzles" description="Solve a random puzzle." />
          <EmptyState message="No puzzles available yet." />
        </div>
      </div>
    );
  }

  // ================================================================================================
  // Loader set edilir.
  // ================================================================================================
  const puzzlePageData = await loadPuzzlePage({
    supabase,
    user,
    puzzleId,
    from: "puzzles",
  });

  return <PuzzleController {...puzzlePageData} />;
}
