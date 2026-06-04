"use client";

import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { AccuracyCalculator } from "@/components/calculator/accuracy-calculator/accuracy-calculator";
import { riddleDifficultyToRating } from "@/components/calculator/rating-timing-calculator/compute-rating-timing";
import { RatingTimingCalculator } from "@/components/calculator/rating-timing-calculator/rating-timing-calculator";
import { StreakCalculator } from "@/components/calculator/streak-calculator/streak-calculator";
import { GoalViewer } from "@/components/goal-viewer/goal-viewer";
import { Notifier } from "@/components/notifier/notifier";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import { useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import {
  AddToMyCollectionPicker,
  type MyCollectionOption,
} from "@/features/riddle/components/add-to-my-collection-picker";
import { useRiddleTour } from "@/features/riddle/hooks/use-riddle-tour";
import type { Riddle } from "@/features/riddle/types/riddle";
import { useSequenceAttempt } from "@/features/user-sequence-attempt/hooks/use-sequence-attempt";
import type { SequenceCompletionStats } from "@/features/user-sequence-attempt/types/sequence-completion-stats";
import { buildSequenceCompletionStats } from "@/features/user-sequence-attempt/utilities/build-sequence-completion-stats";
import {
  buildAttemptCounters,
  bumpCorrectStreak,
} from "@/features/user-sequence-attempt/utilities/sequence-play-attempt-counters";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

type RiddleControllerProps = {
  riddle: Riddle;
  nextRiddleId?: string | null;
  parentCollectionUrl?: string;
  canSaveToMyCollections?: boolean;
  myCollections?: MyCollectionOption[];
  savedMyCollectionIds?: string[];
};

export default function RiddleController({
  riddle,
  nextRiddleId = null,
  parentCollectionUrl = "/",
  canSaveToMyCollections = false,
  myCollections = [],
  savedMyCollectionIds = [],
}: RiddleControllerProps) {
  const sequenceId = riddle.moveSequence.id;
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<SequenceCompletionStats | null>(null);
  const [attemptStatsTick, setAttemptStatsTick] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const { updateAttemptStatus, recordEvent, getTimeFromStartMs } = useSequenceAttempt(sequenceId);
  const { playLevelUpSound } = useBoardSounds();
  const wrongMoveCountRef = useRef(0);
  const totalHintCountRef = useRef(0);
  const currentCorrectStreakRef = useRef(0);
  const maxCorrectStreakRef = useRef(0);
  const {
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    moves,
    sortedGoals,
    progressValue,
    hintCount,
    hintRequested,
    currentCorrectMove,
  } = useMoveSequenceController({
    sourceId: riddle.id,
    moves: riddle.moveSequence.moves,
    goals: riddle.moveSequence.goals,
  });
  const { Tour } = useRiddleTour({ riddleId: riddle.id });

  useEffect(() => {
    setIsCompleted(false);
    setSuccessDialogOpen(false);
    setCompletionStats(null);
    wrongMoveCountRef.current = 0;
    totalHintCountRef.current = 0;
    currentCorrectStreakRef.current = 0;
    maxCorrectStreakRef.current = 0;
    setAttemptStatsTick(0);
    setElapsedMs(0);
  }, [riddle.id]);

  useEffect(() => {
    if (isCompleted) return;

    const tick = () => setElapsedMs(getTimeFromStartMs() ?? 0);

    tick();
    const intervalId = window.setInterval(tick, 500);

    return () => window.clearInterval(intervalId);
  }, [getTimeFromStartMs, isCompleted, attemptStatsTick]);

  const timingRating = useMemo(() => riddleDifficultyToRating(riddle.difficulty), [riddle.difficulty]);

  const liveAttemptStats = useMemo(
    () => ({
      wrongMoveCount: wrongMoveCountRef.current,
      hintCount: totalHintCountRef.current,
      maxCorrectStreak: maxCorrectStreakRef.current,
    }),
    [attemptStatsTick],
  );

  useEffect(() => {
    if (currentCorrectMove != null || isCompleted) return;

    const finalDurationMs = getTimeFromStartMs();

    setIsCompleted(true);
    setElapsedMs(finalDurationMs ?? 0);
    setCompletionStats(
      buildSequenceCompletionStats(
        sortedGoals,
        wrongMoveCountRef.current,
        totalHintCountRef.current,
        maxCorrectStreakRef.current,
        finalDurationMs,
      ),
    );
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
  }, [
    currentCorrectMove,
    getTimeFromStartMs,
    isCompleted,
    playLevelUpSound,
    recordEvent,
    sortedGoals,
    updateAttemptStatus,
  ]);

  function handleBoardCheckMove(move: MoveAttemptPayload) {
    const { isCorrect } = handleMoveCheck(move);

    if (!isCorrect && !isCompleted) {
      wrongMoveCountRef.current += 1;
      currentCorrectStreakRef.current = 0;
      setAttemptStatsTick((tick) => tick + 1);

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
      setAttemptStatsTick((tick) => tick + 1);

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
    setAttemptStatsTick((tick) => tick + 1);

    void recordEvent({
      eventType: "hint",
      hintLevel: nextHintCount as 1 | 2,
      expectedUci: currentCorrectMove,
    });
  };

  const successDestinationPath = nextRiddleId ? `/riddle/${nextRiddleId}` : parentCollectionUrl;
  const successButtonLabel = nextRiddleId ? "Next riddle" : "Back to collection";

  const handleContinueClick = () => {
    router.push(successDestinationPath);
  };

  const successDescription = nextRiddleId
    ? "You solved this riddle. Continue to the next one when you are ready."
    : parentCollectionUrl === "/"
      ? "You solved this riddle. Continue from the home page when you are ready."
      : "You solved this riddle. Return to the collection when you are ready.";

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
        stats={completionStats}
      />
      <Notifier goals={sortedGoals} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          key={riddle.id}
          className="relative w-full min-w-0 rounded-2xl border-5 border-white/80 lg:w-auto lg:shrink-0"
          data-tour="board"
        >
          <VoltBoard
            ref={boardRef}
            sourceId={riddle.id}
            initialFen={riddle.moveSequence.initialFen}
            size={584}
            drawHintMove={currentCorrectMove}
            onCheckMove={handleBoardCheckMove}
            onSuccessMovePlayed={handleBoardSuccessMovePlayed}
            onNextMoveRequest={handleBoardNextMoveRequest}
          />
        </div>
        <div className="bg-card flex min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-lg font-bold">{riddle.title ?? "Untitled riddle"}</span>
            <AccuracyCalculator
              wrongMoveCount={liveAttemptStats.wrongMoveCount}
              hintCount={liveAttemptStats.hintCount}
              totalMoveCount={moves.length}
            />
            <RatingTimingCalculator rating={timingRating} durationMs={elapsedMs} />
            <StreakCalculator
              maxCorrectStreak={liveAttemptStats.maxCorrectStreak}
              totalMoveCount={moves.length}
            />
          </div>
          <div className="flex items-center" data-tour="progress">
            <Progress value={progressValue} className="h-4 flex-1 rounded-r-none" />
            <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
              <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
            </div>
          </div>
          <div data-tour="goals">
            <GoalViewer goals={sortedGoals} />
          </div>
          <div className="mt-auto" data-tour="hint-button">
            {canSaveToMyCollections ? (
              <AddToMyCollectionPicker
                riddleId={riddle.id}
                collections={myCollections}
                savedCollectionIds={savedMyCollectionIds}
              />
            ) : null}
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
