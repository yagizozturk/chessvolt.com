"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { updateOpeningVariantGoalsFromPgnAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { buildMoveGoalsFromPgnComments, normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";
import {
  mergeGoalsWithOverlay,
  parseGoalsOverlayJson,
} from "@/lib/move-sequence-goals/merge-goals-overlay";

type Props = {
  variant: OpeningVariant;
};

export function GoalsFromAnnotatedPgnForm({ variant }: Props) {
  const [annotatedPgn, setAnnotatedPgn] = useState(variant.moveSequence.pgn ?? "");
  const [goalsJson, setGoalsJson] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const preview = useMemo(() => {
    const normalizedPgn = normalizeLichessPgnComments(annotatedPgn.trim());
    if (!normalizedPgn) {
      return { error: null as string | null, goals: null, goalsText: null as string | null };
    }

    const parsedMoves = getUciMovesFromPgnAfterPly(normalizedPgn, variant.initialPly);
    if (!parsedMoves) {
      return { error: "The annotated PGN could not be parsed.", goals: null, goalsText: null };
    }
    if (parsedMoves !== variant.moveSequence.moves) {
      return {
        error: "The annotated PGN moves do not match this variant's stored move sequence.",
        goals: null,
        goalsText: null,
      };
    }

    const { overlay, error: overlayError } = parseGoalsOverlayJson(goalsJson);
    if (overlayError) {
      return { error: overlayError, goals: null, goalsText: null };
    }

    const goals = mergeGoalsWithOverlay(
      buildMoveGoalsFromPgnComments(
        normalizedPgn,
        variant.moveSequence.initialFen,
        variant.moveSequence.moves,
        variant.initialPly,
      ),
      overlay,
    );

    return {
      error: null,
      goals,
      goalsText: JSON.stringify(goals, null, 2),
    };
  }, [annotatedPgn, goalsJson, variant]);

  async function handleCopy() {
    if (!preview.goalsText) return;
    try {
      await navigator.clipboard.writeText(preview.goalsText);
      setCopied(true);
      toast.success("Goals JSON copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

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
            rows={12}
            value={annotatedPgn}
            onChange={(event) => setAnnotatedPgn(event.target.value)}
            className="font-mono"
            spellCheck={false}
          />
          <FieldDescription>
            Supplies ply, move, strategy, and visuals. Annotated side is detected automatically; goal plies stay
            odd.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="variant-goals-json">Goals JSON (prose overlay)</FieldLabel>
          <Textarea
            id="variant-goals-json"
            name="goalsJson"
            rows={12}
            value={goalsJson}
            onChange={(event) => setGoalsJson(event.target.value)}
            className="font-mono"
            spellCheck={false}
            placeholder='{"mainIdea":"...","lessonsLearned":"...","plys":[{"ply":1,"title":"...","takeaway":"...","checkpointMessage":"..."}]}'
          />
          <FieldDescription>
            Optional. Merges mainIdea, lessonsLearned, title, takeaway, and checkpointMessage onto the PGN-built
            goals.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Goals preview</p>
          <Button type="button" variant="outline" size="sm" disabled={!preview.goalsText} onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy JSON"}
          </Button>
        </div>
        {preview.error ? (
          <p className="text-destructive text-sm">{preview.error}</p>
        ) : preview.goalsText ? (
          <pre className="border-input bg-background max-h-[min(36rem,70vh)] overflow-auto rounded-md border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {preview.goalsText}
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
