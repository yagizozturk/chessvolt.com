"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import { useEffect, useRef } from "react";

import ArrowBoard, { type ArrowBoardHandle } from "@/features/arrows/components/arrow-board/arrow-board";
import { useArrowsController } from "@/features/arrows/hooks/use-arrows-controller";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";

type ArrowsControllerProps = {
  openingId: string;
  arrows: DrawShape[];
  size?: number;
};

export function ArrowsController({ openingId, arrows, size = 620 }: ArrowsControllerProps) {
  const boardRef = useRef<ArrowBoardHandle>(null);
  const previousApprovedCountRef = useRef(0);
  const { playCorrectSound } = useBoardSounds();
  const { boardArrows, userApprovedArrows, handleDrawChange, clearDefaultArrows } = useArrowsController({ arrows });

  useEffect(() => {
    const previousApprovedCount = previousApprovedCountRef.current;
    const currentApprovedCount = userApprovedArrows.length;
    if (currentApprovedCount > previousApprovedCount) {
      playCorrectSound();
    }
    previousApprovedCountRef.current = currentApprovedCount;
  }, [userApprovedArrows, playCorrectSound]);

  function handleClearArrows() {
    clearDefaultArrows();
    previousApprovedCountRef.current = 0;
    boardRef.current?.clearArrows();
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClearArrows}
        className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
      >
        Clear Arrows
      </button>
      <ArrowBoard
        ref={boardRef}
        sourceId={openingId}
        size={size}
        arrows={boardArrows}
        onDrawChange={handleDrawChange}
      />
    </div>
  );
}
