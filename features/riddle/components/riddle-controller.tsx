// TODO: Refactor
"use client";

import { ChevronLeft, Eye, HelpCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { GoalViewer } from "@/components/goal-viewer/goal-viewer";
import { Notifier } from "@/components/notifier/notifier";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Spinner } from "@/components/ui/spinner";
import { MAX_HINT_COUNT, useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { getTurnLabel } from "@/lib/chess/getTurnLabel";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

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
  const isMobile = useIsMobile();
  const boardRef = useRef<VoltBoardHandle>(null);
  const sequenceId = riddle.moveSequence.id; // Every sequence has its own moves and PGN. Every Riddle has sequenceId
  const [replayKey, setReplayKey] = useState(0);
  const sessionId = `${riddle.id}:${replayKey}`;
  const [isCompleted, setIsCompleted] = useState(false); // Whether the riddle is completed
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<SequenceCompleteDialogStats | null>(null);
  const [completionVoltScore, setCompletionVoltScore] = useState<VoltScoreResult | null>(null);
  const [isVoltScoreShowing, setIsVoltScoreShowing] = useState(false);
  const [isContinuePending, setIsContinuePending] = useState(false);
  const [isBackPending, setIsBackPending] = useState(false);
  const { updateAttemptResults, recordEvent, getTimeFromStartMs } = useSequenceAttempt(sequenceId, replayKey);
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
    sourceId: sessionId,
    moves: riddle.moveSequence.moves,
    goals: riddle.moveSequence.goals,
  });

  const { Tour } = useRiddleTour({ riddleId: riddle.id });
  const voltScore = {
    totalMoveCount: getPlayerMoveCount(riddle.moveSequence.moves),
    rating: getRiddleRatingForScoring(riddle.rating),
  };

  useEffect(() => {
    setReplayKey(0);
  }, [riddle.id]);

  // ================================================================================================
  // Reset the riddle state when the riddle id or replay key changes
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
  }, [riddle.id, replayKey]);

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
            getTimeFromStartMs(),
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
      hintLevel: nextHintCount as 1 | 2 | 3,
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

  const handleBackClick = () => {
    setIsBackPending(true);
    router.push(parentCollectionUrl);
  };

  const handlePlayAgain = () => {
    setSuccessDialogOpen(false);
    setReplayKey((key) => key + 1);
  };

  const successDescription = hasNextRiddle
    ? "Congratulations! You solved this riddle."
    : "You solved this riddle. Return to the collection when you are ready.";

  // ================================================================================================
  // Get the player orientation from the FEN and set the turn label
  // ================================================================================================
  const turnLabel = getTurnLabel(riddle.moveSequence.initialFen);

  return (
    <div className="page-container">
      {Tour}
      <SolveSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Riddle Solved"
        description={successDescription}
        destinationPath={successDestinationPath}
        buttonLabel={successButtonLabel}
        stats={completionStats}
        voltScore={completionVoltScore}
        isVoltScoreShowing={isVoltScoreShowing}
        onPlayAgain={handlePlayAgain}
        footerExtra={
          isUserLoggedIn && userCollections.length > 0 ? (
            <AddToMyCollectionPicker
              riddleId={riddle.id}
              collections={userCollections}
              savedCollectionIds={userCollectionIdsHasCurrentRiddle}
            />
          ) : null
        }
      />
      {successDialogOpen ? (
        <Confetti aria-hidden className="pointer-events-none fixed inset-0 z-[60] size-full max-h-none max-w-none" />
      ) : null}
      <Notifier goals={sortedGoals} />
      <div className="page-container-controller-layout">
        {/* Board wrapper: aspect-square sets the square; .board-wrapper in volt.css fills it */}
        <div
          key={sessionId}
          className="relative aspect-square w-full shrink-0 md:min-w-0 md:flex-[3]"
          data-tour="board"
        >
          <VoltBoard
            ref={boardRef}
            sourceId={sessionId}
            initialFen={riddle.moveSequence.initialFen}
            coordinates={!isMobile}
            drawHintMove={currentCorrectMove}
            onCheckMove={handleBoardCheckMove}
            onSuccessMovePlayed={handleBoardSuccessMovePlayed}
            onNextMoveRequest={handleBoardNextMoveRequest}
          />
        </div>
        {/* Controller */}
        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          <div className="flex justify-between">
            <div>
              <Button
                variant="voltIcon"
                onClick={handleBackClick}
                disabled={isBackPending}
                aria-label="Back to collection"
              >
                {isBackPending ? <Spinner className="size-5" /> : <ChevronLeft className="size-5" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Image
                src="/images/icons/icon-riddle.png"
                alt=""
                aria-hidden
                width={30}
                height={30}
                className="size-7 shrink-0"
              />
              Riddles
            </div>
            <div>
              {isUserLoggedIn && userCollections.length > 0 ? (
                <AddToMyCollectionPicker
                  riddleId={riddle.id}
                  collections={userCollections}
                  savedCollectionIds={userCollectionIdsHasCurrentRiddle}
                />
              ) : null}
            </div>
          </div>

          <GoalViewer goals={sortedGoals} progressValue={progressValue} hintCount={hintCount} turnLabel={turnLabel} />
          <div className="mt-auto">
            <div className="flex gap-2" data-tour="hint-button">
              {!isCompleted ? (
                <Button
                  variant="voltGreen"
                  onClick={handleHintClick}
                  disabled={hintCount >= MAX_HINT_COUNT}
                  className="min-w-0 flex-1"
                >
                  <Eye data-icon="inline-start" />
                  Hint
                </Button>
              ) : (
                <Button
                  variant="volt"
                  onClick={handleContinueClick}
                  disabled={isContinuePending}
                  className="min-w-0 flex-1"
                >
                  {isContinuePending && <Spinner data-icon="inline-start" />}
                  {successButtonLabel}
                </Button>
              )}
            </div>
            {!isCompleted ? (
              <p className="text-muted-foreground mt-4 flex items-center justify-center gap-1.5 text-center text-xs">
                First click shows a text hint from Volt. Second click shows a stronger hint and highlights which piece
                to move. Third click shows the exact move.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
