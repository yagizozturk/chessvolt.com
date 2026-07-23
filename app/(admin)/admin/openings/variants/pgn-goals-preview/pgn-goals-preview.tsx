"use client";

import { useMemo, useState } from "react";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_INITIAL_FEN } from "@/features/move-sequence/mapper/move-sequence.mapper";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { buildMoveGoalsFromPgnComments, normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";

const EXAMPLE_PGN = `[Event "London System Repertoire: test"]
[Result "*"]

1. d4 { White puts a pawn in the center. } { [%csl Bd4][%cal Bd2d4] } 1... d5 2. Bf4 { Develop the bishop before e3. } { [%csl Bf4][%cal Bc1f4] } *`;

export function PgnGoalsPreview() {
  const [pgn, setPgn] = useState("");

  const preview = useMemo(() => {
    const normalizedPgn = normalizeLichessPgnComments(pgn.trim());
    if (!normalizedPgn) {
      return { error: null as string | null, goals: null };
    }

    const moves = getUciMovesFromPgnAfterPly(normalizedPgn, 0);
    if (!moves) {
      return { error: "The PGN could not be parsed into moves.", goals: null };
    }

    return {
      error: null,
      goals: buildMoveGoalsFromPgnComments(normalizedPgn, DEFAULT_INITIAL_FEN, moves, 0),
    };
  }, [pgn]);

  return (
    <div className="flex flex-col gap-7">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="pgn-goals-preview-pgn">Annotated PGN</FieldLabel>
          <Textarea
            id="pgn-goals-preview-pgn"
            rows={20}
            value={pgn}
            onChange={(event) => setPgn(event.target.value)}
            placeholder={EXAMPLE_PGN}
            className="font-mono"
            spellCheck={false}
          />
          <FieldDescription>
            Plain comments become strategy. Lichess <span className="font-mono">[%csl]</span> and{" "}
            <span className="font-mono">[%cal]</span> markers become visuals.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div className="border-input bg-muted/30 rounded-md border p-4">
        <p className="mb-1 text-sm font-medium">Goals preview</p>
        <p className="text-muted-foreground mb-3 text-xs">Preview only — nothing is saved.</p>
        {preview.error ? (
          <p className="text-destructive text-sm">{preview.error}</p>
        ) : preview.goals ? (
          <pre className="border-input bg-background max-h-[min(36rem,70vh)] overflow-auto rounded-md border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(preview.goals, null, 2)}
          </pre>
        ) : (
          <p className="text-muted-foreground text-sm">Paste a PGN to preview goals.</p>
        )}
      </div>
    </div>
  );
}
