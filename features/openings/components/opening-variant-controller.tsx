"use client";

import { Bot, Eye, RotateCcw, Swords } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BoardHistoryControls } from "@/components/boards/volt-board-utilities/board-history-controls";
import { useBoardHistory } from "@/components/boards/volt-board-utilities/use-board-history";
import VoltBoardUtilities from "@/components/boards/volt-board-utilities/volt-board-utilities";
import { type VoltBoardHandle, type VoltBoardMode } from "@/components/boards/volt-board/volt-board";
import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
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
import { useOpeningVariantTour } from "@/features/openings/hooks/use-opening-variant-tour";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { FavoriteButton } from "@/features/user-favorites/components/favorite-button";
import { useSequenceAttempt } from "@/features/user-sequence-attempt/hooks/use-sequence-attempt";
import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import {
  type AttemptPayload,
  createAttemptPayload,
  createSequenceCompleteStats,
} from "@/features/user-sequence-attempt/utilities/create-attempt-payload";
import { updateCorrectStreak } from "@/features/user-sequence-attempt/utilities/update-correct-streak";
import { useIsMobile } from "@/hooks/use-mobile";
import { trackEvent } from "@/lib/analytics/analytics";
import { getTurnLabel } from "@/lib/chess/getTurnLabel";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

type OpeningVariantControllerProps = {
  variant: OpeningVariant;
  nextVariantPath: string | null;
  parentOpeningUrl: string;
  canFavorite?: boolean;
  isFavorited?: boolean;
  voltScore?: VoltScoreResult | null;
};

