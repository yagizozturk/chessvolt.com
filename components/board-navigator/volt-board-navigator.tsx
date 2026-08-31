"use client";

import { Chess } from "chess.js";
import { useCallback, useEffect, useMemo, useState } from "react";

import VoltBoard from "@/components/boards/volt-board/volt-board";
import { MoveNavigatorControls } from "@/components/move-navigator-controls/move-navigator-controls";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";

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

  const playerOrientation = useMemo(() => {
    const startFen = getFenFromPgnAtPly(pgn, 0) ?? new Chess().fen();
    return getOrientationFromFen(startFen);
  }, [pgn]);

  const goToPreviousPly = useCallback(() => {
    setPly((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToNextPly = useCallback(() => {
    setPly((prev) => Math.min(prev + 1, totalPly));
  }, [totalPly]);

  useEffect(() => {
    setPly((prev) => Math.min(prev, totalPly));
  }, [totalPly]);

  useEffect(() => {
    onFenChange?.(fen);
  }, [fen, onFenChange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square w-full">
        <VoltBoard
          key={`${sourceId}-${fen}`}
          sourceId={sourceId}
          initialFen={fen}
          playerOrientation={playerOrientation}
          viewOnly
          onCheckMove={() => true}
          onSuccessMovePlayed={() => {}}
          onNextMoveRequest={() => undefined}
        />
      </div>
      <MoveNavigatorControls
        currentPly={ply}
        totalPly={totalPly}
        onPrevious={goToPreviousPly}
        onNext={goToNextPly}
        className="md:hidden"
      />
    </div>
  );
}
