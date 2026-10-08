import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state/empty-state";
import { PageHeader } from "@/components/page-header/page-header";
import PuzzleController from "@/features/puzzle/components/puzzle-controller";
import { loadStandalonePuzzlePage } from "@/features/puzzle/loaders/standalone-puzzle-page.loader";
import { getRandomActivePuzzleId } from "@/features/puzzle/services/puzzle.service";
import { getPublicUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Puzzles | ChessVolt",
  description: "Solve a random puzzle.",
};

export const dynamic = "force-dynamic";

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

  const pageData = await loadStandalonePuzzlePage({
    supabase,
    user,
    puzzleId,
    from: "puzzles",
  });

  return <PuzzleController {...pageData} />;
}