export default function OpeningVariantController({
  variant,
  nextVariantPath,
  parentOpeningUrl,
  canFavorite = false,
  isFavorited = false,
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
  const [completionStats, setCompletionStats] = useState<MoveSequenceCompleteDialogStats | null>(null);
  const [completionVoltScore, setCompletionVoltScore] = useState<VoltScoreResult | null>(null);
  const [isVoltScoreShowing, setIsVoltScoreShowing] = useState(false);
  const [boardMode, setBoardMode] = useState<VoltBoardMode>("practice");
  const [favorited, setFavorited] = useState(isFavorited);
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
    nextGoal,
    hintCount,
    hintRequested,
    expectedCurrentCorrectMoveUci,
    mainIdea,
    moves,
    revealedPly,
  } = useMoveSequenceController({
    sourceId: sessionId,
    moves: variant.moveSequence.moves,
    goals: variant.moveSequence.goals,
    // Moves/goals are already relative to initialFen (goals start at ply 1).
    // Do not pass absolute board initialPly or early goals get auto-completed.
  });
  const boardHistory = useBoardHistory({
    sourceId: sessionId,
    initialFen: variant.moveSequence.initialFen,
    moves,
    revealedPly,
  });
  const { Tour } = useOpeningVariantTour({ variantId: variant.id });
  const voltScoreScoring = {
    totalMoveCount: getPlayerMoveCount(variant.moveSequence.moves),
    rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
  };

  useEffect(() => {
    setReplayKey(0);
    trackEvent("opening_game_selected", { variant_id: variant.id });
  }, [variant.id]);

  useEffect(() => {
    setFavorited(isFavorited);
  }, [variant.id, isFavorited]);

  useEffect(() => {
    setIsCompleted(false);
    setIsContinuePending(false);
    setSuccessDialogOpen(false);
    setCompletionStats(null);
    setCompletionVoltScore(null);
    setIsVoltScoreShowing(false);
    setBoardMode("practice");
    correctMoveCountRef.current = 0;
    wrongMoveCountRef.current = 0;
    totalHintCountRef.current = 0;
    currentCorrectStreakRef.current = 0;
    maxCorrectStreakRef.current = 0;
  }, [variant.id, replayKey]);

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

    trackEvent("opening_game_completed", { variant_id: variant.id, wrong_move_count: attemptPayload.wrongMoveCount });
    setCompletionStats(createSequenceCompleteStats(attemptPayload));
    setCompletionVoltScore(null);
    setIsVoltScoreShowing(favorited);
    setSuccessDialogOpen(true);
    playLevelUpSound();
    void insertAttemptResults(attemptPayload);
  }, [expectedCurrentCorrectMoveUci, favorited, getTimeFromStartMs, isCompleted, playLevelUpSound, variant.id]);

  async function insertAttemptResults(attemptPayload: AttemptPayload) {
    await recordEvent({ eventType: "complete" });

    const voltScoreResult = await updateAttemptResults("completed", {
      ...attemptPayload,
      ...(favorited ? { voltScore: voltScoreScoring } : {}),
    });

    setCompletionVoltScore(voltScoreResult);
    setIsVoltScoreShowing(false);
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
          expectedUci: expectedCurrentCorrectMoveUci ?? undefined,
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
        expectedUci: expectedCurrentCorrectMoveUci ?? undefined,
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
    if (nextHintCount == null || !expectedCurrentCorrectMoveUci) return;
    boardHistory.reset();
    boardRef.current?.showHint(nextHintCount);
    totalHintCountRef.current += 1;

    void recordEvent({
      eventType: "hint",
      hintLevel: nextHintCount as 1 | 2,
      expectedUci: expectedCurrentCorrectMoveUci,
    });
  };

  const successDestinationPath = nextVariantPath ?? parentOpeningUrl;
  const successButtonLabel = nextVariantPath ? "Next variant" : "Back to opening";

  const handleContinueClick = () => {
    setIsContinuePending(true);
    router.push(successDestinationPath);
  };

  const handlePlayAgain = () => {
    setSuccessDialogOpen(false);
    setReplayKey((key) => key + 1);
  };

  const turnLabel = getTurnLabel(variant.moveSequence.initialFen);

  return (
    <div className="page-container pb-0">
      {Tour}
      <SolveSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Congratulations!"
        destinationPath={successDestinationPath}
        buttonLabel={successButtonLabel}
        stats={completionStats}
        voltScore={completionVoltScore}
        isVoltScoreShowing={isVoltScoreShowing}
        onPlayAgain={handlePlayAgain}
        footerExtra={
          canFavorite ? (
            <FavoriteButton openingVariantId={variant.id} isFavorited={favorited} onFavoritedChange={setFavorited} />
          ) : null
        }
      />
      {successDialogOpen ? (
        <Confetti aria-hidden className="pointer-events-none fixed inset-0 z-[60] size-full max-h-none max-w-none" />
      ) : null}
      <Notifier goals={sortedGoals} />
      <div className="page-container-controller-layout">
        <div key={sessionId} className="flex w-full shrink-0 flex-col gap-3 self-start md:min-w-0 md:flex-[3]">
          <VoltBoardUtilities
            ref={boardRef}
            historyFen={boardHistory.historyFen}
            sourceId={sessionId}
            mode={boardMode}
            initialFen={variant.moveSequence.initialFen}
            coordinates={!isMobile}
            drawHintMove={expectedCurrentCorrectMoveUci}
            activeGoalVisuals={nextGoal?.visuals}
            onCheckMove={handleBoardCheckMove}
            onSuccessMovePlayed={handleBoardSuccessMovePlayed}
            onNextMoveRequest={handleBoardNextMoveRequest}
          />
          <div className="flex min-w-0 items-center gap-2">
            <BoardHistoryControls history={boardHistory} />
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {boardMode === "learn" ? <MainIdeaButton mainIdea={mainIdea} /> : null}
              {canFavorite ? (
                <div data-tour="favorite-button" className="shrink-0">
                  <FavoriteButton
                    openingVariantId={variant.id}
                    isFavorited={favorited}
                    onFavoritedChange={setFavorited}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          <Tabs
            value={boardMode}
            onValueChange={(value) => {
              setBoardMode(value as VoltBoardMode);
              trackEvent("game_mode_switched", { source: "opening_variant", mode: value });
            }}
            aria-label="Board mode"
            data-tour="board-mode"
          >
            <TabsList variant="primary" className="w-full rounded-lg">
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
          <GoalViewer goals={sortedGoals} mode={boardMode} turnLabel={turnLabel} />
          <div className="mt-auto flex gap-2" data-tour="hint-button">
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
              <>
                <Button variant="voltGreen" onClick={handlePlayAgain} className="min-w-0 flex-1">
                  <RotateCcw data-icon="inline-start" />
                  Play again
                </Button>
                <Button
                  variant="volt"
                  onClick={handleContinueClick}
                  disabled={isContinuePending}
                  className="min-w-0 flex-1"
                >
                  {isContinuePending && <Spinner data-icon="inline-start" />}
                  {successButtonLabel}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
