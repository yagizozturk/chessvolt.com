"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_INITIAL_FEN } from "@/features/move-sequence/mapper/move-sequence.mapper";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { buildMoveGoalsFromPgnComments, normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";
import {
  mergeGoalsWithOverlay,
  parseGoalsOverlayJson,
} from "@/lib/move-sequence-goals/merge-goals-overlay";

const EXAMPLE_PGN = `[Event "London System Repertoire: test"]
[Result "*"]

1. d4 { White puts a pawn in the center. } { [%csl Bd4][%cal Bd2d4] } 1... d5 2. Bf4 { Develop the bishop before e3. } { [%csl Bf4][%cal Bc1f4] } *`;

const EXAMPLE_GOALS_JSON = `{
  "mainIdea": "Control the center and develop calmly.",
  "lessonsLearned": "In the London, piece activity comes before pawn storms.",
  "plys": [
    {
      "ply": 1,
      "move": "d2d4",
      "title": "Claim the center",
      "takeaway": "d4 stakes space immediately.",
      "checkpointMessage": "Nice start — center claimed."
    }
  ]
}`;

export function PgnGoalsPreview() {
  const [pgn, setPgn] = useState("");
  const [goalsJson, setGoalsJson] = useState("");
  const [copied, setCopied] = useState(false);

  const preview = useMemo(() => {
    const normalizedPgn = normalizeLichessPgnComments(pgn.trim());
    if (!normalizedPgn) {
      return { error: null as string | null, goals: null, goalsText: null as string | null };
    }

    const moves = getUciMovesFromPgnAfterPly(normalizedPgn, 0);
    if (!moves) {
      return { error: "The PGN could not be parsed into moves.", goals: null, goalsText: null };
    }

    const { overlay, error: overlayError } = parseGoalsOverlayJson(goalsJson);
    if (overlayError) {
      return { error: overlayError, goals: null, goalsText: null };
    }

    const goals = mergeGoalsWithOverlay(
      buildMoveGoalsFromPgnComments(normalizedPgn, DEFAULT_INITIAL_FEN, moves, 0),
      overlay,
    );

    return {
      error: null,
      goals,
      goalsText: JSON.stringify(goals, null, 2),
    };
  }, [pgn, goalsJson]);

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
    <div className="flex flex-col gap-7">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="pgn-goals-preview-pgn">Annotated PGN</FieldLabel>
          <Textarea
            id="pgn-goals-preview-pgn"
            rows={14}
            value={pgn}
            onChange={(event) => setPgn(event.target.value)}
            placeholder={EXAMPLE_PGN}
            className="font-mono"
            spellCheck={false}
          />
          <FieldDescription>
            Supplies <span className="font-mono">ply</span>, <span className="font-mono">move</span>,{" "}
            <span className="font-mono">strategy</span>, and <span className="font-mono">visuals</span>. Annotated
            side (White or Black) is detected automatically; goal plies stay odd.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="pgn-goals-preview-json">Goals JSON (prose overlay)</FieldLabel>
          <Textarea
            id="pgn-goals-preview-json"
            rows={14}
            value={goalsJson}
            onChange={(event) => setGoalsJson(event.target.value)}
            placeholder={EXAMPLE_GOALS_JSON}
            className="font-mono"
            spellCheck={false}
          />
          <FieldDescription>
            Optional. Merges <span className="font-mono">mainIdea</span>,{" "}
            <span className="font-mono">lessonsLearned</span>, and per-ply{" "}
            <span className="font-mono">title</span>, <span className="font-mono">takeaway</span>,{" "}
            <span className="font-mono">checkpointMessage</span>. Matched by ply (then move). Strategy/visuals from
            this JSON are ignored.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div className="border-input bg-muted/30 rounded-md border p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Goals preview</p>
            <p className="text-muted-foreground text-xs">Preview only — nothing is saved.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!preview.goalsText}
            onClick={handleCopy}
          >
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
          <p className="text-muted-foreground text-sm">Paste a PGN to preview goals.</p>
        )}
      </div>
    </div>
  );
}
