"use client";

import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { Notifier } from "@/components/notifier/notifier";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import { useRiddleController } from "@/features/game-riddle/hooks/use-riddle-controller";
import { useRiddleTour } from "@/features/game-riddle/hooks/use-riddle-tour";
import { useUpdateGameRiddleAnswer } from "@/features/game-riddle/hooks/use-update-game-riddle";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import { OpeningVariantGoalViewer } from "@/features/openings/components/opening-variant-goal-viewer/opening-variant-goal-viewer";
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
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
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
    moves: riddle.moveSequence.moves,
  });
  const { Tour } = useRiddleTour({ riddleId: riddle.id });

  useEffect(() => {
    setIsCompleted(false);
    setSuccessDialogOpen(false);
  }, [riddle.id]);

  useEffect(() => {
    if (currentCorrectMove != null || isCompleted) return;

    setIsCompleted(true);
    setSuccessDialogOpen(true);
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

  const successDestinationPath = nextRiddleId ? `/game-riddle/${nextRiddleId}` : parentChallengeUrl;
  const successButtonLabel = nextRiddleId ? "Next riddle" : "Back to challenge";

  const handleContinueClick = () => {
    router.push(successDestinationPath);
  };

  const successDescription = nextRiddleId
    ? "You solved this riddle. Continue to the next one when you are ready."
    : parentChallengeUrl === "/"
      ? "You solved this riddle. Continue from the home page when you are ready."
      : "You solved this riddle. Return to the challenge when you are ready.";

  return (
    <div className="container mx-auto max-w-6xl px-20 py-6">
      {Tour}
      <SolveSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Riddle solved"
        description={successDescription}
        destinationPath={successDestinationPath}
        buttonLabel={successButtonLabel}
      />
      <Notifier goals={sortedGoals} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div key={riddle.id} className="relative w-full min-w-0 lg:w-auto lg:shrink-0" data-tour="board">
          <VoltBoard
            ref={boardRef}
            sourceId={riddle.id}
            initialFen={riddle.moveSequence.displayFen ?? riddle.moveSequence.initialFen}
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
          <div className="flex items-center" data-tour="progress">
            <Progress value={progressValue} className="h-4 flex-1 rounded-r-none" />
            <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
              <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
            </div>
          </div>
          <div data-tour="goals">
            <OpeningVariantGoalViewer goals={sortedGoals} />
          </div>
          <div className="mt-auto" data-tour="hint-button">
            {!isCompleted ? (
              <div>
                <Button variant="volt" onClick={handleHintClick} disabled={hintCount >= 2} className="w-full">
                  Hint
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                <Button variant="volt" onClick={handleContinueClick} className="w-full">
                  {successButtonLabel}
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
