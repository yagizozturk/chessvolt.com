"use client";

import { updateOpeningVariantAction } from "@/app/(admin)/admin/openings/variants/actions/variants";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import VoltBoard from "@/components/volt-board/volt-board";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { getUciMovesArrayFromPgn } from "@/lib/chess/getUciMovesArrayFromPgn";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import { Chess } from "chess.js";
import { Save } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  variant: OpeningVariant;
  onCancel: () => void;
};

const START_FEN = new Chess().fen();

function applyUci(game: Chess, uci: string) {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion =
    uci.length > 4 ? (uci[4] as "q" | "r" | "b" | "n") : undefined;
  return game.move({
    from,
    to,
    ...(promotion ? { promotion } : {}),
  });
}

function useUciRowsFromPgn(pgn: string) {
  return useMemo(() => {
    const trimmed = pgn.trim();
    if (!trimmed) {
      return {
        rows: [] as { num: number; white: string; black?: string }[],
        error: null as string | null,
        fensByPly: [START_FEN] as string[],
        uciMoves: [] as string[],
      };
    }
    try {
      const game = new Chess();
      game.loadPgn(trimmed, { strict: false });

      const uciMovesRaw = getUciMovesArrayFromPgn(pgn);
      if (!uciMovesRaw || uciMovesRaw.length === 0) {
        return {
          rows: [] as { num: number; white: string; black?: string }[],
          error: null,
          fensByPly: [game.fen()],
          uciMoves: [] as string[],
        };
      }

      const uciMoves = uciMovesRaw;
      const rows: { num: number; white: string; black?: string }[] = [];
      for (let i = 0; i < uciMoves.length; i += 2) {
        rows.push({
          num: Math.floor(i / 2) + 1,
          white: uciMoves[i]!,
          ...(uciMoves[i + 1] !== undefined ? { black: uciMoves[i + 1] } : {}),
        });
      }

      const replay = new Chess();
      const fensByPly: string[] = [replay.fen()];
      for (const uci of uciMoves) {
        applyUci(replay, uci);
        fensByPly.push(replay.fen());
      }

      return { rows, error: null, fensByPly, uciMoves };
    } catch (e) {
      return {
        rows: [] as { num: number; white: string; black?: string }[],
        error: e instanceof Error ? e.message : "PGN okunamadı",
        fensByPly: [START_FEN] as string[],
        uciMoves: [] as string[],
      };
    }
  }, [pgn]);
}

type BoardWithMovesProps = {
  sourceId: string;
  title: string;
  boardFen: string;
  rows: { num: number; white: string; black?: string }[];
  error: string | null;
  uciMoves: string[];
  safePly: number;
  maxPly: number;
  setSelectedPly: (ply: number) => void;
};

function BoardWithMoves({
  sourceId,
  title,
  boardFen,
  rows,
  error,
  uciMoves,
  safePly,
  maxPly,
  setSelectedPly,
}: BoardWithMovesProps) {
  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby={`${sourceId}-heading`}
    >
      <h2
        id={`${sourceId}-heading`}
        className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
      >
        {title}
      </h2>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <VoltBoard
          key={`${sourceId}-${boardFen}`}
          sourceId={sourceId}
          moves=""
          initialFen={boardFen}
          width={380}
          height={380}
          viewOnly
        />
        <div className="min-h-[200px] min-w-0 flex-1">
          <p className="text-muted-foreground mb-2 text-sm font-medium">
            UCI hamleler
          </p>
          {error && <p className="text-destructive mb-2 text-sm">{error}</p>}
          {uciMoves.length > 0 && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground mb-2 text-xs underline"
              onClick={() => setSelectedPly(0)}
            >
              Başlangıç pozisyonu
            </button>
          )}
          <div
            className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-sm leading-relaxed"
            role="list"
          >
            {rows.map((r) => {
              const whiteIdx = (r.num - 1) * 2;
              const blackIdx = (r.num - 1) * 2 + 1;
              return (
                <div
                  key={r.num}
                  role="listitem"
                  className="flex shrink-0 flex-wrap items-baseline gap-1"
                >
                  <span className="text-muted-foreground w-6 shrink-0 text-right">
                    {r.num}.
                  </span>
                  <button
                    type="button"
                    className={`hover:bg-muted rounded px-1.5 py-0.5 transition-colors ${
                      safePly === whiteIdx + 1
                        ? "bg-primary/20 font-medium"
                        : ""
                    }`}
                    onClick={() => setSelectedPly(whiteIdx + 1)}
                  >
                    {r.white}
                  </button>
                  {r.black !== undefined && (
                    <button
                      type="button"
                      className={`hover:bg-muted rounded px-1.5 py-0.5 transition-colors ${
                        safePly === blackIdx + 1
                          ? "bg-primary/20 font-medium"
                          : ""
                      }`}
                      onClick={() => setSelectedPly(blackIdx + 1)}
                    >
                      {r.black}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {uciMoves.length > 0 && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground mt-3 text-xs underline"
              onClick={() => setSelectedPly(maxPly)}
            >
              Son pozisyon
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

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
  const { rows, error, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = Math.max(0, fensByPly.length - 1);
  const initialPlyNum = Math.min(
    Math.max(0, parseInt(initialPly, 10) || 0),
    maxPly,
  );
  const displayPlyNum = Math.min(
    Math.max(0, parseInt(displayPly, 10) || 0),
    maxPly,
  );
  const initialFen = fensByPly[initialPlyNum] ?? START_FEN;
  const displayFen = fensByPly[displayPlyNum] ?? START_FEN;
  const derivedMoves = pgn
    ? (getUciMovesFromPgnAfterPly(pgn, initialPlyNum) ?? variant.moves)
    : variant.moves;

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
          <Input
            name="sortKey"
            type="number"
            defaultValue={variant.sortKey}
            className="font-mono"
          />
        </Field>
        <Field>
          <FieldLabel>Level</FieldLabel>
          <Input name="level" defaultValue={variant.level} required />
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
            value={String(displayPlyNum)}
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
            defaultValue={
              variant.goals != null
                ? JSON.stringify(variant.goals, null, 2)
                : ""
            }
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
              Seçilen ply:{" "}
              <span className="text-foreground font-mono tabular-nums">
                {initialPlyNum}
              </span>
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              displayFen (sağ board)
            </p>
            <p className="font-mono text-xs break-all">{displayFen}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Seçilen ply:{" "}
              <span className="text-foreground font-mono tabular-nums">
                {displayPlyNum}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-10 xl:grid-cols-2">
        <BoardWithMoves
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
        <BoardWithMoves
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
