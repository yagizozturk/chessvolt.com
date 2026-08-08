import Link from "next/link";
import { notFound } from "next/navigation";

import { DeletePuzzleButton } from "@/app/(admin)/admin/puzzles/components/delete-puzzle-button";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudyPuzzlesByPuzzleId } from "@/features/study-puzzles/services/study-puzzles.service";
import { getAllStudies } from "@/features/study/services/study.service";
import { getGameById } from "@/features/game/services/game.service";
import { getPuzzleByIdWithThemes } from "@/features/puzzle/services/puzzle.service";
import { formatPuzzleRatingLabel } from "@/features/puzzle/types/puzzle-rating";
import { getAdminUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminPuzzleDetailPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await getAdminUser();
  const puzzle = await getPuzzleByIdWithThemes(supabase, id);

  if (!puzzle) {
    notFound();
  }

  const [game, studyLinks, studies] = await Promise.all([
    puzzle.gameId ? getGameById(supabase, puzzle.gameId) : null,
    getStudyPuzzlesByPuzzleId(supabase, id),
    getAllStudies(supabase),
  ]);

  const study = studyLinks[0] ? studies.find((c) => c.id === studyLinks[0]!.studyId) : null;

  const displayFen = puzzle.moveSequence.displayFen ?? puzzle.moveSequence.initialFen;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/puzzles" className="text-muted-foreground hover:text-foreground text-sm">
            ← Back to puzzles
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{puzzle.title}</h1>
          <p className="text-muted-foreground text-sm">
            {formatPuzzleRatingLabel(puzzle.rating)}
            {puzzle.source ? ` · ${puzzle.source}` : ""}
            {puzzle.sourceId ? ` · ${puzzle.sourceId}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/puzzles/edit/${puzzle.id}`}>Edit</Link>
          </Button>
          <DeletePuzzleButton id={puzzle.id} title={puzzle.title} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Display position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square w-full max-w-[360px]">
              <DisplayBoard sourceId={`puzzle-detail-${puzzle.id}`} initialFen={displayFen} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <Badge variant={puzzle.isActive ? "default" : "secondary"}>
                {puzzle.isActive ? "Active" : "Inactive"}
              </Badge>
            </p>

            {study ? (
              <p>
                <span className="text-muted-foreground">Study:</span> {study.title}
              </p>
            ) : null}
            {game ? (
              <p>
                <span className="text-muted-foreground">Game:</span> {game.whitePlayer} vs {game.blackPlayer}
              </p>
            ) : null}
            <div>
              <p className="text-muted-foreground mb-1">Themes</p>
              <div className="flex flex-wrap gap-1">
                {puzzle.themeSlugs.map((slug) => (
                  <Badge key={slug} variant="outline">
                    {slug}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Moves (UCI)</p>
              <p className="font-mono text-xs break-all">{puzzle.moveSequence.moves}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Initial FEN</p>
              <p className="font-mono text-xs break-all">{puzzle.moveSequence.initialFen}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
