"use client";

import VoltBoard from "@/components/volt-board/volt-board";
import { getUciMovesFromPgn } from "@/lib/chess/extractMovesFromPgn";
import { Chess } from "chess.js";
import { useMemo, useState } from "react";

function useUciRowsFromPgn(pgn: string) {
  return useMemo(() => {
    const trimmed = pgn.trim();
    if (!trimmed) {
      return { rows: [] as { num: number; white: string; black?: string }[], error: null as string | null };
    }
    try {
      new Chess().loadPgn(trimmed, { strict: false });
      const uciStr = getUciMovesFromPgn(pgn);
      if (!uciStr) {
        return { rows: [], error: null };
      }
      const moves = uciStr.split(" ");
      const rows: { num: number; white: string; black?: string }[] = [];
      for (let i = 0; i < moves.length; i += 2) {
        rows.push({
          num: Math.floor(i / 2) + 1,
          white: moves[i]!,
          ...(moves[i + 1] !== undefined ? { black: moves[i + 1] } : {}),
        });
      }
      return { rows, error: null };
    } catch (e) {
      return {
        rows: [] as { num: number; white: string; black?: string }[],
        error: e instanceof Error ? e.message : "PGN okunamadı",
      };
    }
  }, [pgn]);
}

export default function PgnMoveSelectorPage() {
  const [pgn, setPgn] = useState("");
  const { rows, error } = useUciRowsFromPgn(pgn);

  return (
    <div className="container mx-auto max-w-5xl space-y-4 p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <VoltBoard
          sourceId="pgn-move-selector"
          mode="opening"
          moves=""
          width={500}
          height={500}
          viewOnly
        />
        <div className="min-h-[200px] min-w-0 flex-1 lg:max-w-md">
          <p className="text-muted-foreground mb-2 text-sm font-medium">UCI hamleler</p>
          {error && (
            <p className="text-destructive mb-2 text-sm">{error}</p>
          )}
          <ol className="font-mono text-sm leading-relaxed">
            {rows.map((r) => (
              <li key={r.num} className="flex gap-2">
                <span className="text-muted-foreground w-6 shrink-0">{r.num}.</span>
                <span>
                  {r.white}
                  {r.black !== undefined ? ` ${r.black}` : ""}
                </span>
              </li>
            ))}
          </ol>
        </div>
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
