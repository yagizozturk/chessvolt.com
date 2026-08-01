"use client";

import { Check, Copy, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { START_FEN, useUciRowsFromPgn } from "@/app/(admin)/admin/hooks/use-uci-rows-from-pgn";
import {
  createOpeningVariantAction,
  updateOpeningVariantAction,
} from "@/app/(admin)/admin/openings/variants/actions/variants";
import { AdminPgnBoardPicker } from "@/app/(admin)/admin/shared/components/admin-pgn-board-picker";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Opening } from "@/features/openings/types/opening";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { buildMoveGoalsFromPgnComments, normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";
import {
  mergeGoalsWithOverlay,
  parseGoalsOverlayJson,
} from "@/lib/move-sequence-goals/merge-goals-overlay";

function defaultDisplayPly(variant: OpeningVariant): number {
  const df = variant.moveSequence.displayFen?.trim();
  if (df) {
    const ply = getPlyFromPgnAtFen(variant.moveSequence.pgn ?? "", df);
    if (ply !== null) return ply;
  }
  return variant.initialPly ?? 0;
}

/** Seed overlay textarea with prose + strategy (visuals stay from PGN). */
function goalsToOverlayJson(goals: MoveGoals | null | undefined): string {
  if (!goals) return "";
  return JSON.stringify(
    {
      mainIdea: goals.mainIdea,
      lessonsLearned: goals.lessonsLearned,
      plys: goals.plys.map(({ ply, move, title, strategy, takeaway, checkpointMessage }) => ({
        ply,
        move,
        title,
        strategy,
        takeaway,
        checkpointMessage,
      })),
    },
    null,
    2,
  );
}

type CreateProps = {
  mode: "create";
  openings: Opening[];
  defaultOpeningId?: string;
};

type UpdateProps = {
  mode: "update";
  variant: OpeningVariant;
  onCancel: () => void;
};

type Props = CreateProps | UpdateProps;

export function VariantPgnGoalsForm(props: Props) {
  const isCreate = props.mode === "create";
  const variant = props.mode === "update" ? props.variant : null;

  const [openingId, setOpeningId] = useState(
    isCreate ? (props.defaultOpeningId ?? "") : (variant?.openingId ?? ""),
  );
  const [title, setTitle] = useState(variant?.title ?? "");
  const [description, setDescription] = useState(variant?.description ?? "");
  const [sortKey, setSortKey] = useState(String(variant?.sortKey ?? 1));
  const [pgn, setPgn] = useState(variant?.moveSequence.pgn ?? "");
  const [goalsJson, setGoalsJson] = useState(() => goalsToOverlayJson(variant?.moveSequence.goals));
  const [initialPly, setInitialPly] = useState(String(variant?.initialPly ?? 0));
  const [displayPly, setDisplayPly] = useState(() =>
    variant ? String(defaultDisplayPly(variant)) : "0",
  );
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultOpeningId = props.mode === "create" ? props.defaultOpeningId : undefined;
  useEffect(() => {
    if (props.mode === "create") setOpeningId(defaultOpeningId ?? "");
  }, [props.mode, defaultOpeningId]);

  const { rows, error: pgnError, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = Math.max(0, fensByPly.length - 1);
  const initialPlyNum = Math.min(Math.max(0, parseInt(initialPly, 10) || 0), maxPly);
  const displayPlyNum = Math.min(Math.max(0, parseInt(displayPly, 10) || 0), maxPly);
  const initialFen = fensByPly[initialPlyNum] ?? START_FEN;
  const displayFen = fensByPly[displayPlyNum] ?? START_FEN;

  const derivedMoves = useMemo(() => {
    const trimmed = pgn.trim();
    if (!trimmed) return "";
    return getUciMovesFromPgnAfterPly(trimmed, initialPlyNum) ?? "";
  }, [pgn, initialPlyNum]);

  const preview = useMemo(() => {
    const normalizedPgn = normalizeLichessPgnComments(pgn.trim());
    if (!normalizedPgn) {
      return { error: null as string | null, goals: null, goalsText: null as string | null };
    }

    const moves = getUciMovesFromPgnAfterPly(normalizedPgn, initialPlyNum);
    if (!moves) {
      return { error: "The annotated PGN could not be parsed.", goals: null, goalsText: null };
    }

    const { overlay, error: overlayError } = parseGoalsOverlayJson(goalsJson);
    if (overlayError) {
      return { error: overlayError, goals: null, goalsText: null };
    }

    const fen = fensByPly[initialPlyNum] ?? START_FEN;
    const goals = mergeGoalsWithOverlay(
      buildMoveGoalsFromPgnComments(normalizedPgn, fen, moves, initialPlyNum),
      overlay,
    );

    return {
      error: null,
      goals,
      goalsText: JSON.stringify(goals, null, 2),
    };
  }, [pgn, goalsJson, initialPlyNum, fensByPly]);

  const canSubmit =
    Boolean(pgn.trim()) &&
    !pgnError &&
    !preview.error &&
    Boolean(preview.goals) &&
    (isCreate ? Boolean(openingId.trim()) : true) &&
    !Number.isNaN(parseInt(sortKey.trim(), 10));

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
      action={async (formData) => {
        setIsSubmitting(true);
        try {
          if (isCreate) {
            await createOpeningVariantAction(formData);
          } else if (variant) {
            await updateOpeningVariantAction(variant.id, formData);
          }
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="space-y-6"
    >
      <input type="hidden" name="initialFen" value={initialFen} />
      <input type="hidden" name="displayFen" value={displayFen} />
      <input type="hidden" name="initialPly" value={String(initialPlyNum)} />
      <input type="hidden" name="displayPly" value={String(displayPlyNum)} />

      {props.mode === "create" ? (
        <div className="space-y-2">
          <label htmlFor="variant-opening" className="text-sm font-medium">
            Opening
          </label>
          <select
            id="variant-opening"
            name="openingId"
            required
            value={openingId}
            onChange={(e) => setOpeningId(e.target.value)}
            className="border-input focus-visible:ring-ring w-full max-w-md rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <option value="">Select opening...</option>
            {props.openings.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Opening: <span className="text-foreground font-mono text-xs">{props.variant.openingId}</span>
        </p>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="variant-title">Title</FieldLabel>
          <Input
            id="variant-title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Variant title"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="variant-description">Description</FieldLabel>
          <Textarea
            id="variant-description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Optional description"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="variant-sort-key">Sort key</FieldLabel>
          <Input
            id="variant-sort-key"
            name="sortKey"
            type="number"
            min={0}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="font-mono"
            required
          />
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="variant-annotated-pgn">Annotated PGN</FieldLabel>
          <Textarea
            id="variant-annotated-pgn"
            name="pgn"
            required
            rows={12}
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            className="font-mono"
            spellCheck={false}
          />
          <FieldDescription>
            Single PGN source for moves and visuals (<span className="font-mono">%csl</span> /{" "}
            <span className="font-mono">%cal</span>). Strategy comments are used only when Goals JSON omits
            strategy. Persisted as the variant PGN.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="variant-goals-json">Goals JSON (prose + strategy overlay)</FieldLabel>
          <Textarea
            id="variant-goals-json"
            name="goalsJson"
            rows={12}
            value={goalsJson}
            onChange={(e) => setGoalsJson(e.target.value)}
            className="font-mono"
            spellCheck={false}
            placeholder='{"mainIdea":"...","lessonsLearned":"...","plys":[{"ply":1,"title":"...","strategy":"...","takeaway":"...","checkpointMessage":"..."}]}'
          />
          <FieldDescription>
            Optional. Merges <span className="font-mono">mainIdea</span>,{" "}
            <span className="font-mono">lessonsLearned</span>, <span className="font-mono">title</span>,{" "}
            <span className="font-mono">strategy</span>, <span className="font-mono">takeaway</span>, and{" "}
            <span className="font-mono">checkpointMessage</span>. Visuals stay from PGN; missing strategy falls
            back to PGN comments.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Merged goals preview</p>
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
          <p className="text-muted-foreground text-sm">Paste an annotated PGN to preview the merged goals array.</p>
        )}
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Moves (UCI)</FieldLabel>
          <Input readOnly value={derivedMoves} className="font-mono text-sm" />
        </Field>
      </FieldGroup>

      <div className="border-input bg-muted/30 rounded-md border p-3">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              initialFen (left board)
            </p>
            <p className="font-mono text-xs break-all">{initialFen}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Selected ply: <span className="text-foreground font-mono tabular-nums">{initialPlyNum}</span>
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              displayFen (right board)
            </p>
            <p className="font-mono text-xs break-all">{displayFen}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Selected ply: <span className="text-foreground font-mono tabular-nums">{displayPlyNum}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-10 xl:grid-cols-2">
        <AdminPgnBoardPicker
          sourceId={isCreate ? "create-variant-initial" : "edit-variant-initial"}
          title="Left — initial"
          boardFen={initialFen}
          rows={rows}
          error={pgnError}
          uciMoves={uciMoves}
          safePly={initialPlyNum}
          maxPly={maxPly}
          setSelectedPly={(ply) => setInitialPly(String(ply))}
        />
        <AdminPgnBoardPicker
          sourceId={isCreate ? "create-variant-display" : "edit-variant-display"}
          title="Right — display"
          boardFen={displayFen}
          rows={rows}
          error={pgnError}
          uciMoves={uciMoves}
          safePly={displayPlyNum}
          maxPly={maxPly}
          setSelectedPly={(ply) => setDisplayPly(String(ply))}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : isCreate ? "Create variant" : "Save"}
        </Button>
        {props.mode === "update" && (
          <Button type="button" variant="ghost" onClick={props.onCancel}>
            Cancel
          </Button>
        )}
      </div>
      {!canSubmit && (
        <p className="text-muted-foreground text-xs">
          {isCreate ? "Select an opening, " : ""}
          provide a valid annotated PGN
          {preview.error ? ` (${preview.error})` : ""}.
        </p>
      )}
    </form>
  );
}
