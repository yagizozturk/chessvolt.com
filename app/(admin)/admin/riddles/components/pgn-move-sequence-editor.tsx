"use client";

import { useMemo, useState } from "react";

import VoltBoard from "@/components/boards/volt-board/volt-board";
import { Button } from "@/components/ui/button";

import type { UciMoveRow } from "../../hooks/use-uci-rows-from-pgn";

type PlyRole = "initial" | "display" | "end";

type Props = {
  sourceId: string;
  pgn: string;
  onPgnChange?: (pgn: string) => void;
  readOnlyPgn?: boolean;
  rows: UciMoveRow[];
  error: string | null;
  uciMoves: string[];
  fensByPly: string[];
  initialPly: number;
  displayPly: number;
  endPly: number;
  onInitialPlyChange: (ply: number) => void;
  onDisplayPlyChange: (ply: number) => void;
  onEndPlyChange: (ply: number) => void;
};

function plyButtonClass(isSelected: boolean, role: PlyRole): string {
  const base = "hover:bg-muted rounded px-1.5 py-0.5 transition-colors";
  if (!isSelected) return base;
  if (role === "initial") return `${base} bg-green-500/25 font-medium`;
  if (role === "display") return `${base} bg-primary/25 font-medium`;
  return `${base} bg-orange-500/25 font-medium`;
}

export function PgnMoveSequenceEditor({
  sourceId,
  pgn,
  onPgnChange,
  readOnlyPgn = false,
  rows,
  error,
  uciMoves,
  fensByPly,
  initialPly,
  displayPly,
  endPly,
  onInitialPlyChange,
  onDisplayPlyChange,
  onEndPlyChange,
}: Props) {
  const [activeRole, setActiveRole] = useState<PlyRole>("display");
  const maxPly = uciMoves.length;
  const boardFen = fensByPly[displayPly] ?? fensByPly[0] ?? "";

  const answerMoves = useMemo(() => {
    if (endPly <= initialPly) return "";
    return uciMoves.slice(initialPly, endPly).join(" ");
  }, [uciMoves, initialPly, endPly]);

  function handlePlyClick(ply: number) {
    if (activeRole === "initial") onInitialPlyChange(ply);
    else if (activeRole === "display") onDisplayPlyChange(ply);
    else onEndPlyChange(ply);
  }

  function isPlyMarked(ply: number, role: PlyRole): boolean {
    if (role === "initial") return initialPly === ply;
    if (role === "display") return displayPly === ply;
    return endPly === ply;
  }

  function renderPlyButton(ply: number, label: string) {
    const markedInitial = isPlyMarked(ply, "initial");
    const markedDisplay = isPlyMarked(ply, "display");
    const markedEnd = isPlyMarked(ply, "end");
    const className = [
      "rounded px-1.5 py-0.5 transition-colors",
      markedInitial ? "bg-green-500/25" : "",
      markedDisplay ? "ring-primary ring-1" : "",
      markedEnd ? "bg-orange-500/25" : "",
      !markedInitial && !markedDisplay && !markedEnd ? "hover:bg-muted" : "font-medium",
    ].join(" ");

    return (
      <button type="button" className={className} onClick={() => handlePlyClick(ply)}>
        {label}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {!readOnlyPgn ? (
        <textarea
          name="pgn"
          rows={8}
          value={pgn}
          onChange={(e) => onPgnChange?.(e.target.value)}
          required
          className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 font-mono text-xs shadow-xs outline-none focus-visible:ring-[3px]"
          placeholder="Paste PGN here…"
        />
      ) : (
        <input type="hidden" name="pgn" value={pgn} />
      )}

      <input type="hidden" name="initialPly" value={initialPly} />
      <input type="hidden" name="displayPly" value={displayPly} />
      <input type="hidden" name="endPly" value={endPly} />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={activeRole === "initial" ? "default" : "outline"}
          onClick={() => setActiveRole("initial")}
        >
          Set initial ply ({initialPly})
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activeRole === "display" ? "default" : "outline"}
          onClick={() => setActiveRole("display")}
        >
          Set display ply ({displayPly})
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activeRole === "end" ? "default" : "outline"}
          onClick={() => setActiveRole("end")}
        >
          Set end ply ({endPly})
        </Button>
      </div>

      <p className="text-muted-foreground text-xs">
        Click a move to assign it as the active role. Green = initial, ring = display, orange = end.
      </p>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <VoltBoard
          key={`${sourceId}-${boardFen}`}
          sourceId={sourceId}
          initialFen={boardFen}
          viewOnly
          onCheckMove={() => true}
          onSuccessMovePlayed={() => {}}
          onNextMoveRequest={() => undefined}
        />
        <div className="min-h-[200px] min-w-0 flex-1">
          <p className="text-muted-foreground mb-2 text-sm font-medium">Moves</p>
          {error && <p className="text-destructive mb-2 text-sm">{error}</p>}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-sm leading-relaxed">
            {rows.map((r) => {
              const whitePly = (r.num - 1) * 2 + 1;
              const blackPly = (r.num - 1) * 2 + 2;
              return (
                <div key={r.num} className="flex shrink-0 flex-wrap items-baseline gap-1">
                  <span className="text-muted-foreground w-6 shrink-0 text-right">{r.num}.</span>
                  {renderPlyButton(whitePly, r.white)}
                  {r.black !== undefined ? renderPlyButton(blackPly, r.black) : null}
                </div>
              );
            })}
          </div>
          {maxPly > 0 ? (
            <button
              type="button"
              className={plyButtonClass(isPlyMarked(0, activeRole), activeRole)}
              onClick={() => handlePlyClick(0)}
            >
              Start (ply 0)
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-muted-foreground mb-1 text-sm font-medium">Answer moves (UCI, read-only)</p>
        <textarea
          readOnly
          rows={2}
          value={answerMoves}
          className="bg-muted/50 w-full rounded-md border px-3 py-2 font-mono text-xs"
        />
      </div>
    </div>
  );
}
