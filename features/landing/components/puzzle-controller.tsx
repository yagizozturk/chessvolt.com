"use client";

import { Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { GoalViewer } from "@/components/goal-viewer/goal-viewer";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { MAX_HINT_COUNT, useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTurnLabel } from "@/lib/chess/getTurnLabel";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

type LandingPuzzleControllerProps = {
  puzzle: Puzzle;
};

// ================================================================================================
// Landing sayfası için demo puzzle. Deneme/rating/favori yazılmaz, ziyaretçi sadece oynar.
// ================================================================================================
export function LandingPuzzleController({ puzzle }: LandingPuzzleControllerProps) {
  const boardRef = useRef<VoltBoardHandle>(null);
  const isMobile = useIsMobile();
  const [replayKey, setReplayKey] = useState(0);
  const sessionId = `landing-demo:${puzzle.id}:${replayKey}`;
  const turnLabel = getTurnLabel(puzzle.moveSequence.initialFen);
  const [isCompleted, setIsCompleted] = useState(false);
  const { playLevelUpSound } = useBoardSounds();

  const {
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    sortedGoals,
    nextGoal,
    hintCount,
    hintRequested,
    expectedCurrentCorrectMoveUci,
    mainIdea,
  } = useMoveSequenceController({
    sourceId: sessionId,
    moves: puzzle.moveSequence.moves,
    goals: puzzle.moveSequence.goals,
  });

  useEffect(() => {
    setIsCompleted(false);
  }, [replayKey]);

  useEffect(() => {
    if (expectedCurrentCorrectMoveUci != null || isCompleted) return;
    setIsCompleted(true);
    playLevelUpSound();
  }, [expectedCurrentCorrectMoveUci, isCompleted, playLevelUpSound]);

  const handleBoardCheckMove = (move: MoveAttemptPayload) => handleMoveCheck(move).isCorrect;

  const handleHintClick = () => {
    const nextHintCount = hintRequested();
    if (nextHintCount == null || !expectedCurrentCorrectMoveUci) return;
    boardRef.current?.showHint(nextHintCount);
  };

  const handlePlayAgain = () => {
    setReplayKey((key) => key + 1);
  };

  return (
    <div className="relative flex w-full flex-col gap-4 md:flex-row">
      {isCompleted ? (
        <Confetti aria-hidden className="pointer-events-none absolute inset-0 z-10 size-full max-h-none max-w-none" />
      ) : null}

      <div className="bg-card flex w-full shrink-0 flex-col self-start rounded-xl p-4 md:min-w-0 md:flex-[3]">
        <div key={sessionId} className="relative aspect-square w-full">
          <VoltBoard
            ref={boardRef}
            sourceId={sessionId}
            mode="practice"
            initialFen={puzzle.moveSequence.initialFen}
            coordinates={!isMobile}
            drawHintMove={expectedCurrentCorrectMoveUci}
            activeGoalVisuals={nextGoal?.visuals}
            onCheckMove={handleBoardCheckMove}
            onSuccessMovePlayed={handleSuccessMovePlayed}
            onNextMoveRequest={handleNextMoveRequest}
          />
        </div>
      </div>

      <div className="bg-card flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
        <GoalViewer
          goals={sortedGoals}
          mode="practice"
          turnLabel={turnLabel}
          mainIdea={mainIdea}
          showMainIdea={false}
        />

        <div className="mt-auto flex gap-2">
          {!isCompleted ? (
            <Button
              variant="voltGreen"
              onClick={handleHintClick}
              disabled={hintCount >= MAX_HINT_COUNT}
              className="w-full min-w-0 flex-1"
            >
              <Eye data-icon="inline-start" />
              Hint
            </Button>
          ) : (
            <>
              <Button variant="voltGreen" onClick={handlePlayAgain} className="min-w-0 flex-1">
                <RotateCcw data-icon="inline-start" />
                Play again
              </Button>
              <Button variant="volt" asChild className="min-w-0 flex-1">
                <Link href="/puzzles">More puzzles</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
