"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import { useRef } from "react";

import ArrowBoard, { type ArrowBoardHandle } from "@/features/arrows/components/arrow-board/arrow-board";
import { useArrowsController } from "@/features/arrows/hooks/use-arrows-controller";

type ArrowsControllerProps = {
  openingId: string;
  arrows: DrawShape[];
  size?: number;
};

export function ArrowsController({ openingId, arrows, size = 620 }: ArrowsControllerProps) {
  const boardRef = useRef<ArrowBoardHandle>(null);
  const { boardArrows, handleDrawChange, clearDefaultArrows } = useArrowsController({ arrows });

  function handleClearArrows() {
    clearDefaultArrows();
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
