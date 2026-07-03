"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import { Mouse } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import ArrowBoard, { type ArrowBoardHandle } from "@/components/boards/arrow-board/arrow-board";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowsGoalCard } from "@/features/arrows/components/arrows-goal-card/arrows-goal-card";
import { useArrowsController } from "@/features/arrows/hooks/use-arrows-controller";
import { useArrowsTour } from "@/features/arrows/hooks/use-arrows-tour";
import {
  type OpeningArrowGroup,
  areAllOpeningArrowGroupsComplete,
  createArrowGroupsState,
  flattenOpeningArrowGroups,
  getOpeningArrowGroupProgress,
  isOpeningArrowGroupComplete,
} from "@/features/openings/types/opening";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";

// ============================================================================
// Types
// ============================================================================
type ArrowsControllerProps = {
  openingId: string;
  arrowGroups: OpeningArrowGroup[];
  destinationPath: string;
  size?: number;
};

// ============================================================================
// Arrow state helpers
// Returns a copy of arrow groups with the matching arrow marked completed.
// ============================================================================
function markArrowCompleted(groups: OpeningArrowGroup[], orig: string, dest: string): OpeningArrowGroup[] {
  return groups.map((group) => ({
    ...group,
    arrows: group.arrows.map((arrow) =>
      arrow.orig === orig && arrow.dest === dest ? { ...arrow, isCompleted: true } : arrow,
    ),
  }));
}

// ============================================================================
// Renders the arrows exercise: board, group progress cards, start flow, and success dialog.
// ============================================================================
export function ArrowsController({ openingId, arrowGroups, destinationPath, size = 584 }: ArrowsControllerProps) {
  const [groups, setGroups] = useState(() => createArrowGroupsState(arrowGroups));
  const [gameStarted, setGameStarted] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const arrows = useMemo(() => flattenOpeningArrowGroups(groups) as DrawShape[], [groups]);
  const boardRef = useRef<ArrowBoardHandle>(null);
  const previousApprovedKeysRef = useRef<Set<string>>(new Set());
  const completedGroupIdsRef = useRef<Set<string>>(new Set());
  const hasShownSuccessRef = useRef(false);
  const { playCorrectSound, playLevelUpSound, playMoveSound, playWrongMoveSound } = useBoardSounds();
  const { boardArrows, userApprovedArrows, handleDrawChange } = useArrowsController({
    arrows,
    onWrongArrow: playWrongMoveSound,
  });
  const { Tour } = useArrowsTour({ openingId });
  const visibleBoardArrows = gameStarted ? [] : boardArrows;

  // ============================================================================
  // Approved-arrow completion sync
  // ============================================================================
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

  // ============================================================================
  // Group completion sounds
  // ============================================================================
  useEffect(() => {
    if (!gameStarted) return;

    for (const group of groups) {
      if (!isOpeningArrowGroupComplete(group) || completedGroupIdsRef.current.has(group.id)) continue;

      completedGroupIdsRef.current.add(group.id);
      playLevelUpSound();
    }
  }, [gameStarted, groups, playLevelUpSound]);

  // ============================================================================
  // All-groups success dialog
  // ============================================================================
  useEffect(() => {
    if (!areAllOpeningArrowGroupsComplete(groups) || hasShownSuccessRef.current) return;

    hasShownSuccessRef.current = true;
    setSuccessDialogOpen(true);
  }, [groups]);

  // ============================================================================
  // Starts the exercise: plays a move sound, enables drawing, and clears preview arrows.
  // ============================================================================
  function handleStartGame() {
    playMoveSound();
    setGameStarted(true);
    boardRef.current?.clearArrows();
  }

  return (
    <div className="container mx-auto max-w-6xl p-8 lg:px-20 lg:py-14">
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
            destinationPath={destinationPath}
          />
        </div>

        <div className="bg-card flex min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center justify-center px-4" data-tour="title-bar">
            <span className="text-lg font-bold">Draw The Ideal Position</span>
          </div>
          <Separator />

          <div className="flex flex-col items-center gap-2" data-tour="instructions">
            {groups.map((group) => {
              const { completed, total } = getOpeningArrowGroupProgress(group);

              return (
                <ArrowsGoalCard
                  key={group.id}
                  iconColor={group.color}
                  title={group.title}
                  description={group.description}
                  isComplete={isOpeningArrowGroupComplete(group)}
                  completedCount={completed}
                  totalCount={total}
                />
              );
            })}
          </div>

          <div className="mt-auto">
            <div
              className="bg-destructive/30 mb-3 flex w-full flex-col gap-2 rounded-2xl px-4 py-2 transition-opacity"
              data-tour="mouse-required"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                  <Mouse className="text-primary size-6 shrink-0" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    Mouse <span className="text-primary font-bold">right click</span> or trackpad{" "}
                    <span className="text-primary font-bold">secondary click</span> to draw an arrow is{" "}
                    <span className="text-primary font-bold">required</span>.
                  </p>
                </div>
              </div>
            </div>
            <div data-tour="action-button">
              <Button variant="volt" onClick={handleStartGame} disabled={gameStarted} className="w-full">
                Start Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
