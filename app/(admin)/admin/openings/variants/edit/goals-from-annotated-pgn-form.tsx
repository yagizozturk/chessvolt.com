"use client";

import { useMemo, useState } from "react";

import { updateOpeningVariantGoalsFromPgnAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { buildMoveGoalsFromPgnComments, normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";

type Props = {
  variant: OpeningVariant;
};

export function GoalsFromAnnotatedPgnForm({ variant }: Props) {
  const [annotatedPgn, setAnnotatedPgn] = useState(variant.moveSequence.pgn ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preview = useMemo(() => {
    const normalizedPgn = normalizeLichessPgnComments(annotatedPgn.trim());
    if (!normalizedPgn) {
      return { error: null as string | null, goals: null };
    }

    const parsedMoves = getUciMovesFromPgnAfterPly(normalizedPgn, variant.initialPly);
    if (!parsedMoves) {
      return { error: "The annotated PGN could not be parsed.", goals: null };
    }
    if (parsedMoves !== variant.moveSequence.moves) {
      return {
        error: "The annotated PGN moves do not match this variant's stored move sequence.",
        goals: null,
      };
    }

    return {
      error: null,
      goals: buildMoveGoalsFromPgnComments(
        normalizedPgn,
        variant.moveSequence.initialFen,
        variant.moveSequence.moves,
        variant.initialPly,
      ),
    };
  }, [annotatedPgn, variant]);

  return (
    <form
      action={async (formData: FormData) => {
        setIsSubmitting(true);
        await updateOpeningVariantGoalsFromPgnAction(variant.id, formData);
        setIsSubmitting(false);
      }}
      className="border-input bg-muted/30 flex flex-col gap-5 rounded-md border p-4"
    >
      <div>
        <p className="text-sm font-medium">Goals from annotated PGN</p>
        <p className="text-muted-foreground mt-1 text-xs">
          This action updates only the move sequence&apos;s goals array. All variant metadata, moves, FENs, and stored
          PGN remain unchanged.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="variant-annotated-pgn">Annotated PGN</FieldLabel>
          <Textarea
            id="variant-annotated-pgn"
            name="annotatedPgn"
            required
            rows={16}
            value={annotatedPgn}
            onChange={(event) => setAnnotatedPgn(event.target.value)}
            className="font-mono"
            spellCheck={false}
          />
          <FieldDescription>
            Plain comments become strategy; Lichess <span className="font-mono">[%csl]</span> and{" "}
            <span className="font-mono">[%cal]</span> markers become visuals.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div>
        <p className="mb-2 text-sm font-medium">Goals preview</p>
        {preview.error ? (
          <p className="text-destructive text-sm">{preview.error}</p>
        ) : preview.goals ? (
          <pre className="border-input bg-background max-h-[min(36rem,70vh)] overflow-auto rounded-md border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(preview.goals, null, 2)}
          </pre>
        ) : (
          <p className="text-muted-foreground text-sm">Paste an annotated PGN to preview the goals array.</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || Boolean(preview.error) || !preview.goals}>
        {isSubmitting ? "Updating goals..." : "Update goals only"}
      </Button>
    </form>
  );
}
