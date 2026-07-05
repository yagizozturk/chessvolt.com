"use client";

import { ChevronLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { isValidVoltScore } from "@/components/calculator/volt-calculator/is-valid-volt-score";
import { VoltCalculator } from "@/components/calculator/volt-calculator/volt-calculator";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { GoalViewer } from "@/components/goal-viewer/goal-viewer";
import { Notifier } from "@/components/notifier/notifier";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Spinner } from "@/components/ui/spinner";
import { MAX_HINT_COUNT, useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { useOpeningVariantTour } from "@/features/openings/hooks/use-opening-variant-tour";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { AddToPracticeButton } from "@/features/user-practice-opening-variant/components/add-to-practice-button";
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

type OpeningVariantControllerProps = {
  variant: OpeningVariant;
  nextVariantId: string | null;
  parentOpeningUrl: string;
  canAddToPracticeList?: boolean;
  isInPracticeList?: boolean;
  voltScore?: VoltScoreResult | null;
};

export default function OpeningVariantController({
  variant,
  nextVariantId,
  parentOpeningUrl,
  canAddToPracticeList = false,
  isInPracticeList = false,
  voltScore = null,
}: OpeningVariantControllerProps) {
  const sequenceId = variant.moveSequence.id;
  const [replayKey, setReplayKey] = useState(0);
  const sessionId = `${variant.id}:${replayKey}`;
  const router = useRouter();
  const isMobile = useIsMobile();
  const boardRef = useRef<VoltBoardHandle>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isContinuePending, setIsContinuePending] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<SequenceCompleteDialogStats | null>(null);
  const [completionVoltScore, setCompletionVoltScore] = useState<VoltScoreResult | null>(null);
  const [isVoltScoreShowing, setIsVoltScoreShowing] = useState(false);
  const { updateAttemptResults, recordEvent, getTimeFromStartMs } = useSequenceAttempt(sequenceId, replayKey);
  const { playLevelUpSound } = useBoardSounds();
  const correctMoveCountRef = useRef(0);
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
    sourceId: sessionId,
    moves: variant.moveSequence.moves,
    goals: variant.moveSequence.goals,
    initialPly: variant.initialPly,
  });
  const { Tour } = useOpeningVariantTour({ variantId: variant.id });
  const voltScoreScoring = {
    totalMoveCount: getPlayerMoveCount(variant.moveSequence.moves),
    rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
  };

  useEffect(() => {
    setReplayKey(0);
  }, [variant.id]);

  useEffect(() => {
    setIsCompleted(false);
    setIsContinuePending(false);
    setSuccessDialogOpen(false);
    setCompletionStats(null);
    setCompletionVoltScore(null);
    setIsVoltScoreShowing(false);
    correctMoveCountRef.current = 0;
    wrongMoveCountRef.current = 0;
    totalHintCountRef.current = 0;
    currentCorrectStreakRef.current = 0;
    maxCorrectStreakRef.current = 0;
  }, [variant.id, replayKey]);

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

    setCompletionStats(createSequenceCompleteStats(attemptPayload));
    setCompletionVoltScore(null);
    setIsVoltScoreShowing(isInPracticeList);
    setSuccessDialogOpen(true);
    playLevelUpSound();
    void insertAttemptResults(attemptPayload);
  }, [currentCorrectMove, getTimeFromStartMs, isCompleted, isInPracticeList, playLevelUpSound]);

  async function insertAttemptResults(attemptPayload: AttemptPayload) {
    await recordEvent({ eventType: "complete" });

    const voltScoreResult = await updateAttemptResults("completed", {
      ...attemptPayload,
      ...(isInPracticeList ? { voltScore: voltScoreScoring } : {}),
    });

    if (isInPracticeList) {
      setCompletionVoltScore(voltScoreResult);
      setIsVoltScoreShowing(false);
    }
  }

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
      correctMoveCountRef.current += 1;
      updateCorrectStreak(currentCorrectStreakRef, maxCorrectStreakRef);

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
      hintLevel: nextHintCount as 1 | 2 | 3,
      expectedUci: currentCorrectMove,
    });
  };

  const successDestinationPath = nextVariantId ? `/openings/variant/${nextVariantId}` : parentOpeningUrl;
  const successButtonLabel = nextVariantId ? "Next variant" : "Back to opening";

  const handleContinueClick = () => {
    setIsContinuePending(true);
    router.push(successDestinationPath);
  };

  const handlePlayAgain = () => {
    setSuccessDialogOpen(false);
    setReplayKey((key) => key + 1);
  };

  const turnLabel = getTurnLabel(variant.moveSequence.initialFen);

  const successDescription = nextVariantId
    ? "You completed this line. Continue to the next variant when you are ready."
    : "You completed this line. Return to the opening when you are ready.";

  return (
    <div className="page-container">
      {Tour}
      <SolveSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Congratulations!"
        description={successDescription}
        destinationPath={successDestinationPath}
        buttonLabel={successButtonLabel}
        stats={completionStats}
        voltScore={completionVoltScore}
        isVoltScoreShowing={isVoltScoreShowing}
        onPlayAgain={handlePlayAgain}
      />
      {successDialogOpen ? (
        <Confetti aria-hidden className="pointer-events-none fixed inset-0 z-[60] size-full max-h-none max-w-none" />
      ) : null}
      <Notifier goals={sortedGoals} />
      <div className="page-container-controller-layout">
        <div
          key={sessionId}
          className="relative aspect-square w-full shrink-0 md:min-w-0 md:flex-[3]"
          data-tour="board"
        >
          <VoltBoard
            ref={boardRef}
            sourceId={sessionId}
            initialFen={variant.moveSequence.initialFen}
            coordinates={!isMobile}
            drawHintMove={currentCorrectMove}
            onCheckMove={handleBoardCheckMove}
            onSuccessMovePlayed={handleBoardSuccessMovePlayed}
            onNextMoveRequest={handleBoardNextMoveRequest}
          />
        </div>
        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          <div className="flex justify-between">
            <div>
              <Button variant="voltIcon" asChild>
                <Link href={parentOpeningUrl} aria-label="Back to opening">
                  <ChevronLeft className="size-5" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">{variant.title ?? "Untitled variant"}</div>
            <div>
              {canAddToPracticeList ? (
                <AddToPracticeButton openingVariantId={variant.id} initialInPracticeList={isInPracticeList} />
              ) : null}
            </div>
          </div>
          {isValidVoltScore(voltScore) ? <VoltCalculator result={voltScore} className="w-full" /> : null}
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
                First click shows a stronger text hint. Second click highlights which piece to move. Third click shows
                the exact move.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
