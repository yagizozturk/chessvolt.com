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
import { useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { OpeningVariantGoalViewer } from "@/features/openings/components/opening-variant-goal-viewer/opening-variant-goal-viewer";
import { useOpeningVariantTour } from "@/features/openings/hooks/use-opening-variant-tour";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { useSequenceAttempt } from "@/features/user-sequence-attempt/hooks/use-sequence-attempt";
import {
  buildAttemptCounters,
  bumpCorrectStreak,
} from "@/features/user-sequence-attempt/utilities/sequence-play-attempt-counters";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

type OpeningVariantControllerProps = {
  variant: OpeningVariant;
  nextVariantId: string | null;
  parentOpeningUrl: string;
};

export default function OpeningVariantController({
  variant,
  nextVariantId,
  parentOpeningUrl,
}: OpeningVariantControllerProps) {
  const sequenceId = variant.moveSequence.id;
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const { updateAttemptStatus, recordEvent } = useSequenceAttempt(sequenceId);
  const { playLevelUpSound } = useBoardSounds();
  const wrongMoveCountRef = useRef(0);
  const totalHintCountRef = useRef(0);
  const currentCorrectStreakRef = useRef(0);
  const maxCorrectStreakRef = useRef(0);
  const {
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    sortedGoals,
    progressValue,
    hintCount,
    hintRequested,
    currentCorrectMove,
  } = useMoveSequenceController({
    sourceId: variant.id,
    moves: variant.moveSequence.moves,
    goals: variant.moveSequence.goals,
    initialPly: variant.ply,
  });
  const { Tour } = useOpeningVariantTour({ variantId: variant.id });

  useEffect(() => {
    setIsCompleted(false);
    setSuccessDialogOpen(false);
    wrongMoveCountRef.current = 0;
    totalHintCountRef.current = 0;
    currentCorrectStreakRef.current = 0;
    maxCorrectStreakRef.current = 0;
  }, [variant.id]);

  useEffect(() => {
    if (currentCorrectMove != null || isCompleted) return;

    setIsCompleted(true);
    setSuccessDialogOpen(true);
    playLevelUpSound();

    void (async () => {
      await recordEvent({ eventType: "complete" });
      await updateAttemptStatus(
        "completed",
        buildAttemptCounters(
          sortedGoals,
          wrongMoveCountRef.current,
          totalHintCountRef.current,
          maxCorrectStreakRef.current,
        ),
      );
    })();
  }, [currentCorrectMove, isCompleted, playLevelUpSound, recordEvent, sortedGoals, updateAttemptStatus]);

  function handleBoardCheckMove(move: MoveAttemptPayload) {
    const { isCorrect } = handleMoveCheck(move);

    if (!isCorrect && !isCompleted) {
      wrongMoveCountRef.current += 1;
      currentCorrectStreakRef.current = 0;

      void (async () => {
        await recordEvent({
          eventType: "move",
          moveUci: move.uci,
          expectedUci: currentCorrectMove ?? undefined,
          isCorrect: false,
        });
        await updateAttemptStatus(
          "failed",
          buildAttemptCounters(
            sortedGoals,
            wrongMoveCountRef.current,
            totalHintCountRef.current,
            maxCorrectStreakRef.current,
          ),
        );
      })();
    } else if (isCorrect) {
      bumpCorrectStreak(currentCorrectStreakRef, maxCorrectStreakRef);

      void recordEvent({
        eventType: "move",
        moveUci: move.uci,
        expectedUci: currentCorrectMove ?? undefined,
        isCorrect: true,
      });
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
    totalHintCountRef.current += 1;

    void recordEvent({
      eventType: "hint",
      hintLevel: nextHintCount as 1 | 2,
      expectedUci: currentCorrectMove,
    });
  };

  const successDestinationPath = nextVariantId ? `/openings/variant/${nextVariantId}` : parentOpeningUrl;
  const successButtonLabel = nextVariantId ? "Next variant" : "Back to opening";

  const handleContinueClick = () => {
    router.push(successDestinationPath);
  };

  const successDescription = nextVariantId
    ? "You completed this line. Continue to the next variant when you are ready."
    : "You completed this line. Return to the opening when you are ready.";

  return (
    <div className="container mx-auto max-w-6xl px-20 py-6">
      {Tour}
      <SolveSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Congratulations!"
        description={successDescription}
        destinationPath={successDestinationPath}
        buttonLabel={successButtonLabel}
      />
      <Notifier goals={sortedGoals} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div key={variant.id} className="relative w-full min-w-0 lg:w-auto lg:shrink-0" data-tour="board">
          <VoltBoard
            ref={boardRef}
            sourceId={variant.id}
            initialFen={variant.moveSequence.initialFen}
            size={580}
            drawHintMove={currentCorrectMove}
            onCheckMove={handleBoardCheckMove}
            onSuccessMovePlayed={handleBoardSuccessMovePlayed}
            onNextMoveRequest={handleBoardNextMoveRequest}
          />
        </div>
        <div className="bg-card flex min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">{variant.title ?? "Untitled variant"}</span>
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
