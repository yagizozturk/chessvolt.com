"use client";

import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { Notifier } from "@/components/notifier/notifier";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import { OpeningVariantGoalViewer } from "@/features/openings/components/opening-variant-goal-viewer/opening-variant-goal-viewer";
import { useRiddleController } from "@/features/game-riddle/hooks/use-riddle-controller";
import { useUpdateGameRiddleAnswer } from "@/features/game-riddle/hooks/use-update-game-riddle";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

type RiddleControllerProps = {
  riddle: GameRiddle;
  nextRiddleId?: string | null;
  parentChallengeUrl?: string;
};

export default function RiddleController({
  riddle,
  nextRiddleId = null,
  parentChallengeUrl = "/",
}: RiddleControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { updateGameRiddleAnswerHook } = useUpdateGameRiddleAnswer();
  const { playLevelUpSound } = useBoardSounds();
  const {
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    sortedGoals,
    progressValue,
    hintCount,
    hintRequested,
    currentCorrectMove,
  } = useRiddleController({
    sourceId: riddle.id,
    moves: riddle.moves,
  });

  useEffect(() => {
    setIsCompleted(false);
  }, [riddle.id]);

  useEffect(() => {
    if (currentCorrectMove != null || isCompleted) return;

    setIsCompleted(true);
    playLevelUpSound();
    void updateGameRiddleAnswerHook(riddle.id, true);
  }, [currentCorrectMove, isCompleted, playLevelUpSound, riddle.id, updateGameRiddleAnswerHook]);

  function handleBoardCheckMove(move: MoveAttemptPayload) {
    const { isCorrect } = handleMoveCheck(move);

    if (!isCorrect && !isCompleted) {
      void updateGameRiddleAnswerHook(riddle.id, false);
    }

    return isCorrect;
  }

  function handleBoardSuccessMovePlayed(move: Move) {
    handleSuccessMovePlayed(move);
  }

  function handleBoardNextMoveRequest() {
    const nextMove = handleNextMoveRequest();
    return nextMove;
  }

  const handleHintClick = () => {
    const nextHintCount = hintRequested();
    if (nextHintCount == null || !currentCorrectMove) return;
    boardRef.current?.showHint(nextHintCount);
  };

  const handleContinueClick = () => {
    const destinationPath = nextRiddleId ? `/game-riddle/${nextRiddleId}` : parentChallengeUrl;
    router.push(destinationPath);
  };

  return (
    <div className="container mx-auto max-w-6xl px-20 py-6">
      <Notifier goals={sortedGoals} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div key={riddle.id} className="relative w-full min-w-0 lg:w-auto lg:shrink-0">
          <VoltBoard
            ref={boardRef}
            sourceId={riddle.id}
            initialFen={riddle.displayFen ?? undefined}
            size={580}
            drawHintMove={currentCorrectMove}
            onCheckMove={handleBoardCheckMove}
            onSuccessMovePlayed={handleBoardSuccessMovePlayed}
            onNextMoveRequest={handleBoardNextMoveRequest}
          />
        </div>
        <div className="bg-card flex min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">{riddle.title ?? "Untitled riddle"}</span>
          </div>
          <div className="flex items-center">
            <Progress value={progressValue} className="h-4 flex-1 rounded-r-none" />
            <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
              <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
            </div>
          </div>
          <OpeningVariantGoalViewer goals={sortedGoals} />
          <div className="mt-auto">
            {!isCompleted ? (
              <div>
                <Button variant="volt" onClick={handleHintClick} disabled={hintCount >= 2} className="w-full">
                  Hint
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                <Button variant="volt" onClick={handleContinueClick} className="w-full">
                  {nextRiddleId ? "Next riddle" : "Back to challenge"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isCompleted ? (
        <Confetti aria-hidden className="pointer-events-none fixed inset-0 z-50 size-full max-h-none max-w-none" />
      ) : null}
    </div>
  );
}
