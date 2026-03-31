"use client";

import VoltBoard from "@/components/volt-board/volt-board";
import { getUciMovesFromPgn } from "@/lib/chess/extractMovesFromPgn";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";

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
        fen: null as string | null,
        fensByPly: [START_FEN] as string[],
        uciMoves: [] as string[],
      };
    }
    try {
      const game = new Chess();
      game.loadPgn(trimmed, { strict: false });
      const fen = game.fen();
      const uciStr = getUciMovesFromPgn(pgn);
      if (!uciStr) {
        return {
          rows: [],
          error: null,
          fen,
          fensByPly: [fen],
          uciMoves: [] as string[],
        };
      }
      const uciMoves = uciStr.split(" ");
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

      return { rows, error: null, fen, fensByPly, uciMoves };
    } catch (e) {
      return {
        rows: [] as { num: number; white: string; black?: string }[],
        error: e instanceof Error ? e.message : "PGN okunamadı",
        fen: null,
        fensByPly: [START_FEN] as string[],
        uciMoves: [] as string[],
      };
    }
  }, [pgn]);
}

type BoardWithMovesProps = {
  sourceId: string;
  title: string;
  /** VoltBoard `initialFen` — sol panelde initial, sağda display pozisyonu */
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
          mode="opening"
          moves=""
          initialFen={boardFen}
          width={420}
          height={420}
          viewOnly
        />
        <div className="min-h-[200px] min-w-0 flex-1 lg:max-w-md">
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
          <ol className="font-mono text-sm leading-relaxed">
            {rows.map((r) => {
              const whiteIdx = (r.num - 1) * 2;
              const blackIdx = (r.num - 1) * 2 + 1;
              return (
                <li
                  key={r.num}
                  className="flex flex-wrap items-baseline gap-2 gap-y-1"
                >
                  <span className="text-muted-foreground w-6 shrink-0">
                    {r.num}.
                  </span>
                  <span className="flex flex-wrap gap-1">
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
                  </span>
                </li>
              );
            })}
          </ol>
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

export default function PgnMoveSelectorPage() {
  const [pgn, setPgn] = useState("");
  const { rows, error, fensByPly, uciMoves } = useUciRowsFromPgn(pgn);
  const maxPly = Math.max(0, fensByPly.length - 1);

  const [selectedPlyInitial, setSelectedPlyInitial] = useState(0);
  const [selectedPlyDisplay, setSelectedPlyDisplay] = useState(0);

  useEffect(() => {
    setSelectedPlyInitial(maxPly);
    setSelectedPlyDisplay(maxPly);
  }, [pgn, maxPly]);

  const safePlyInitial = Math.min(Math.max(0, selectedPlyInitial), maxPly);
  const safePlyDisplay = Math.min(Math.max(0, selectedPlyDisplay), maxPly);
  const initialFen = fensByPly[safePlyInitial] ?? START_FEN;
  const displayFen = fensByPly[safePlyDisplay] ?? START_FEN;

  return (
    <div className="container mx-auto max-w-[110rem] space-y-4 p-8">
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
                {safePlyInitial}
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
                {safePlyDisplay}
              </span>
            </p>
          </div>
        </div>
        <p className="text-muted-foreground border-border mt-3 border-t pt-3 text-[11px] leading-relaxed">
          <span className="text-foreground/80 font-medium">Note: </span>
          The selected ply is the number of half-moves played. If it is odd, it
          is Black&apos;s turn; if it is even, it is White&apos;s turn. If it is
          odd, board orientation is Black; if it is even, board orientation is
          White.
        </p>
      </div>

      <div className="grid gap-10 xl:grid-cols-2">
        <BoardWithMoves
          sourceId="pgn-move-selector-initial"
          title="Sol — initial"
          boardFen={initialFen}
          rows={rows}
          error={error}
          uciMoves={uciMoves}
          safePly={safePlyInitial}
          maxPly={maxPly}
          setSelectedPly={setSelectedPlyInitial}
        />
        <BoardWithMoves
          sourceId="pgn-move-selector-display"
          title="Sağ — display"
          boardFen={displayFen}
          rows={rows}
          error={error}
          uciMoves={uciMoves}
          safePly={safePlyDisplay}
          maxPly={maxPly}
          setSelectedPly={setSelectedPlyDisplay}
        />
      </div>

      <textarea
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
        className="border-input h-40 w-full rounded-md border bg-transparent p-2 font-mono text-sm"
        placeholder="PGN"
        spellCheck={false}
      />
    </div>
  );
}
