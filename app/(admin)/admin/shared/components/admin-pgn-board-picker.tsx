"use client";

import VoltBoard from "@/components/boards/volt-board/volt-board";

import type { UciMoveRow } from "../../hooks/use-uci-rows-from-pgn";

type Props = {
  sourceId: string;
  title: string;
  boardFen: string;
  rows: UciMoveRow[];
  error: string | null;
  uciMoves: string[];
  safePly: number;
  maxPly: number;
  setSelectedPly: (ply: number) => void;
};

export function AdminPgnBoardPicker({
  sourceId,
  title,
  boardFen,
  rows,
  error,
  uciMoves,
  safePly,
  maxPly,
  setSelectedPly,
}: Props) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby={`${sourceId}-heading`}>
      <h2 id={`${sourceId}-heading`} className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {title}
      </h2>
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
          <p className="text-muted-foreground mb-2 text-sm font-medium">UCI moves</p>
          {error && <p className="text-destructive mb-2 text-sm">{error}</p>}
          {uciMoves.length > 0 && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground mb-2 text-xs underline"
              onClick={() => setSelectedPly(0)}
            >
              Start position
            </button>
          )}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-sm leading-relaxed" role="list">
            {rows.map((r) => {
              const whiteIdx = (r.num - 1) * 2;
              const blackIdx = (r.num - 1) * 2 + 1;
              return (
                <div key={r.num} role="listitem" className="flex shrink-0 flex-wrap items-baseline gap-1">
                  <span className="text-muted-foreground w-6 shrink-0 text-right">{r.num}.</span>
                  <button
                    type="button"
                    className={`hover:bg-muted rounded px-1.5 py-0.5 transition-colors ${
                      safePly === whiteIdx + 1 ? "bg-primary/20 font-medium" : ""
                    }`}
                    onClick={() => setSelectedPly(whiteIdx + 1)}
                  >
                    {r.white}
                  </button>
                  {r.black !== undefined && (
                    <button
                      type="button"
                      className={`hover:bg-muted rounded px-1.5 py-0.5 transition-colors ${
                        safePly === blackIdx + 1 ? "bg-primary/20 font-medium" : ""
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
              Final position
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
