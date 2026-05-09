"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import { useEffect, useRef } from "react";

import ArrowBoard, { type ArrowBoardHandle } from "@/components/boards/arrow-board/arrow-board";
import { Button } from "@/components/ui/button";
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
    <div className="container mx-auto max-w-6xl px-20 py-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative w-full min-w-0 lg:w-auto lg:shrink-0">
          <ArrowBoard
            ref={boardRef}
            sourceId={openingId}
            size={size}
            arrows={boardArrows}
            onDrawChange={handleDrawChange}
          />
        </div>
        {/* min-w-0: allows the right panel to shrink within the flex row */}
        <div className="bg-card flex min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">Arrows</span>
          </div>
          <div className="mt-auto">
            <Button variant="volt" onClick={handleClearArrows} className="w-full">
              Clear Arrows
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
