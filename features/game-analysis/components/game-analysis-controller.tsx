"use client";

import Lottie from "lottie-react";
import { ChevronLeft, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { SolveSuccessDialog } from "@/components/solve-success-dialog/solve-success-dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { VoltCoach } from "@/components/volt-coach/volt-coach";
import { GameAnalysisMistakeStepper } from "@/features/game-analysis/components/game-analysis-mistake-stepper";
import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import { BoardPlayerName } from "@/features/game-analysis/components/board-player-name";
import { FavoriteButton } from "@/features/user-favorites/components/favorite-button";
import type { ChesscomRealGame } from "@/features/game-analysis/types/chesscom-real-game";
import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";
import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import {
  createAttemptPayload,
  createSequenceCompleteStats,
} from "@/features/user-sequence-attempt/utilities/create-attempt-payload";
import { updateCorrectStreak } from "@/features/user-sequence-attempt/utilities/update-correct-streak";
import { useIsMobile } from "@/hooks/use-mobile";
import { getTurnLabel } from "@/lib/chess/getTurnLabel";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

const MAX_HINT_COUNT = 2;
const NEXT_QUESTION_DELAY_MS = 800;

type GameAnalysisControllerProps = {
  analysis: GameAnalysisWithMistakes;
  game?: ChesscomRealGame;
  initialQuestionId?: string | null;
};

type PlayableQuestion = {
  question: GameAnalysisMistake;
  moment: CriticalMoment;
};

function playableQuestions(analysis: GameAnalysisWithMistakes): PlayableQuestion[] {
  const momentByPly = new Map(analysis.criticalMoments.map((moment) => [moment.ply, moment]));

  return analysis.questions.flatMap((question) => {
    const moment = momentByPly.get(question.ply);
    if (!moment?.bestUci.trim()) return [];
    return [{ question, moment }];
  });
}

function ratingLabel(rating: number | undefined): string | null {
  return rating == null ? null : String(rating);
}

export default function GameAnalysisController({ analysis, game, initialQuestionId }: GameAnalysisControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solvedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  const correctMoveCountRef = useRef(0);
  const wrongMoveCountRef = useRef(0);
  const totalHintCountRef = useRef(0);
  const currentCorrectStreakRef = useRef(0);
  const maxCorrectStreakRef = useRef(0);

  const playable = useMemo(() => playableQuestions(analysis), [analysis]);
  const questions = useMemo(() => playable.map((item) => item.question), [playable]);
  const originalMoveByPly = useMemo(() => {
    return Object.fromEntries(analysis.criticalMoments.map((moment) => [moment.ply, moment.playedSan]));
  }, [analysis.criticalMoments]);

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(() => {
    if (initialQuestionId && questions.some((question) => question.id === initialQuestionId)) {
      return initialQuestionId;
    }
    return questions[0]?.id ?? null;
  });
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());
  const [favoritedQuestionIds, setFavoritedQuestionIds] = useState<Set<string>>(
    () => new Set(analysis.favoritedQuestionIds),
  );
  const [hintCount, setHintCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<MoveSequenceCompleteDialogStats | null>(null);
  const [boardKey, setBoardKey] = useState(0);

  const active = playable.find((item) => item.question.id === activeQuestionId) ?? null;
  const youAreBlack = playable[0]?.moment.turn === "b";
  const bottomPlayer = youAreBlack ? game?.black : game?.white;
  const topPlayer = youAreBlack ? game?.white : game?.black;
  const playSessionId = active ? `${active.question.id}:${boardKey}` : "game-analysis";
  const playedMove = active ? (originalMoveByPly[active.question.ply]?.trim() ?? "") : "";
  const coachTitle = active ? getTurnLabel(active.moment.fen) : "Game review";
  const coachMessage = active
    ? playedMove
      ? `You played ${playedMove} in the game. Find the best move to play here.`
      : "Solve the original game position on the board."
    : "Pick a review question to solve it on the board.";
  const progressValue = questions.length > 0 ? Math.round((completedIds.size / questions.length) * 100) : 0;
  const isActiveQuestionFavorited = active ? favoritedQuestionIds.has(active.question.id) : false;

  function clearAdvance() {
    if (advanceTimeoutRef.current == null) return;
    clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = null;
  }

  function showQuestion(questionId: string) {
    clearAdvance();
    solvedRef.current = false;
    setSolved(false);
    setHintCount(0);
    setActiveQuestionId(questionId);
    setBoardKey((key) => key + 1);
  }

  useEffect(() => {
    startedAtRef.current = Date.now();
    return () => clearAdvance();
  }, []);

  function handleBack() {
    startTransition(() => {
      router.push("/game-analysis");
    });
  }

  function handleSelectQuestion(question: GameAnalysisMistake) {
    showQuestion(question.id);
  }

  function handleQuestionFavoritedChange(questionId: string, favorited: boolean) {
    setFavoritedQuestionIds((current) => {
      const next = new Set(current);
      if (favorited) next.add(questionId);
      else next.delete(questionId);
      return next;
    });
  }

  function handleCheckMove(move: MoveAttemptPayload) {
    if (!active || solvedRef.current) return false;

    if (move.uci === active.moment.bestUci) {
      correctMoveCountRef.current += 1;
      updateCorrectStreak(currentCorrectStreakRef, maxCorrectStreakRef);
      return true;
    }

    wrongMoveCountRef.current += 1;
    currentCorrectStreakRef.current = 0;
    return false;
  }

  function handleSuccess() {
    if (!active || solvedRef.current) return;

    solvedRef.current = true;
    setSolved(true);

    const nextCompleted = new Set(completedIds);
    nextCompleted.add(active.question.id);
    setCompletedIds(nextCompleted);

    const activeIndex = playable.indexOf(active);
    const later = playable.slice(activeIndex + 1);
    const earlier = playable.slice(0, activeIndex);
    const remaining = [...later, ...earlier].filter((item) => !nextCompleted.has(item.question.id));

    if (remaining.length === 0) {
      setCompletionStats(
        createSequenceCompleteStats(
          createAttemptPayload(
            correctMoveCountRef.current,
            wrongMoveCountRef.current,
            totalHintCountRef.current,
            maxCorrectStreakRef.current,
            startedAtRef.current == null ? null : Date.now() - startedAtRef.current,
          ),
        ),
      );
      setSuccessOpen(true);
      return;
    }

    const nextQuestionId = remaining[0].question.id;
    clearAdvance();
    advanceTimeoutRef.current = setTimeout(() => {
      advanceTimeoutRef.current = null;
      showQuestion(nextQuestionId);
    }, NEXT_QUESTION_DELAY_MS);
  }

  function handleHint() {
    if (!active || solved || hintCount >= MAX_HINT_COUNT) return;
    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
    totalHintCountRef.current += 1;
    boardRef.current?.showHint(nextHintCount);
  }

  return (
    <div className="page-container">
      <SolveSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Game review complete!"
        destinationPath="/game-analysis"
        buttonLabel="Back to analysis"
        stats={completionStats}
      />

      {successOpen ? (
        <Confetti aria-hidden className="pointer-events-none fixed inset-0 z-[60] size-full max-h-none max-w-none" />
      ) : null}

      <div className="page-container-controller-layout">
        <div className="relative flex w-full min-w-0 shrink-0 flex-col gap-2 self-start md:flex-[3]">
          <div className="relative aspect-square w-full">
            {active ? (
              <VoltBoard
                ref={boardRef}
                key={boardKey}
                sourceId={playSessionId}
                initialFen={active.moment.fen}
                coordinates={!isMobile}
                playerOrientation={youAreBlack ? "black" : "white"}
                drawHintMove={active.moment.bestUci}
                playedMoveArrow={active.moment.playedUci}
                onCheckMove={handleCheckMove}
                onSuccessMovePlayed={handleSuccess}
                onNextMoveRequest={() => undefined}
              />
            ) : null}
          </div>
          <BoardPlayerName
            name={topPlayer?.username ?? null}
            elo={ratingLabel(topPlayer?.rating)}
            color={youAreBlack ? "white" : "black"}
            className="absolute top-[-30px] left-0"
          />
          <BoardPlayerName
            name={bottomPlayer?.username ?? null}
            elo={ratingLabel(bottomPlayer?.rating)}
            color={youAreBlack ? "black" : "white"}
            className="absolute bottom-[-40px] left-0"
          />
        </div>

        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          <div className="flex justify-between">
            <div>
              <Button variant="voltIcon" onClick={handleBack} disabled={isPending} aria-label="Back">
                {isPending ? <Spinner className="size-5" /> : <ChevronLeft className="size-5" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Image
                src="/images/icons/icon-blunder-double.png"
                alt=""
                aria-hidden
                width={30}
                height={30}
                className="size-7 shrink-0"
              />
              Play Your Missings
            </div>
            <div className="flex items-center gap-2">
              {active ? (
                <FavoriteButton
                  gameAnalysisMistakeId={active.question.id}
                  isFavorited={isActiveQuestionFavorited}
                  onFavoritedChange={(favorited) => handleQuestionFavoritedChange(active.question.id, favorited)}
                />
              ) : (
                <div className="size-9" />
              )}
            </div>
          </div>

          <div className="card-border-bottom-shadow p-4">
            <VoltCoach title={coachTitle} message={coachMessage} ttsKey={playSessionId} />
          </div>

          {questions.length > 0 ? (
            <div className="flex items-center">
              <Progress
                value={progressValue}
                className="h-4 flex-1 rounded-r-none"
                aria-label="Solved questions progress"
              />
              <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
                <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
              </div>
            </div>
          ) : null}

          <GameAnalysisMistakeStepper
            questions={questions}
            originalMoveByPly={originalMoveByPly}
            activeQuestionId={active?.question.id ?? null}
            completedQuestionIds={completedIds}
            isLoading={false}
            error={null}
            hasResult
            onSelectQuestion={handleSelectQuestion}
          />

          {active && !solved ? (
            <div className="mt-auto flex gap-2">
              <Button
                type="button"
                variant="voltGreen"
                onClick={handleHint}
                disabled={hintCount >= MAX_HINT_COUNT}
                className="min-w-0 flex-1"
              >
                <Eye data-icon="inline-start" />
                Hint
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
