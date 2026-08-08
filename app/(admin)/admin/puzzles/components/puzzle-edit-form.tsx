"use client";

import { useActionState, useEffect, useState } from "react";

import { useUciRowsFromPgn } from "@/app/(admin)/admin/hooks/use-uci-rows-from-pgn";
import { updatePuzzleAction } from "@/app/(admin)/admin/puzzles/actions/update-puzzle-action";
import { PgnMoveSequenceEditor } from "@/app/(admin)/admin/puzzles/components/pgn-move-sequence-editor";
import { PuzzleMetadataFields } from "@/app/(admin)/admin/puzzles/components/puzzle-metadata-fields";
import { initialPuzzleFormState } from "@/app/(admin)/admin/puzzles/lib/puzzle-form-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Study } from "@/features/study/types/study";
import type { PuzzleWithThemes } from "@/features/puzzle/types/puzzle-with-themes";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";

type Props = {
  puzzle: PuzzleWithThemes;
  studies: Study[];
  studyId: string;
  initialPgn: string;
};

export function PuzzleEditForm({ puzzle, studies, studyId, initialPgn }: Props) {
  const [state, formAction, isPending] = useActionState(updatePuzzleAction, initialPuzzleFormState);
  const [pgn, setPgn] = useState(initialPgn);
  const { rows, error: pgnError, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = uciMoves.length;
  const answerMoveCount = puzzle.moveSequence.moves.trim().split(/\s+/).filter(Boolean).length;

  const [initialPly, setInitialPly] = useState(0);
  const [displayPly, setDisplayPly] = useState(0);
  const [endPly, setEndPly] = useState(1);

  useEffect(() => {
    setPgn(initialPgn);
  }, [initialPgn]);

  useEffect(() => {
    if (!initialPgn.trim()) {
      if (answerMoveCount === 0) return;
      setInitialPly(0);
      setDisplayPly(0);
      setEndPly(Math.min(answerMoveCount, maxPly || answerMoveCount));
      return;
    }

    const init =
      getPlyFromPgnAtFen(initialPgn, puzzle.moveSequence.initialFen) ??
      getPlyFromPgnAtFen(initialPgn, puzzle.moveSequence.displayFen ?? puzzle.moveSequence.initialFen) ??
      0;
    const display =
      getPlyFromPgnAtFen(initialPgn, puzzle.moveSequence.displayFen ?? puzzle.moveSequence.initialFen) ?? init;
    setInitialPly(init);
    setDisplayPly(display);
    setEndPly(Math.min(init + answerMoveCount, maxPly || init + answerMoveCount));
  }, [initialPgn, puzzle, maxPly, answerMoveCount]);

  const canSubmit = Boolean(pgn.trim()) && maxPly > 0 && !pgnError && endPly > initialPly;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="puzzleId" value={puzzle.id} />

      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Move sequence</CardTitle>
        </CardHeader>
        <CardContent>
          <PgnMoveSequenceEditor
            sourceId={`puzzle-edit-${puzzle.id}`}
            pgn={pgn}
            onPgnChange={setPgn}
            rows={rows}
            error={pgnError}
            uciMoves={uciMoves}
            fensByPly={fensByPly}
            initialPly={initialPly}
            displayPly={displayPly}
            endPly={endPly}
            onInitialPlyChange={setInitialPly}
            onDisplayPlyChange={setDisplayPly}
            onEndPlyChange={setEndPly}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <PuzzleMetadataFields
            studies={studies}
            defaultStudyId={studyId}
            defaultTitle={puzzle.title}
            defaultRating={puzzle.rating}
            defaultPopularity={puzzle.popularity}
            defaultThemes={puzzle.themeSlugs.join(", ")}
            defaultIsActive={puzzle.isActive}
            defaultGoals={puzzle.moveSequence.goals != null ? JSON.stringify(puzzle.moveSequence.goals, null, 2) : ""}
            showSourceFields
            defaultSource={puzzle.source ?? ""}
            defaultSourceId={puzzle.sourceId ?? ""}
            hiddenGameId={puzzle.gameId ?? undefined}
          />
        </CardContent>
      </Card>

      <Button type="submit" disabled={!canSubmit || isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
