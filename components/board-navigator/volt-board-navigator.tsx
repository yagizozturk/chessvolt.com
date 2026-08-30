"use client";

import { Chess } from "chess.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import VoltBoard from "@/components/boards/volt-board/volt-board";
import { Button } from "@/components/ui/button";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";
import { normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";

type VoltBoardNavigatorProps = {
  pgn: string;
  sourceId?: string;
  onFenChange?: (fen: string) => void;
  /** Controlled ply (0 = start). When set with onPlyChange, parent owns navigation. */
  ply?: number;
  onPlyChange?: (ply: number) => void;
};

export default function VoltBoardNavigator({
  pgn,
  sourceId = "volt-board-navigator",
  onFenChange,
  ply: plyProp,
  onPlyChange,
}: VoltBoardNavigatorProps) {
  const [internalPly, setInternalPly] = useState(0);
  const controlled = plyProp !== undefined;
  const ply = controlled ? plyProp : internalPly;

  const setPly = (next: number | ((prev: number) => number)) => {
    const value = typeof next === "function" ? next(ply) : next;
    if (controlled) {
      onPlyChange?.(value);
    } else {
      setInternalPly(value);
    }
  };

  const totalPly = useMemo(() => {
    try {
      const game = new Chess();
      game.loadPgn(normalizeLichessPgnComments(pgn.trim()), { strict: false });
      return game.history().length;
    } catch {
      return 0;
    }
  }, [pgn]);

  useEffect(() => {
    if (!controlled) {
      setInternalPly(0);
    }
  }, [pgn, controlled]);

  useEffect(() => {
    if (ply > totalPly) {
      setPly(totalPly);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clamp when PGN shortens
  }, [totalPly, ply]);

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
  }, [totalPly, ply, controlled, onPlyChange]);

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

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="voltIcon"
          onClick={() => setPly((prev) => Math.max(prev - 1, 0))}
          disabled={!canGoLeft}
          aria-label="Previous move"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <span className="text-muted-foreground min-w-16 text-center font-mono text-xs tabular-nums">
          {ply}/{totalPly}
        </span>

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
