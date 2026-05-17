"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import { useEffect, useMemo, useRef, useState } from "react";

import ArrowBoard, { type ArrowBoardHandle } from "@/components/boards/arrow-board/arrow-board";
import { ImageInfoCard } from "@/components/cards/image-info-card";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useArrowsController } from "@/features/arrows/hooks/use-arrows-controller";
import { useArrowsTour } from "@/features/arrows/hooks/use-arrows-tour";
import {
  type OpeningArrowGroup,
  areAllOpeningArrowGroupsComplete,
  createArrowGroupsState,
  flattenOpeningArrowGroups,
  isOpeningArrowGroupComplete,
} from "@/features/openings/types/opening";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import targetAnimationData from "@/public/images/animations/animation-target-blue.json";

type ArrowsControllerProps = {
  openingId: string;
  arrowGroups: OpeningArrowGroup[];
  destinationPath: string;
  size?: number;
};

function markArrowCompleted(groups: OpeningArrowGroup[], orig: string, dest: string): OpeningArrowGroup[] {
  return groups.map((group) => ({
    ...group,
    arrows: group.arrows.map((arrow) =>
      arrow.orig === orig && arrow.dest === dest ? { ...arrow, isCompleted: true } : arrow,
    ),
  }));
}

export function ArrowsController({ openingId, arrowGroups, destinationPath, size = 620 }: ArrowsControllerProps) {
  const [groups, setGroups] = useState(() => createArrowGroupsState(arrowGroups));
  const [gameStarted, setGameStarted] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const arrows = useMemo(() => flattenOpeningArrowGroups(groups) as DrawShape[], [groups]);
  const boardRef = useRef<ArrowBoardHandle>(null);
  const previousApprovedKeysRef = useRef<Set<string>>(new Set());
  const hasShownSuccessRef = useRef(false);
  const { playCorrectSound, playLevelUpSound } = useBoardSounds();
  const { boardArrows, userApprovedArrows, handleDrawChange } = useArrowsController({ arrows });
  const { Tour } = useArrowsTour({ openingId });
  const visibleBoardArrows = gameStarted ? [] : boardArrows;

  useEffect(() => {
    if (!gameStarted) return;

    const currentKeys = new Set(userApprovedArrows.map((arrow) => `${arrow.orig}-${arrow.dest}`));

    for (const key of currentKeys) {
      if (previousApprovedKeysRef.current.has(key)) continue;

      const [orig, dest] = key.split("-");
      setGroups((prev) => markArrowCompleted(prev, orig, dest));
      playCorrectSound();
    }

    previousApprovedKeysRef.current = currentKeys;
  }, [gameStarted, userApprovedArrows, playCorrectSound]);

  useEffect(() => {
    if (!areAllOpeningArrowGroupsComplete(groups) || hasShownSuccessRef.current) return;

    hasShownSuccessRef.current = true;
    setSuccessDialogOpen(true);
    playLevelUpSound();
  }, [groups, playLevelUpSound]);

  function handleStartGame() {
    setGameStarted(true);
    boardRef.current?.clearArrows();
  }

  return (
    <div className="container mx-auto max-w-6xl px-20 py-6">
      {Tour}
      <SolveSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Congratulations!"
        description="You drew every arrow correctly. Return to the opening when you are ready."
        destinationPath={destinationPath}
        buttonLabel="Back to opening"
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative w-full min-w-0 lg:w-auto lg:shrink-0" data-tour="board">
          <ArrowBoard
            ref={boardRef}
            sourceId={openingId}
            size={size}
            arrows={visibleBoardArrows}
            drawingEnabled={gameStarted}
            onDrawChange={handleDrawChange}
          />
        </div>

        <div className="bg-card flex min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center justify-center px-4">
            <span className="text-lg font-bold">Draw The Ideal Position</span>
          </div>
          <Separator />
          <div className="flex flex-col items-center gap-4" data-tour="instructions">
            {groups.map((group) => (
              <ImageInfoCard
                key={group.id}
                animationData={targetAnimationData}
                title={group.title}
                description={group.description}
                isComplete={isOpeningArrowGroupComplete(group)}
              />
            ))}
          </div>
          <div className="mt-auto" data-tour="action-button">
            <Button variant="volt" onClick={handleStartGame} disabled={gameStarted} className="w-full">
              Start Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
