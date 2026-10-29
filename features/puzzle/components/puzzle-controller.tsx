"use client";

import { Bot, Eye, Gauge, RotateCcw, Swords, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { BoardHistoryControls } from "@/components/boards/volt-board-utilities/board-history-controls";
import { useBoardHistory } from "@/components/boards/volt-board-utilities/use-board-history";
import VoltBoardUtilities from "@/components/boards/volt-board-utilities/volt-board-utilities";
import { type VoltBoardHandle, type VoltBoardMode } from "@/components/boards/volt-board/volt-board";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { GoalViewer } from "@/components/goal-viewer/goal-viewer";
import { Notifier } from "@/components/notifier/notifier";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAX_HINT_COUNT, useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { MainIdeaButton } from "@/features/openings/components/main-idea-button";
import { updateProfileRatingAction } from "@/features/profile/actions/update-profile-rating";
import type { PuzzlePrimaryTheme } from "@/features/puzzle-theme/types/puzzle-theme";
import { usePuzzleTour } from "@/features/puzzle/hooks/use-puzzle-tour";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { formatPuzzleRatingLabel, getPuzzleRatingForScoring } from "@/features/puzzle/types/puzzle-rating";
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
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

type PuzzleControllerProps = {
  puzzle: Puzzle;
  nextPuzzleUrl?: string | null;
  backUrl?: string | null;
  isUserLoggedIn?: boolean; // Persist event'lerinin yazılıp yazılmayacağını kontrol eder
  isFavorited?: boolean;
  primaryTheme?: PuzzlePrimaryTheme | null;
};

export default function PuzzleController({
  puzzle,
  nextPuzzleUrl = null,
  isUserLoggedIn = false,
  isFavorited = false,
  primaryTheme = null,
}: PuzzleControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const isMobile = useIsMobile();
  const sequenceId = puzzle.moveSequence.id; // Her sequence'in kendi hamleleri ve PGN'i vardır. Her puzzle'ın bir sequenceId'si vardır.
  const [replayKey, setReplayKey] = useState(0); // Replay key tekil olsun diye. Play again'de sessionId değişir, değişkenler sıfırlanır.
  const sessionId = `${puzzle.id}:${replayKey}`; // tekil olması için.
  const turnLabel = getTurnLabel(puzzle.moveSequence.initialFen); // Sıranın kimde olduğunu alır, w veya b
  const hasNextPuzzle = nextPuzzleUrl != null;
  const successDestinationPath = hasNextPuzzle ? nextPuzzleUrl : null;
  const successButtonLabel = hasNextPuzzle ? "Next puzzle" : null;
  const [isCompleted, setIsCompleted] = useState(false); // Puzzle tamamlandı mı
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<MoveSequenceCompleteDialogStats | null>(null); // TS null state'e izin verir, varsayılan null. CompletionStats başlangıçta set edilmez.
  const [completionVoltScore, setCompletionVoltScore] = useState<VoltScoreResult | null>(null);
  const [isVoltScoreShowing, setIsVoltScoreShowing] = useState(false);
  const [boardMode, setBoardMode] = useState<VoltBoardMode>("practice");
  const [favorited, setFavorited] = useState(isFavorited);
  const [isPending, startTransition] = useTransition();
  const { updateAttemptResults, recordEvent, getTimeFromStartMs } = useSequenceAttempt(sequenceId, replayKey);
  const { playLevelUpSound } = useBoardSounds();

  // ================================================================================================
  // Puzzle için ref sayaçları. Ref'ler React'in güncelleme döngüsünde görünmez.
  // Bu deneme sayıları ref'lerde tutulur.
  // ================================================================================================
  const correctMoveCountRef = useRef(0);
  const wrongMoveCountRef = useRef(0);
  const totalHintCountRef = useRef(0);
  const currentCorrectStreakRef = useRef(0);
  const maxCorrectStreakRef = useRef(0);

  // ================================================================================================
  // Hamle dizisini yönetmek için useMoveSequenceController hook'u
  // ================================================================================================
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
    moves: puzzle.moveSequence.moves,
    goals: puzzle.moveSequence.goals,
  });

  const boardHistory = useBoardHistory({
    sourceId: sessionId,
    initialFen: puzzle.moveSequence.initialFen,
    moves,
    revealedPly,
  });
  const { Tour } = usePuzzleTour({ puzzleId: puzzle.id });
  const hasMainIdea = Boolean(mainIdea?.trim());
  const effectiveBoardMode = hasMainIdea ? boardMode : "practice";
  const voltScore = {
    totalMoveCount: getPlayerMoveCount(puzzle.moveSequence.moves),
    rating: getPuzzleRatingForScoring(puzzle.rating),
  };

  useEffect(() => {
    setReplayKey(0);
  }, [puzzle.id]);

  useEffect(() => {
    setFavorited(isFavorited);
  }, [puzzle.id, isFavorited]);

  // ================================================================================================
  // Puzzle id veya replay key değişince puzzle state'i sıfırlanır
  // ================================================================================================
  useEffect(() => {
    setIsCompleted(false);
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
    trackEvent("puzzle_started", { puzzle_id: puzzle.id });
  }, [puzzle.id, replayKey]);

  // ================================================================================================
  // Puzzle tamamlandı olarak işaretlenir ve deneme verisi db'ye yazılır
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

    // Dialog'da göstermek için tamamlanma istatistikleri set edilir
    trackEvent("puzzle_completed", { puzzle_id: puzzle.id, wrong_move_count: attemptPayload.wrongMoveCount });
    setCompletionStats(createSequenceCompleteStats(attemptPayload));
    setCompletionVoltScore(null);
    setIsVoltScoreShowing(favorited);
    setSuccessDialogOpen(true);
    playLevelUpSound();
    void insertAttemptResults(attemptPayload);
  }, [expectedCurrentCorrectMoveUci, favorited, getTimeFromStartMs, isCompleted, playLevelUpSound, puzzle.id]);

  // ================================================================================================
  // Tamamlanma denemesi db'ye yazılır
  // ================================================================================================
  async function insertAttemptResults(attemptPayload: AttemptPayload) {
    await recordEvent({ eventType: "complete" });

    // Complete kaydedilmeden önce puanla ki bu deneme kendi uygunluğunu engellemesin.
    if (isUserLoggedIn && attemptPayload.wrongMoveCount === 0) {
      await updateProfileRatingAction({
        sequenceId: puzzle.moveSequence.id,
        outcome: "success",
      });
    }

    const voltScoreResult = await updateAttemptResults("completed", {
      ...attemptPayload,
      ...(favorited ? { voltScore } : {}),
    });

    setCompletionVoltScore(voltScoreResult);
    setIsVoltScoreShowing(false);
  }

  // ================================================================================================
  // Tahtadaki hamle kontrolü
  // ================================================================================================
  const handleBoardCheckMove = (move: MoveAttemptPayload) => {
    const { isCorrect } = handleMoveCheck(move);

    // Doğru hamlede erken dönüş
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

    // Yanlış hamle ve puzzle devam eder
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
        // Fail kaydedilmeden önce puanla ki ilk yanlış hamle kendi uygunluğunu engellemesin.
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
  // Hint tıklaması ve hook ile iletişim
  // ================================================================================================
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

  // ================================================================================================
  // Dialog'daki play again butonu, yeni session için replay key'i artırır
  // ================================================================================================
  const handlePlayAgain = () => {
    setSuccessDialogOpen(false);
    setReplayKey((key) => key + 1);
  };

  return (
    <div className="page-container pb-0">
      {Tour}
      {/* Başarı dialogu */}
      <SolveSuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        destinationPath={successDestinationPath}
        buttonLabel={successButtonLabel}
        stats={completionStats}
        voltScore={completionVoltScore}
        isVoltScoreShowing={isVoltScoreShowing}
        onPlayAgain={handlePlayAgain}
        footerExtra={<FavoriteButton puzzleId={puzzle.id} isFavorited={favorited} onFavoritedChange={setFavorited} />}
      />

      {/* Konfeti */}
      {successDialogOpen ? (
        <Confetti aria-hidden className="pointer-events-none fixed inset-0 z-[60] size-full max-h-none max-w-none" />
      ) : null}

      {/* Bildirim */}
      <Notifier goals={sortedGoals} />

      <div className="page-container-controller-layout">
        {/* Tahta sarmalayıcı: aspect-square kareyi belirler; volt.css içindeki .board-wrapper onu doldurur */}
        {/* self-start kritik. Komşu elemanlar büyüyünce tahta küçülmesin diye. self-start = sadece bu child, cross-axis başa hizalanır */}
        <div className="flex w-full shrink-0 flex-col gap-3 self-start rounded-xl md:min-w-0 md:flex-[3]">
          <div key={sessionId} className="w-full" data-tour="board">
            <VoltBoardUtilities
              ref={boardRef}
              historyFen={boardHistory.historyFen}
              sourceId={sessionId}
              mode={effectiveBoardMode}
              initialFen={puzzle.moveSequence.initialFen}
              coordinates={!isMobile}
              drawHintMove={expectedCurrentCorrectMoveUci}
              activeGoalVisuals={nextGoal?.visuals}
              onCheckMove={handleBoardCheckMove}
              onSuccessMovePlayed={handleSuccessMovePlayed} // doğrudan hook ile iletişim
              onNextMoveRequest={handleNextMoveRequest} // doğrudan hook ile iletişim
            />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <BoardHistoryControls history={boardHistory} />
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              <Badge variant="outline" className="max-w-full rounded-xl p-3 text-sm">
                <Gauge className="text-primary" data-icon="inline-start" />
                <span className="truncate">{formatPuzzleRatingLabel(puzzle.rating)}</span>
              </Badge>
              {/*<Badge variant="outline" className="max-w-full rounded-xl p-3 text-sm">
                <Tags className="text-primary" data-icon="inline-start" />
                <span className="truncate">{primaryTheme?.title ?? "—"}</span>
              </Badge>*/}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {effectiveBoardMode === "learn" ? <MainIdeaButton mainIdea={mainIdea} /> : null}
              <div data-tour="favorite-button" className="shrink-0">
                <FavoriteButton puzzleId={puzzle.id} isFavorited={favorited} onFavoritedChange={setFavorited} />
              </div>
            </div>
          </div>
        </div>

        {/* Kontrol paneli */}
        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          {/* Kontrol paneli başlığı
          <div className="flex justify-between">
            <div>
              {backUrl ? (
                <Button variant="voltIcon" onClick={handleBackClick} disabled={isPending} aria-label="Back">
                  {isPending ? <Spinner className="size-5" /> : <ChevronLeft className="size-5" />}
                </Button>
              ) : (
                <div className="h-9 w-10 shrink-0" aria-hidden />
              )}
            </div>
          </div>
          */}

          {hasMainIdea ? (
            <Tabs
              value={boardMode}
              onValueChange={(value) => {
                setBoardMode(value as VoltBoardMode);
                trackEvent("game_mode_switched", { source: "puzzle", mode: value });
              }}
              aria-label="Game Mode"
              data-tour="game-mode"
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
          ) : null}

          {/* Hedef görüntüleyici */}
          <GoalViewer goals={sortedGoals} mode={effectiveBoardMode} turnLabel={turnLabel} />

          {/* Alt butonlar */}
          <div className="mt-auto">
            <div className="flex gap-2">
              {!isCompleted ? (
                <Button
                  variant="voltGreen"
                  onClick={handleHintClick}
                  disabled={hintCount >= MAX_HINT_COUNT}
                  className="w-full min-w-0 flex-1"
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
                  {hasNextPuzzle ? (
                    <Button
                      variant="volt"
                      onClick={() => {
                        if (!successDestinationPath) return;
                        startTransition(() => {
                          router.push(successDestinationPath);
                        });
                      }}
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
