"use client";

import { Chess } from "chess.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import VoltBoard from "@/components/boards/volt-board/volt-board";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    onFenChange?.(fen);
  }, [fen, onFenChange]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      event.preventDefault();

      if (event.key === "ArrowLeft") {
        setPly((prev) => Math.max(prev - 1, 0));
        return;
      }

      setPly((prev) => Math.min(prev + 1, totalPly));
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalPly]);

  const canGoLeft = ply > 0;
  const canGoRight = ply < totalPly;

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

      <div className="flex items-center justify-center gap-3 md:hidden">
        <Button
          variant="voltIcon"
          onClick={() => setPly((prev) => Math.max(prev - 1, 0))}
          disabled={!canGoLeft}
          aria-label="Previous move"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <Button
          variant="voltIcon"
          onClick={() => setPly((prev) => Math.min(prev + 1, totalPly))}
          disabled={!canGoRight}
          aria-label="Next move"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
