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
import { OpeningVariantGoalViewer } from "@/features/openings/components/opening-variant-goal-viewer/opening-variant-goal-viewer";
import type { MoveGoal } from "@/features/openings/types/opening-variant";
import { useRiddleAttempt } from "@/features/riddle/hooks/use-riddle-attempt";
import { useRiddleController } from "@/features/riddle/hooks/use-riddle-controller";
import { useRiddleTour } from "@/features/riddle/hooks/use-riddle-tour";
import type { Riddle } from "@/features/riddle/types/riddle";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import { getRiddlePlayable } from "@/lib/shared/utilities/move-sequence-playable";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

type RiddleControllerProps = {
  riddle: Riddle;
  nextRiddleId?: string | null;
  parentChallengeUrl?: string;
};

/** Derives attempt stats (correct moves, wrong moves, hints, streak) from completed goals. */
function buildAttemptCounters(sortedGoals: MoveGoal[], wrongMoveCount: number, hintCount: number) {
  const correctMoveCount = sortedGoals.filter((goal) => goal.isCompleted).length;

  return {
    correctMoveCount,
    wrongMoveCount,
    hintCount,
    maxCorrectStreak: correctMoveCount,
  };
}

/** Main riddle play UI: board, progress, hints, and completion flow. */
export default function RiddleController({
  riddle,
  nextRiddleId = null,
  parentChallengeUrl = "/",
}: RiddleControllerProps) {
  const playable = getRiddlePlayable(riddle);
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const { updateAttemptStatus, recordEvent } = useRiddleAttempt(riddle.id);
  const { playLevelUpSound } = useBoardSounds();
  const wrongMoveCountRef = useRef(0);
  const totalHintCountRef = useRef(0);
  const {
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    sortedGoals,
    progressValue,
    hintCount,
    hintRequested,
    currentCorrectMove,
  } = useRiddleController({ riddle });
  const { Tour } = useRiddleTour({ riddleId: riddle.id });

  useEffect(() => {
    setIsCompleted(false);
    setSuccessDialogOpen(false);
    wrongMoveCountRef.current = 0;
    totalHintCountRef.current = 0;
  }, [riddle.id]);

  useEffect(() => {
    if (currentCorrectMove != null || isCompleted) return;

    setIsCompleted(true);
    setSuccessDialogOpen(true);
    playLevelUpSound();

    void (async () => {
      await recordEvent({ eventType: "complete" });
      await updateAttemptStatus(
        "completed",
        buildAttemptCounters(sortedGoals, wrongMoveCountRef.current, totalHintCountRef.current),
      );
    })();
  }, [currentCorrectMove, isCompleted, playLevelUpSound, recordEvent, sortedGoals, updateAttemptStatus]);

  /** Validates a board move, records attempt events, and tracks wrong-move count. */
  function handleBoardCheckMove(move: MoveAttemptPayload) {
    const { isCorrect } = handleMoveCheck(move);

    if (!isCorrect && !isCompleted) {
      wrongMoveCountRef.current += 1;

      void (async () => {
        await recordEvent({
          eventType: "move",
          moveUci: move.uci,
          expectedUci: currentCorrectMove ?? undefined,
          isCorrect: false,
        });
        await updateAttemptStatus(
          "failed",
          buildAttemptCounters(sortedGoals, wrongMoveCountRef.current, totalHintCountRef.current),
        );
      })();
    } else if (isCorrect) {
      void recordEvent({
        eventType: "move",
        moveUci: move.uci,
        expectedUci: currentCorrectMove ?? undefined,
        isCorrect: true,
      });
    }

    return isCorrect;
  }

  /** Forwards a successfully played move to the riddle controller hook. */
  function handleBoardSuccessMovePlayed(move: Move) {
    handleSuccessMovePlayed(move);
  }

  /** Returns the next move the board should play after a correct user move. */
  function handleBoardNextMoveRequest() {
    const nextMove = handleNextMoveRequest();
    return nextMove;
  }

  /** Shows the next hint on the board and persists the hint event. */
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

  const successDestinationPath = nextRiddleId ? `/riddle/${nextRiddleId}` : parentChallengeUrl;
  const successButtonLabel = nextRiddleId ? "Next riddle" : "Back to challenge";

  /** Navigates to the next riddle or back to the parent challenge after success. */
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
            sourceId={playable.sourceId}
            initialFen={playable.fen}
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
