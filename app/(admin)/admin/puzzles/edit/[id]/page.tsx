import Link from "next/link";
import { notFound } from "next/navigation";

import { PuzzleEditForm } from "@/app/(admin)/admin/puzzles/components/puzzle-edit-form";
import { resolvePuzzleEditInitialPgn } from "@/app/(admin)/admin/puzzles/lib/resolve-puzzle-edit-pgn";
import { getStudyPuzzlesByPuzzleId } from "@/features/study-puzzles/services/study-puzzles.service";
import { getAllStudies } from "@/features/study/services/study.service";
import { getGameById } from "@/features/game/services/game.service";
import { getPuzzleByIdWithThemes } from "@/features/puzzle/services/puzzle.service";
import { getAdminUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminPuzzleEditPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await getAdminUser();
  const puzzle = await getPuzzleByIdWithThemes(supabase, id);

  if (!puzzle) {
    notFound();
  }

  const [studies, studyLinks, game] = await Promise.all([
    getAllStudies(supabase),
    getStudyPuzzlesByPuzzleId(supabase, id),
    puzzle.gameId ? getGameById(supabase, puzzle.gameId) : null,
  ]);

  const initialPgn = resolvePuzzleEditInitialPgn(puzzle.moveSequence, game?.pgn);
  const studyId = studyLinks[0]?.studyId ?? "";

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Link href={`/admin/puzzles/${id}`} className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to puzzle
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Edit puzzle</h1>
      </div>
      <PuzzleEditForm
        puzzle={puzzle}
        studies={studies}
        studyId={studyId}
        initialPgn={initialPgn}
      />
    </div>
  );
}
