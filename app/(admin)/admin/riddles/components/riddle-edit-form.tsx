"use client";

import { useActionState, useEffect, useState } from "react";

import { updateRiddleAction } from "@/app/(admin)/admin/riddles/actions/update-riddle-action";
import { PgnMoveSequenceEditor } from "@/app/(admin)/admin/riddles/components/pgn-move-sequence-editor";
import { RiddleMetadataFields } from "@/app/(admin)/admin/riddles/components/riddle-metadata-fields";
import { initialRiddleFormState } from "@/app/(admin)/admin/riddles/lib/riddle-form-state";
import { useUciRowsFromPgn } from "@/app/(admin)/admin/hooks/use-uci-rows-from-pgn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Collection } from "@/features/collection/types/collection";
import type { RiddleWithThemes } from "@/features/riddle/types/riddle-with-themes";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";

type Props = {
  riddle: RiddleWithThemes;
  collections: Collection[];
  collectionId: string;
  initialPgn: string;
};

export function RiddleEditForm({ riddle, collections, collectionId, initialPgn }: Props) {
  const [state, formAction, isPending] = useActionState(updateRiddleAction, initialRiddleFormState);
  const [pgn, setPgn] = useState(initialPgn);
  const { rows, error: pgnError, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = uciMoves.length;

  const [initialPly, setInitialPly] = useState(0);
  const [displayPly, setDisplayPly] = useState(0);
  const [endPly, setEndPly] = useState(1);

  useEffect(() => {
    if (!initialPgn.trim()) return;
    const init =
      getPlyFromPgnAtFen(initialPgn, riddle.moveSequence.initialFen) ??
      getPlyFromPgnAtFen(initialPgn, riddle.moveSequence.displayFen ?? riddle.moveSequence.initialFen) ??
      0;
    const display =
      getPlyFromPgnAtFen(initialPgn, riddle.moveSequence.displayFen ?? riddle.moveSequence.initialFen) ?? init;
    const moveCount = riddle.moveSequence.moves.trim().split(/\s+/).filter(Boolean).length;
    setInitialPly(init);
    setDisplayPly(display);
    setEndPly(Math.min(init + moveCount, maxPly || init + moveCount));
  }, [initialPgn, riddle, maxPly]);

  const canSubmit = Boolean(pgn.trim()) && maxPly > 0 && !pgnError && endPly > initialPly;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="riddleId" value={riddle.id} />

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
            sourceId={`riddle-edit-${riddle.id}`}
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
          <RiddleMetadataFields
            collections={collections}
            defaultCollectionId={collectionId}
            defaultTitle={riddle.title}
            defaultDescription={riddle.description ?? ""}
            defaultRating={riddle.rating}
            defaultPopularity={riddle.popularity}
            defaultThemes={riddle.themeSlugs.join(", ")}
            defaultIsActive={riddle.isActive}
            defaultGoals={
              riddle.moveSequence.goals != null ? JSON.stringify(riddle.moveSequence.goals, null, 2) : ""
            }
            showSourceFields
            defaultSource={riddle.source ?? ""}
            defaultSourceId={riddle.sourceId ?? ""}
            hiddenGameId={riddle.gameId ?? undefined}
          />
        </CardContent>
      </Card>

      <Button type="submit" disabled={!canSubmit || isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
