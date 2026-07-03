"use client";

import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";

import VoltBoard from "@/components/boards/volt-board/volt-board";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";

type VoltBoardNavigatorProps = {
  pgn: string;
  sourceId?: string;
  onFenChange?: (fen: string) => void;
};

export default function VoltBoardNavigator({
  pgn,
  sourceId = "volt-board-navigator",
  onFenChange,
}: VoltBoardNavigatorProps) {
  const [ply, setPly] = useState(0);

  const totalPly = useMemo(() => {
    try {
      const game = new Chess();
      game.loadPgn(pgn.trim(), { strict: false });
      return game.history().length;
    } catch {
      return 0;
    }
  }, [pgn]);

  const fen = useMemo(() => {
    return getFenFromPgnAtPly(pgn, ply) ?? new Chess().fen();
  }, [pgn, ply]);

  useEffect(() => {
    onFenChange?.(fen);
  }, [fen, onFenChange]);

  const canGoLeft = ply > 0;
  const canGoRight = ply < totalPly;

  return (
    <div className="p-4">
      <VoltBoard
        sourceId={sourceId}
        initialFen={fen}
        viewOnly
        onCheckMove={() => true}
        onSuccessMovePlayed={() => {}}
        onNextMoveRequest={() => undefined}
      />

      <div className="mt-10 flex items-center justify-center gap-3">
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
