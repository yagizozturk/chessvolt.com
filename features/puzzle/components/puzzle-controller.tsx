"use client";

import { Bot, ChevronLeft, Eye, RotateCcw, Swords } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAX_HINT_COUNT, useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { MainIdeaButton } from "@/features/openings/components/main-idea-button";
import { updateProfileRatingAction } from "@/features/profile/actions/update-profile-rating";
import { usePuzzleTour } from "@/features/puzzle/hooks/use-puzzle-tour";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { getPuzzleRatingForScoring } from "@/features/puzzle/types/puzzle-rating";
import { FavouriteButton } from "@/features/user-favorites/components/favorite-button";
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

type PuzzleControllerProps = {
  puzzle: Puzzle;
  nextPuzzleUrl?: string | null;
  backUrl?: string;
  isUserLoggedIn?: boolean; // Checks for the persist events
  isFavorited?: boolean;
};

export default function PuzzleController({
  puzzle,
  nextPuzzleUrl = null,
  backUrl = "/",
  isUserLoggedIn = false,
  isFavorited = false,
}: PuzzleControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const isMobile = useIsMobile();
  const sequenceId = puzzle.moveSequence.id; // Every sequence has its own moves and PGN. Every Puzzle has sequenceId
  const [replayKey, setReplayKey] = useState(0); // Replay key is to be unique. It is to change sessionId so to reset vars in play again option
  const sessionId = `${puzzle.id}:${replayKey}`;
  const turnLabel = getTurnLabel(puzzle.moveSequence.initialFen); // Gets the player turn label, w or b
  const hasNextPuzzle = nextPuzzleUrl != null;
  const successDestinationPath = hasNextPuzzle ? nextPuzzleUrl : null;
  const successButtonLabel = hasNextPuzzle ? "Next puzzle" : null;
  const [isCompleted, setIsCompleted] = useState(false); // Whether the puzzle is completed
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<MoveSequenceCompleteDialogStats | null>(null); // TS allows null state, default is null. CompletionStats is not set on default.
  const [completionVoltScore, setCompletionVoltScore] = useState<VoltScoreResult | null>(null);
  const [isVoltScoreShowing, setIsVoltScoreShowing] = useState(false);
  const [boardMode, setBoardMode] = useState<VoltBoardMode>("practice");
  const [showMainIdea, setShowMainIdea] = useState(false);
  const [isFavourited, setIsFavourited] = useState(isFavorited);
  const [isPending, startTransition] = useTransition();
  const { updateAttemptResults, recordEvent, getTimeFromStartMs } = useSequenceAttempt(sequenceId, replayKey);
  const { playLevelUpSound } = useBoardSounds();

  // ================================================================================================
  // Ref counters for the puzzle. Refs are invisible to React’s update cycle.
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
    mainIdea,
  } = useMoveSequenceController({
    sourceId: sessionId,
    moves: puzzle.moveSequence.moves,
    goals: puzzle.moveSequence.goals,
  });

  const { Tour } = usePuzzleTour({ puzzleId: puzzle.id });
  const voltScore = {
    totalMoveCount: getPlayerMoveCount(puzzle.moveSequence.moves),
    rating: getPuzzleRatingForScoring(puzzle.rating),
  };

  useEffect(() => {
    setReplayKey(0);
  }, [puzzle.id]);

  useEffect(() => {
    setIsFavourited(isFavorited);
  }, [puzzle.id, isFavorited]);

  // ================================================================================================
  // Reset the puzzle state when the puzzle id or replay key changes
  // ================================================================================================
  useEffect(() => {
    setIsCompleted(false);
    setSuccessDialogOpen(false);
    setCompletionStats(null);
    setCompletionVoltScore(null);
    setIsVoltScoreShowing(false);
    setBoardMode("practice");
    setShowMainIdea(false);
    correctMoveCountRef.current = 0;
    wrongMoveCountRef.current = 0;
    totalHintCountRef.current = 0;
    currentCorrectStreakRef.current = 0;
    maxCorrectStreakRef.current = 0;
  }, [puzzle.id, replayKey]);

  // ================================================================================================
  // Set the puzzle as completed and persist attempt data to the db
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
    setIsVoltScoreShowing(isFavourited);
    setSuccessDialogOpen(true);
    playLevelUpSound();
    void insertAttemptResults(attemptPayload);
  }, [expectedCurrentCorrectMoveUci, getTimeFromStartMs, isCompleted, isFavourited, playLevelUpSound]);

  // ================================================================================================
  // Insert the completion attempt to the db
  // ================================================================================================
  async function insertAttemptResults(attemptPayload: AttemptPayload) {
    await recordEvent({ eventType: "complete" });

    // Rate before persisting complete so this attempt does not self-block eligibility.
    if (isUserLoggedIn && attemptPayload.wrongMoveCount === 0) {
      await updateProfileRatingAction({
        sequenceId: puzzle.moveSequence.id,
        outcome: "success",
      });
    }

    const voltScoreResult = await updateAttemptResults("completed", {
      ...attemptPayload,
      ...(isFavourited ? { voltScore } : {}),
    });

    setCompletionVoltScore(voltScoreResult);
    setIsVoltScoreShowing(false);
  }

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

    // With wrong move and puzzle continues
    if (!isCompleted) {
      wrongMoveCountRef.current += 1;
      currentCorrectStreakRef.current = 0;

      void recordEvent({
        eventType: "move",
        moveUci: move.uci,
        expectedUci: expectedCurrentCorrectMoveUci ?? undefined,
        isCorrect: false,
      });

      void (async () => {
        // Rate before persisting fail so the first wrong does not self-block eligibility.
        if (isUserLoggedIn && wrongMoveCountRef.current === 1) {
          await updateProfileRatingAction({
            sequenceId: puzzle.moveSequence.id,
            outcome: "failure",
          });
        }

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
  // Handle the continue click and redirect to the next puzzle
  // Use router hook already have transition state
  // Using transition to manage loading state.
  // ================================================================================================
  const handleContinueClick = () => {
    if (!successDestinationPath) return;
    startTransition(() => {
      router.push(successDestinationPath);
    });
  };

  // ================================================================================================
  // Handle the continue click and redirect to the next puzzle or back to the study
  // ================================================================================================
  const handleBackClick = () => {
    startTransition(() => {
      router.push(backUrl);
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
        destinationPath={successDestinationPath}
        buttonLabel={successButtonLabel}
        stats={completionStats}
        voltScore={completionVoltScore}
        isVoltScoreShowing={isVoltScoreShowing}
        onPlayAgain={handlePlayAgain}
        footerExtra={
          <FavouriteButton
            puzzleId={puzzle.id}
            isFavourited={isFavourited}
            onFavouritedChange={setIsFavourited}
          />
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
        {/* self-start is critical! It makes board container not shrink when neighbour elements gets bigger in size. self-start = “this child only, align to cross-axis start” */}
        {/* TODO: Refactor HTML structure */}
        <div
          key={sessionId}
          className="relative aspect-square w-full shrink-0 self-start md:min-w-0 md:flex-[3]"
          data-tour="board"
        >
          <VoltBoard
            ref={boardRef}
            sourceId={sessionId}
            mode={boardMode}
            initialFen={puzzle.moveSequence.initialFen}
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
              <Button variant="voltIcon" onClick={handleBackClick} disabled={isPending} aria-label="Back">
                {isPending ? <Spinner className="size-5" /> : <ChevronLeft className="size-5" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Image
                src="/images/icons/icon-puzzle.png"
                alt=""
                aria-hidden
                width={30}
                height={30}
                className="size-7 shrink-0"
              />
              Puzzles
            </div>
            <div className="flex items-center gap-2">
              {boardMode === "learn" ? (
                <MainIdeaButton mainIdea={mainIdea} active={showMainIdea} onActiveChange={setShowMainIdea} />
              ) : null}
              <FavouriteButton
                puzzleId={puzzle.id}
                isFavourited={isFavourited}
                onFavouritedChange={setIsFavourited}
              />
            </div>
          </div>

          <Tabs
            value={boardMode}
            onValueChange={(value) => setBoardMode(value as VoltBoardMode)}
            aria-label="Board mode"
          >
            <TabsList variant="green" className="w-full rounded-lg">
              <TabsTrigger value="practice">
                <Swords />
                Practice
              </TabsTrigger>
              <TabsTrigger value="learn">
                <Bot />
                Coach Me
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Goal Viewer */}
          <GoalViewer
            goals={sortedGoals}
            progressValue={progressValue}
            mode={boardMode}
            turnLabel={turnLabel}
            mainIdea={mainIdea}
            showMainIdea={boardMode === "learn" && showMainIdea}
          />

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
                  Show the move
                </Button>
              ) : (
                <>
                  <Button variant="voltGreen" onClick={handlePlayAgain} className="min-w-0 flex-1">
                    <RotateCcw data-icon="inline-start" />
                    Play again
                  </Button>
                  {hasNextPuzzle ? (
                    <Button
                      variant="volt"
                      onClick={handleContinueClick}
                      disabled={isPending}
                      className="min-w-0 flex-1"
                    >
                      {isPending && <Spinner data-icon="inline-start" />}
                      {successButtonLabel}
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
