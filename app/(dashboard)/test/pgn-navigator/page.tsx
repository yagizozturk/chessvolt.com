"use client";

import { Chess } from "chess.js";
import { useMemo, useState } from "react";

import DisplayBoard from "@/components/boards/display-board/display-board";
import VoltBoard from "@/components/boards/volt-board/volt-board";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";

const SAMPLE_PGN = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6`;

export default function PgnNavigatorPage() {
  const [pgn, setPgn] = useState(SAMPLE_PGN);
  const [ply, setPly] = useState(0);

  const totalPly = useMemo(() => {
    try {
      const game = new Chess();
      game.loadPgn(pgn.trim(), { strict: false });
      return game.history().length; // finding total ply legnth
    } catch {
      return 0;
    }
  }, [pgn]);

  const fen = useMemo(() => {
    return getFenFromPgnAtPly(pgn, ply) ?? new Chess().fen();
  }, [pgn, ply]);

  const canGoLeft = ply > 0;
  const canGoRight = ply < totalPly;

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <textarea
        value={pgn}
        onChange={(e) => {
          setPgn(e.target.value);
          setPly(0); // reset when PGN changes
        }}
        className="border-input h-40 w-full rounded-md border bg-transparent p-2 font-mono text-sm"
      />

      <div className="flex flex-wrap gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">DisplayBoard</p>
          <DisplayBoard
            sourceId="pgn-navigator-display"
            initialFen={fen}
            size={360}
            coordinates
            playerOrientation="white"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">VoltBoard</p>
          <VoltBoard
            sourceId="pgn-navigator-volt"
            initialFen={fen}
            size={360}
            viewOnly
            onCheckMove={() => true}
            onSuccessMovePlayed={() => {}}
            onNextMoveRequest={() => undefined}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPly((prev) => Math.max(prev - 1, 0))}
          disabled={!canGoLeft}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          ←
        </button>

        <span className="text-sm">
          Ply {ply} / {totalPly}
        </span>

        <button
          type="button"
          onClick={() => setPly((prev) => Math.min(prev + 1, totalPly))}
          disabled={!canGoRight}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
