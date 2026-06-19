"use client";

import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { GoalViewer } from "@/components/goal-viewer/goal-viewer";
import { Notifier } from "@/components/notifier/notifier";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Confetti } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import { useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { incrementCurrentRatingAction } from "@/features/profile/actions/increment-current-rating";
import {
  AddToMyCollectionPicker,
  type MyCollectionOption,
} from "@/features/riddle/components/add-to-my-collection-picker";
import { useRiddleTour } from "@/features/riddle/hooks/use-riddle-tour";
import type { Riddle } from "@/features/riddle/types/riddle";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { useSequenceAttempt } from "@/features/user-sequence-attempt/hooks/use-sequence-attempt";
import type { SequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import {
  type AttemptPayload,
  createAttemptPayload,
  createSequenceCompleteStats,
} from "@/features/user-sequence-attempt/utilities/create-attempt-payload";
import { updateCorrectStreak } from "@/features/user-sequence-attempt/utilities/update-correct-streak";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

type RiddleControllerProps = {
  riddle: Riddle;
  nextRiddleUrl?: string | null;
  parentCollectionUrl?: string;
  isUserLoggedIn?: boolean;
  userCollections?: MyCollectionOption[];
  userCollectionIdsHasCurrentRiddle?: string[];
};

export default function RiddleController({
  riddle,
  nextRiddleUrl = null,
  parentCollectionUrl = "/",
  isUserLoggedIn = false,
  userCollections = [],
  userCollectionIdsHasCurrentRiddle = [],
}: RiddleControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const sequenceId = riddle.moveSequence.id; // Every sequence has its own moves and PGN. Every Riddle has sequenceId
  const [isCompleted, setIsCompleted] = useState(false); // Whether the riddle is completed
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<SequenceCompleteDialogStats | null>(null);
  const [completionVoltScore, setCompletionVoltScore] = useState<VoltScoreResult | null>(null);
  const [isVoltScoreShowing, setIsVoltScoreShowing] = useState(false);
  const [isContinuePending, setIsContinuePending] = useState(false);
  const { updateAttemptResults, recordEvent, getTimeFromStartMs } = useSequenceAttempt(sequenceId);
  const { playLevelUpSound } = useBoardSounds();

  // ================================================================================================
  // Ref counters for the riddle. Refs are invisible to React’s update cycle.
  // These attempt numbers are stored in refs
  // ================================================================================================
  const correctMoveCountRef = useRef(0);
  const wrongMoveCountRef = useRef(0);
  const totalHintCountRef = useRef(0);
  const currentCorrectStreakRef = useRef(0);
  const maxCorrectStreakRef = useRef(0);

  // ================================================================================================
  // Use the useMoveSequenceController HOOK to handle the move sequence
  // ================================================================================================
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
    sourceId: riddle.id,
    moves: riddle.moveSequence.moves,
    goals: riddle.moveSequence.goals,
  });

  const { Tour } = useRiddleTour({ riddleId: riddle.id });
  const voltScore = {
    totalMoveCount: getPlayerMoveCount(riddle.moveSequence.moves),
    rating: getRiddleRatingForScoring(riddle.rating),
  };

  // ================================================================================================
  // Reset the riddle state when the riddle id changes
  // ================================================================================================
  useEffect(() => {
    setIsCompleted(false);
    setSuccessDialogOpen(false);
    setCompletionStats(null);
    setCompletionVoltScore(null);
    setIsVoltScoreShowing(false);
    setIsContinuePending(false);
    correctMoveCountRef.current = 0;
    wrongMoveCountRef.current = 0;
    totalHintCountRef.current = 0;
    currentCorrectStreakRef.current = 0;
    maxCorrectStreakRef.current = 0;
  }, [riddle.id]);

  // ================================================================================================
  // Set the riddle as completed and persist attempt data to the db
  // ================================================================================================
  useEffect(() => {
    if (currentCorrectMove != null || isCompleted) return;

    setIsCompleted(true);

    const attemptPayload = createAttemptPayload(
      correctMoveCountRef.current,
      wrongMoveCountRef.current,
      totalHintCountRef.current,
      maxCorrectStreakRef.current,
      getTimeFromStartMs(),
    );

    // Setting the completion stats for UI Dialog show
    setCompletionStats(createSequenceCompleteStats(attemptPayload));
    setCompletionVoltScore(null);
    setIsVoltScoreShowing(isUserLoggedIn);
    setSuccessDialogOpen(true);
    playLevelUpSound();
    void insertAttemptResults(attemptPayload);
  }, [
    currentCorrectMove,
    getTimeFromStartMs,
    isCompleted,
    isUserLoggedIn,
    playLevelUpSound,
    recordEvent,
    updateAttemptResults,
  ]);

  // ================================================================================================
  // Insert the completion attempt to the db
  // ================================================================================================
  async function insertAttemptResults(attemptPayload: AttemptPayload) {
    await recordEvent({ eventType: "complete" });

    const voltScoreResult = await updateAttemptResults("completed", {
      ...attemptPayload,
      ...(isUserLoggedIn ? { voltScore } : {}),
    });

    if (isUserLoggedIn) {
      await incrementCurrentRatingAction();
    }

    setCompletionVoltScore(voltScoreResult);
    setIsVoltScoreShowing(false);
  }

  // ================================================================================================
  // Handle the board check move
  // ================================================================================================
  function handleBoardCheckMove(move: MoveAttemptPayload) {
    const { isCorrect } = handleMoveCheck(move);

    // If the move is incorrect and the riddle is not completed, record the move event and update the attempt status
    if (!isCorrect && !isCompleted) {
      wrongMoveCountRef.current += 1;
      currentCorrectStreakRef.current = 0;

      void (async () => {
        const durationMs = getTimeFromStartMs();

        // Record the move event for attempt_event table for more detailed logs
        await recordEvent({
          eventType: "move",
          moveUci: move.uci,
          expectedUci: currentCorrectMove ?? undefined,
          isCorrect: false,
        });
        await updateAttemptResults(
          "failed",
          createAttemptPayload(
            correctMoveCountRef.current,
            wrongMoveCountRef.current,
            totalHintCountRef.current,
            maxCorrectStreakRef.current,
            durationMs,
          ),
        );
      })();
    } else if (isCorrect) {
      // If the move is correct, record the move event and update the attempt status
      correctMoveCountRef.current += 1;
      updateCorrectStreak(currentCorrectStreakRef, maxCorrectStreakRef);

      // Record the move event for attempt_event table for more detailed logs
      void recordEvent({
        eventType: "move",
        moveUci: move.uci,
        expectedUci: currentCorrectMove ?? undefined,
        isCorrect: true,
      });
    }

    return isCorrect;
  }

  // ================================================================================================
  // Handle the board success move played and communicate with HOOK
  // ================================================================================================
  function handleBoardSuccessMovePlayed(move: Move) {
    handleSuccessMovePlayed(move);
  }

  // ================================================================================================
  // Handle the board next move request and communicate with HOOK
  // ================================================================================================
  function handleBoardNextMoveRequest() {
    const nextMove = handleNextMoveRequest();
    return nextMove;
  }

  // ================================================================================================
  // Handle the hint click and communicate with HOOK
  // ================================================================================================
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

  // ================================================================================================
  // Handle the continue click and redirect to the next riddle or back to the collection
  // ================================================================================================
  const hasNextRiddle = nextRiddleUrl != null;
  const successDestinationPath = hasNextRiddle ? nextRiddleUrl : parentCollectionUrl;
  const successButtonLabel = hasNextRiddle ? "Next riddle" : "Back to collection";

  // ================================================================================================
  // Handle the continue click and redirect to the next riddle or back to the collection
  // ================================================================================================
  const handleContinueClick = () => {
    setIsContinuePending(true);
    router.push(successDestinationPath);
  };

  const successDescription = hasNextRiddle
    ? "You solved this riddle. Continue to the next one when you are ready."
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
        voltScore={completionVoltScore}
        isVoltScoreShowing={isVoltScoreShowing}
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
        <div className="bg-card relative flex min-w-0 flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-lg font-bold">{riddle.title ?? "Untitled riddle"}</span>
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
            {isUserLoggedIn && userCollections.length > 0 ? (
              <AddToMyCollectionPicker
                riddleId={riddle.id}
                collections={userCollections}
                savedCollectionIds={userCollectionIdsHasCurrentRiddle}
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
                <Button variant="volt" onClick={handleContinueClick} disabled={isContinuePending} className="w-full">
                  {isContinuePending && <Spinner data-icon="inline-start" />}
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
