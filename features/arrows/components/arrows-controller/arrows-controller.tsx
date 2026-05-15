"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import { useEffect, useMemo, useRef } from "react";

import ArrowBoard, { type ArrowBoardHandle } from "@/components/boards/arrow-board/arrow-board";
import { ImageInfoCard } from "@/components/cards/image-info-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useArrowsController } from "@/features/arrows/hooks/use-arrows-controller";
import type { OpeningArrowGroup } from "@/features/openings/types/opening";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";

const GROUP_CARD_IMAGES = ["/images/cards/pawn-pyramid.png", "/images/cards/signature-move.png"] as const;

type ArrowsControllerProps = {
  openingId: string;
  arrowGroups: OpeningArrowGroup[];
  size?: number;
};

export function ArrowsController({ openingId, arrowGroups, size = 620 }: ArrowsControllerProps) {
  const arrows = useMemo(
    () => (arrowGroups.flatMap((group) => group.arrows) ?? []) as DrawShape[],
    [arrowGroups],
  );
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
          <div className="flex items-center justify-center px-4">
            <span className="text-lg font-bold">Draw The Ideal Position</span>
          </div>
          <Separator />
          <div className="flex flex-col items-center gap-4">
            {arrowGroups.map((group, index) => (
              <ImageInfoCard
                key={group.id}
                imageSrc={GROUP_CARD_IMAGES[index % GROUP_CARD_IMAGES.length]}
                imageAlt={group.title}
                title={group.title}
                description={group.description}
              />
            ))}
          </div>
          <div className="mt-auto">
            <Button variant="volt" onClick={handleClearArrows} className="w-full">
              Start Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
