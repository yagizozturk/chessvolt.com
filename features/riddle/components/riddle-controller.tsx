"use client";

import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { GoalViewer } from "@/components/goal-viewer/goal-viewer";
import { Notifier } from "@/components/notifier/notifier";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import type { CollectionType } from "@/features/collection/types/collection-type";
import { useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import {
  AddToMyCollectionPicker,
  type MyCollectionOption,
} from "@/features/riddle/components/add-to-my-collection-picker";
import { useRiddleTour } from "@/features/riddle/hooks/use-riddle-tour";
import type { Riddle } from "@/features/riddle/types/riddle";
import { buildRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
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
  nextRiddleId?: string | null;
  parentCollectionUrl?: string;
  collectionSlug?: string | null;
  collectionType?: CollectionType | null;
  userCanSaveToUserCollections?: boolean;
  userCollections?: MyCollectionOption[];
  savedUserCollectionsIds?: string[];
  voltScore?: VoltScoreResult | null;
};

export default function RiddleController({
  riddle,
  nextRiddleId = null,
  parentCollectionUrl = "/",
  collectionSlug = null,
  collectionType = null,
  userCanSaveToUserCollections = false,
  userCollections = [],
  savedUserCollectionsIds = [],
  voltScore = null,
}: RiddleControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const sequenceId = riddle.moveSequence.id; // Every sequence has its own moves and PGN. Every Riddle has sequenceId
  const [isCompleted, setIsCompleted] = useState(false); // Whether the riddle is completed
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<SequenceCompleteDialogStats | null>(null); // Values that are shown in Dialog
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

  // ================================================================================================
  // Reset the riddle state when the riddle id changes
  // ================================================================================================
  useEffect(() => {
    setIsCompleted(false);
    setSuccessDialogOpen(false);
    setCompletionStats(null);
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
    setSuccessDialogOpen(true);
    playLevelUpSound();
    void insertAttemptResults(attemptPayload);
  }, [currentCorrectMove, getTimeFromStartMs, isCompleted, playLevelUpSound, recordEvent, updateAttemptResults]);

  // ================================================================================================
  // Insert the completion attempt to the db
  // ================================================================================================
  async function insertAttemptResults(attemptPayload: AttemptPayload) {
    // Record the completion event for attempt_event table for more detailed logs
    await recordEvent({ eventType: "complete" });
    await updateAttemptResults("completed", attemptPayload);
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

  const hasNextRiddle = nextRiddleId != null && collectionSlug != null;
  const successDestinationPath = hasNextRiddle
    ? buildRiddlePath(nextRiddleId, {
        collectionSlug,
        collectionType: collectionType ?? "admin",
      })
    : parentCollectionUrl;
  const successButtonLabel = hasNextRiddle ? "Next riddle" : "Back to collection";

  // ================================================================================================
  // Handle the continue click and redirect to the next riddle or back to the collection
  // ================================================================================================
  const handleContinueClick = () => {
    router.push(successDestinationPath);
  };

  const successDescription = hasNextRiddle
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
            <VoltCalculator result={voltScore} className="mt-2 w-full" />
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
            {userCanSaveToUserCollections ? (
              <AddToMyCollectionPicker
                riddleId={riddle.id}
                collections={userCollections}
                savedCollectionIds={savedUserCollectionsIds}
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
