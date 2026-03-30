"use client";

import { updateOpeningVariantAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import {
  getPairedPgnDisplayFromPgn,
  getUciMovesFromPgnAfterPly,
} from "@/lib/chess/extractMovesFromPgn";
import { getPlyFromPgnAtFen } from "@/lib/chess/getFenFromPgnAtPly";
import { Save } from "lucide-react";
import { useMemo, useState } from "react";

import { PgnPairedBlock } from "../components/pgn-paired-block";

type Props = {
  variant: OpeningVariant;
  onCancel: () => void;
};

function defaultDisplayPlyString(v: OpeningVariant): string {
  const df = v.displayFen?.trim();
  if (df) {
    const p = getPlyFromPgnAtFen(v.pgn, df);
    if (p !== null) return String(p);
  }
  return String(v.ply ?? 0);
}

export function VariantEditForm({ variant, onCancel }: Props) {
  const [pgn, setPgn] = useState(variant.pgn);
  const [initialPly, setInitialPly] = useState(String(variant.ply ?? 0));
  const [displayPly, setDisplayPly] = useState(() =>
    defaultDisplayPlyString(variant),
  );
  const initialPlyNum =
    parseInt(initialPly, 10) >= 0 ? parseInt(initialPly, 10) : 0;
  const derivedMoves = pgn
    ? (getUciMovesFromPgnAfterPly(pgn, initialPlyNum) ?? variant.moves)
    : variant.moves;

  const pgnPairedDisplay = useMemo(
    () => getPairedPgnDisplayFromPgn(pgn.trim()),
    [pgn],
  );

  return (
    <form
      action={async (formData) => {
        await updateOpeningVariantAction(variant.id, formData);
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Sort Key</FieldLabel>
          <Input
            name="sortKey"
            type="number"
            defaultValue={variant.sortKey}
            className="font-mono"
          />
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" defaultValue={variant.title ?? ""} />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input name="description" defaultValue={variant.description ?? ""} />
        </Field>
        <Field>
          <FieldLabel>Initial ply</FieldLabel>
          <Input
            name="initialPly"
            type="number"
            min={0}
            value={initialPly}
            onChange={(e) => setInitialPly(e.target.value)}
          />
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            Half-move index in the PGN where this line begins: UCI moves and the
            default initial FEN (when that field is empty) come from here. Empty
            means 0 (start position). For White-focused openings, prefer an even
            ply (0, 2, 4, …): with usual half-move numbering, even plies are the
            positions where White is on move after the start.
          </p>
        </Field>
        <Field>
          <FieldLabel>Display ply</FieldLabel>
          <Input
            name="displayPly"
            type="number"
            min={0}
            value={displayPly}
            onChange={(e) => setDisplayPly(e.target.value)}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Empty is treated as 0. Default display FEN is taken from this ply
            when the display FEN field is left empty.
          </p>
        </Field>
        <Field>
          <FieldLabel>PGN</FieldLabel>
          <textarea
            name="pgn"
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            required
            rows={6}
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-base text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
          {pgnPairedDisplay &&
          (pgnPairedDisplay.rows.length > 0 ||
            pgnPairedDisplay.startComment) ? (
            <PgnPairedBlock
              display={pgnPairedDisplay}
              className="border-muted bg-muted/20 mt-2 max-h-64 overflow-auto rounded-md border p-3"
            />
          ) : null}
        </Field>
        <Field>
          <FieldLabel>Moves (UCI)</FieldLabel>
          <Input readOnly value={derivedMoves} className="font-mono text-sm" />
        </Field>
        <Field>
          <FieldLabel>Initial FEN</FieldLabel>
          <Input
            name="initialFen"
            defaultValue={variant.initialFen ?? ""}
            placeholder="Leave empty to compute from PGN at Initial ply"
            className="font-mono text-sm"
          />
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            On save, if this is empty and PGN is set, we store the board
            position reached at the{" "}
            <span className="text-foreground font-medium">Initial ply</span>{" "}
            half-move in that PGN. If you enter a FEN manually, that overrides
            the calculation.
          </p>
        </Field>
        <Field>
          <FieldLabel>Display FEN</FieldLabel>
          <Input
            name="displayFen"
            defaultValue={variant.displayFen ?? ""}
            placeholder="Leave empty to compute from PGN at display ply"
            className="font-mono text-sm"
          />
        </Field>
        <Field>
          <FieldLabel>Goals (JSON)</FieldLabel>
          <textarea
            name="goals"
            rows={6}
            defaultValue={
              variant.goals != null
                ? JSON.stringify(variant.goals, null, 2)
                : ""
            }
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
      </FieldGroup>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
