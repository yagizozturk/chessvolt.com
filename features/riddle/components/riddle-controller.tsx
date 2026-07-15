"use client";

import { ChevronLeft, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import VoltBoard, { type VoltBoardHandle, type VoltBoardMode } from "@/components/boards/volt-board/volt-board";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { GoalViewer } from "@/components/goal-viewer/goal-viewer";
import { Notifier } from "@/components/notifier/notifier";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { MAX_HINT_COUNT, useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { incrementCurrentRatingAction } from "@/features/profile/actions/increment-current-rating";
import {
  AddToUserCollectionPicker,
  type UserCollectionProps,
} from "@/features/riddle/components/add-to-user-collection-picker";
import { useRiddleTour } from "@/features/riddle/hooks/use-riddle-tour";
import type { Riddle } from "@/features/riddle/types/riddle";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { useSequenceAttempt } from "@/features/user-sequence-attempt/hooks/use-sequence-attempt";
import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import {
  type AttemptPayload,
  createAttemptPayload,
  createSequenceCompleteStats,
} from "@/features/user-sequence-attempt/utilities/create-attempt-payload";
import { updateCorrectStreak } from "@/features/user-sequence-attempt/utilities/update-correct-streak";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTurnLabel } from "@/lib/chess/getTurnLabel";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

type RiddleControllerProps = {
  riddle: Riddle;
  nextRiddleUrl?: string | null;
  parentCollectionUrl?: string;
  isUserLoggedIn?: boolean; // Checks for the persist events, add to collection button visibility
  userCollections?: UserCollectionProps[]; // Getting user collections to show in a window and add riddles.
  userCollectionIdsHasCurrentRiddle?: string[]; // Already saved riddles in collections. Not to do it twice.
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
  const isMobile = useIsMobile();
  const sequenceId = riddle.moveSequence.id; // Every sequence has its own moves and PGN. Every Riddle has sequenceId
  const [replayKey, setReplayKey] = useState(0); // Replay key is to be unique. It is to change sessionId so to reset vars in play again option
  const sessionId = `${riddle.id}:${replayKey}`;
  const turnLabel = getTurnLabel(riddle.moveSequence.initialFen); // Gets the player turn label, w or b
  const hasNextRiddle = nextRiddleUrl != null;
  const successDestinationPath = hasNextRiddle ? nextRiddleUrl : parentCollectionUrl;
  const successButtonLabel = hasNextRiddle ? "Next riddle" : "Back to collection";
  const [isCompleted, setIsCompleted] = useState(false); // Whether the riddle is completed
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<MoveSequenceCompleteDialogStats | null>(null); // TS allows null state, default is null. CompletionStats is not set on default.
  const [completionVoltScore, setCompletionVoltScore] = useState<VoltScoreResult | null>(null);
  const [isVoltScoreShowing, setIsVoltScoreShowing] = useState(false);
  const [boardMode, setBoardMode] = useState<VoltBoardMode>("practice");
  const [isPending, startTransition] = useTransition();
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
    nextGoal,
    progressValue,
    hintCount,
    hintRequested,
    expectedCurrentCorrectMoveUci,
    lessonsLearned,
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
    if (expectedCurrentCorrectMoveUci != null || isCompleted) return;

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

    let isMounted = true;

    // This method persist the data and coded inside useEffect in order to block infinite loops if coded outside.
    // Declared inside the useEffect to safely isolate async operations, prevent memory leaks
    // if the component unmounts, and avoid dependency-induced infinite rendering loops.
    async function saveAttemptResults() {
      await recordEvent({ eventType: "complete" });

      const voltScoreResult = await updateAttemptResults("completed", {
        ...attemptPayload,
        ...(isUserLoggedIn ? { voltScore } : {}),
      });

      if (isUserLoggedIn) {
        await incrementCurrentRatingAction();
      }

      // If the user is still on this page and didn't click any button while waiting, update states.
      if (isMounted) {
        setCompletionVoltScore(voltScoreResult);
        setIsVoltScoreShowing(false);
      }
    }

    // Calling the function safe
    void saveAttemptResults();

    // Cleanup returns to useEffect directly.
    return () => {
      isMounted = false;
    };
  }, [
    expectedCurrentCorrectMoveUci,
    getTimeFromStartMs,
    isCompleted,
    isUserLoggedIn,
    playLevelUpSound,
    recordEvent,
    updateAttemptResults,
  ]);

  // ================================================================================================
  // Handle the board check move
  // ================================================================================================
  const handleBoardCheckMove = (move: MoveAttemptPayload) => {
    const { isCorrect } = handleMoveCheck(move);

    // With a right move (Early Return)
    if (isCorrect) {
      correctMoveCountRef.current += 1;
      updateCorrectStreak(currentCorrectStreakRef, maxCorrectStreakRef);

      void recordEvent({
        eventType: "move",
        moveUci: move.uci,
        expectedUci: expectedCurrentCorrectMoveUci ?? undefined,
        isCorrect: true,
      });

      return true;
    }

    // With wrong move and riddle continues
    if (!isCompleted) {
      wrongMoveCountRef.current += 1;
      currentCorrectStreakRef.current = 0;

      void recordEvent({
        eventType: "move",
        moveUci: move.uci,
        expectedUci: expectedCurrentCorrectMoveUci ?? undefined,
        isCorrect: false,
      });

      void updateAttemptResults(
        "failed",
        createAttemptPayload(
          correctMoveCountRef.current,
          wrongMoveCountRef.current,
          totalHintCountRef.current,
          maxCorrectStreakRef.current,
          getTimeFromStartMs(),
        ),
      );
    }

    return false;
  };

  // ================================================================================================
  // Handle the hint click and communicate with HOOK
  // ================================================================================================
  const handleHintClick = () => {
    const nextHintCount = hintRequested();
    if (nextHintCount == null || !expectedCurrentCorrectMoveUci) return;
    boardRef.current?.showHint(nextHintCount);
    totalHintCountRef.current += 1;

    void recordEvent({
      eventType: "hint",
      hintLevel: nextHintCount as 1 | 2,
      expectedUci: expectedCurrentCorrectMoveUci,
    });
  };

  // ================================================================================================
  // Handle the continue click and redirect to the next riddle or back to the collection
  // Use router hook already have transition state
  // Using transition to manage loading state.
  // ================================================================================================
  const handleContinueClick = () => {
    startTransition(() => {
      router.push(successDestinationPath);
    });
  };

  // ================================================================================================
  // Handle the continue click and redirect to the next riddle or back to the collection
  // ================================================================================================
  const handleBackClick = () => {
    startTransition(() => {
      router.push(parentCollectionUrl);
    });
  };

  // ================================================================================================
  // Play again button in dialog, sets the replay key for a new session
  // ================================================================================================
  const handlePlayAgain = () => {
    setSuccessDialogOpen(false);
    setReplayKey((key) => key + 1);
  };

  return (
    <div className="page-container">
      {Tour}
      {/* Success Dialog */}
      <SolveSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Riddle Solved"
        destinationPath={successDestinationPath}
        buttonLabel={successButtonLabel}
        lessonsLearned={lessonsLearned}
        stats={completionStats}
        voltScore={completionVoltScore}
        isVoltScoreShowing={isVoltScoreShowing}
        onPlayAgain={handlePlayAgain}
        footerExtra={
          isUserLoggedIn && userCollections.length > 0 ? (
            <AddToUserCollectionPicker
              riddleId={riddle.id}
              collections={userCollections}
              savedCollectionIds={userCollectionIdsHasCurrentRiddle}
            />
          ) : null
        }
      />

      {/* Confetti */}
      {successDialogOpen ? (
        <Confetti aria-hidden className="pointer-events-none fixed inset-0 z-[60] size-full max-h-none max-w-none" />
      ) : null}

      {/* Notifier */}
      <Notifier goals={sortedGoals} />

      <div className="page-container-controller-layout">
        {/* Board wrapper: aspect-square sets the square; .board-wrapper in volt.css fills it */}
        {/* TODO: Refactor HTML structure */}
        <div
          key={sessionId}
          className="relative aspect-square w-full shrink-0 md:min-w-0 md:flex-[3]"
          data-tour="board"
        >
          <VoltBoard
            ref={boardRef}
            sourceId={sessionId}
            mode={boardMode}
            initialFen={riddle.moveSequence.initialFen}
            coordinates={!isMobile}
            drawHintMove={expectedCurrentCorrectMoveUci}
            activeGoalVisuals={nextGoal?.visuals}
            onCheckMove={handleBoardCheckMove}
            onSuccessMovePlayed={handleSuccessMovePlayed} // directly communicating with hook
            onNextMoveRequest={handleNextMoveRequest} // directly communicating with hook
          />
        </div>

        {/* Controller */}
        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          {/* Controller header */}
          <div className="flex justify-between">
            <div>
              <Button variant="voltIcon" onClick={handleBackClick} disabled={isPending} aria-label="Back to collection">
                {isPending ? <Spinner className="size-5" /> : <ChevronLeft className="size-5" />}
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
                <AddToUserCollectionPicker
                  riddleId={riddle.id}
                  collections={userCollections}
                  savedCollectionIds={userCollectionIdsHasCurrentRiddle}
                />
              ) : null}
            </div>
          </div>

          {/* Goal Viewer */}
          <GoalViewer goals={sortedGoals} progressValue={progressValue} mode={boardMode} turnLabel={turnLabel} />

          {/* Mode Change */}
          <div className="flex items-center justify-center gap-3">
            <Label htmlFor="riddle-board-mode">Practice</Label>
            <Switch
              id="riddle-board-mode"
              checked={boardMode === "learn"}
              onCheckedChange={(checked) => setBoardMode(checked ? "learn" : "practice")}
              aria-label={`Switch to ${boardMode === "practice" ? "learn" : "practice"} mode`}
            />
            <Label htmlFor="riddle-board-mode">Learn</Label>
          </div>

          {/* Footer Buttons */}
          <div className="mt-auto">
            <div className="flex gap-2" data-tour="hint-button">
              {!isCompleted ? (
                <Button
                  variant="voltGreen"
                  onClick={handleHintClick}
                  disabled={hintCount >= MAX_HINT_COUNT}
                  className="w-full min-w-0 flex-1"
                >
                  <Eye data-icon="inline-start" />
                  Need a Help?
                </Button>
              ) : (
                <Button variant="volt" onClick={handleContinueClick} disabled={isPending} className="min-w-0 flex-1">
                  {isPending && <Spinner data-icon="inline-start" />}
                  {successButtonLabel}
                </Button>
              )}
            </div>

            {!isCompleted && (
              <p className="text-muted-foreground mt-4 flex items-center justify-center gap-1.5 text-center text-xs">
                First click shows the hint text and highlights the piece to move. Second click shows the destination
                square.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
