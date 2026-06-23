"use client";

import { useActionState, useEffect, useState } from "react";

import { createFromPlyAction } from "@/app/(admin)/admin/riddles/actions/create-from-ply-action";
import { PgnMoveSequenceEditor } from "@/app/(admin)/admin/riddles/components/pgn-move-sequence-editor";
import { RiddleMetadataFields } from "@/app/(admin)/admin/riddles/components/riddle-metadata-fields";
import { initialRiddleFormState } from "@/app/(admin)/admin/riddles/lib/riddle-form-state";
import { useUciRowsFromPgn } from "@/app/(admin)/admin/hooks/use-uci-rows-from-pgn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Collection } from "@/features/collection/types/collection";

type Props = {
  collections: Collection[];
  initialPgn?: string;
  readOnlyPgn?: boolean;
  hiddenGameId?: string;
  defaultTitle?: string;
};

export function PlyPgnCreateForm({
  collections,
  initialPgn = "",
  readOnlyPgn = false,
  hiddenGameId,
  defaultTitle = "",
}: Props) {
  const [state, formAction, isPending] = useActionState(createFromPlyAction, initialRiddleFormState);
  const [pgn, setPgn] = useState(initialPgn);
  const { rows, error: pgnError, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = uciMoves.length;
  const [initialPly, setInitialPly] = useState(0);
  const [displayPly, setDisplayPly] = useState(0);
  const [endPly, setEndPly] = useState(0);

  useEffect(() => {
    setPgn(initialPgn);
  }, [initialPgn]);

  useEffect(() => {
    if (maxPly > 0) {
      setInitialPly(0);
      setDisplayPly(0);
      setEndPly(maxPly);
    } else {
      setInitialPly(0);
      setDisplayPly(0);
      setEndPly(0);
    }
  }, [pgn, maxPly]);

  const canSubmit =
    Boolean(pgn.trim()) &&
    maxPly > 0 &&
    !pgnError &&
    initialPly >= 0 &&
    endPly > initialPly &&
    endPly <= maxPly;

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>PGN + ply selection</CardTitle>
          <CardDescription>
            Select initial ply, display ply, and end ply. Answer moves are sliced from initial to end.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PgnMoveSequenceEditor
            sourceId="riddle-ply-create"
            pgn={pgn}
            onPgnChange={readOnlyPgn ? undefined : setPgn}
            readOnlyPgn={readOnlyPgn}
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
            defaultTitle={defaultTitle}
            hiddenGameId={hiddenGameId}
          />
        </CardContent>
      </Card>

      <Button type="submit" disabled={!canSubmit || isPending}>
        {isPending ? "Creating…" : "Create riddle"}
      </Button>
    </form>
  );
}
