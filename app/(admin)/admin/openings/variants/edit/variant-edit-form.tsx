"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { START_FEN, useUciRowsFromPgn } from "@/app/(admin)/admin/hooks/use-uci-rows-from-pgn";
import { updateOpeningVariantAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AdminPgnBoardPicker } from "@/app/(admin)/admin/shared/components/admin-pgn-board-picker";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";

type Props = {
  variant: OpeningVariant;
  onCancel: () => void;
};

function defaultDisplayPlyString(v: OpeningVariant): string {
  const df = v.moveSequence.displayFen?.trim();
  if (df) {
    const p = getPlyFromPgnAtFen(v.moveSequence.pgn ?? "", df);
    if (p !== null) return String(p);
  }
  return String(v.initialPly ?? 0);
}

export function VariantEditForm({ variant, onCancel }: Props) {
  const [pgn, setPgn] = useState(variant.moveSequence.pgn ?? "");
  const [initialPly, setInitialPly] = useState(String(variant.initialPly ?? 0));
  const [displayPly, setDisplayPly] = useState(() => defaultDisplayPlyString(variant));
  const { rows, error, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = Math.max(0, fensByPly.length - 1);
  const initialPlyNum = Math.min(Math.max(0, parseInt(initialPly, 10) || 0), maxPly);
  const displayPlyNum = Math.min(Math.max(0, parseInt(displayPly, 10) || 0), maxPly);
  const initialFen = fensByPly[initialPlyNum] ?? START_FEN;
  const displayFen = fensByPly[displayPlyNum] ?? START_FEN;
  const derivedMoves = pgn
    ? (getUciMovesFromPgnAfterPly(pgn, initialPlyNum) ?? variant.moveSequence.moves)
    : variant.moveSequence.moves;

  return (
    <form
      action={async (formData) => {
        await updateOpeningVariantAction(variant.id, formData);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="initialFen" value={initialFen} />
      <input type="hidden" name="displayFen" value={displayFen} />
      <FieldGroup>
        <Field>
          <FieldLabel>Sort Key</FieldLabel>
          <Input name="sortKey" type="number" defaultValue={variant.sortKey} className="font-mono" />
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
            value={String(initialPlyNum)}
            onChange={(e) => setInitialPly(e.target.value)}
          />
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            Half-move index in the PGN where this line begins: UCI moves and the default initial FEN (when that field is
            empty) come from here. Empty means 0 (start position). For White-focused openings, prefer an even ply (0, 2,
            4, …): with usual half-move numbering, even plies are the positions where White is on move after the start.
          </p>
        </Field>
        <Field>
          <FieldLabel>Display ply</FieldLabel>
          <Input
            name="displayPly"
            type="number"
            min={0}
            value={String(displayPlyNum)}
            onChange={(e) => setDisplayPly(e.target.value)}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Empty is treated as 0. Default display FEN is taken from this ply when the display FEN field is left empty.
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
        </Field>
        <Field>
          <FieldLabel>Moves (UCI)</FieldLabel>
          <Input readOnly value={derivedMoves} className="font-mono text-sm" />
        </Field>
        <Field>
          <FieldLabel>Goals (JSON)</FieldLabel>
          <textarea
            name="goals"
            rows={6}
            defaultValue={variant.moveSequence.goals != null ? JSON.stringify(variant.moveSequence.goals, null, 2) : ""}
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        </Field>
      </FieldGroup>
      <div className="border-input bg-muted/30 rounded-md border p-3">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              initialFen (sol board)
            </p>
            <p className="font-mono text-xs break-all">{initialFen}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Seçilen ply: <span className="text-foreground font-mono tabular-nums">{initialPlyNum}</span>
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              displayFen (sağ board)
            </p>
            <p className="font-mono text-xs break-all">{displayFen}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Seçilen ply: <span className="text-foreground font-mono tabular-nums">{displayPlyNum}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-10 xl:grid-cols-2">
        <AdminPgnBoardPicker
          sourceId="edit-variant-initial"
          title="Sol — initial"
          boardFen={initialFen}
          rows={rows}
          error={error}
          uciMoves={uciMoves}
          safePly={initialPlyNum}
          maxPly={maxPly}
          setSelectedPly={(ply) => setInitialPly(String(ply))}
        />
        <AdminPgnBoardPicker
          sourceId="edit-variant-display"
          title="Sağ — display"
          boardFen={displayFen}
          rows={rows}
          error={error}
          uciMoves={uciMoves}
          safePly={displayPlyNum}
          maxPly={maxPly}
          setSelectedPly={(ply) => setDisplayPly(String(ply))}
        />
      </div>
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
