"use client";

import { Chess } from "chess.js";
import Lottie from "lottie-react";
import { ChevronLeft, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import VoltBoard, { type VoltBoardHandle } from "@/components/boards/volt-board/volt-board";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { VoltCoach } from "@/components/volt-coach/volt-coach";
import { useImportedGames } from "@/features/analysis/components/imported-games-provider";
import { importedGameFocus } from "@/features/analysis/utilities/imported-game-label";
import type { GameAnalysis, GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import { BoardPlayerName } from "@/features/game-review/components/board-player-name";
import { GameReviewQuestionStepper } from "@/features/game-review/components/game-review-question-stepper";
import { useGameReview } from "@/features/game-review/hooks/use-game-review";
import { MAX_HINT_COUNT, useMoveSequenceController } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { FavoriteButton } from "@/features/user-favorites/components/favorite-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getTurnLabel } from "@/lib/chess/getTurnLabel";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

type GameReviewControllerProps = {
  analysis: GameAnalysis | null;
  source: GameAnalysisSource;
  gameId: string;
  reviewQuestions: GameReviewQuestion[];
  favoritedGameReviewQuestionIds: string[];
  backUrl?: string;
};

function pgnHeader(pgn: string, tag: string): string | null {
  const value = pgn.match(new RegExp(`\\[${tag}\\s+"([^"]*)"\\]`, "i"))?.[1]?.trim();
  return value || null;
}

function playedMoveLabel(question: GameReviewQuestion, originalMoveByPly: Record<number, string>): string {
  const originalMove = originalMoveByPly[question.ply]?.trim();
  if (originalMove) return originalMove;

  const title = question.title.trim();
  return /^played\s+/i.test(title) ? title.replace(/^played\s+/i, "").trim() : "";
}

export default function GameReviewController({
  analysis,
  source,
  gameId,
  reviewQuestions: initialReviewQuestions,
  favoritedGameReviewQuestionIds,
  backUrl = "/analysis",
}: GameReviewControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const didAutoReview = useRef(false);
  const completedQuestionIdsRef = useRef<Set<string>>(new Set());
  const completedSessionRef = useRef<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<GameReviewQuestion | null>(
    () => initialReviewQuestions[0] ?? null,
  );
  const [completedQuestionIds, setCompletedQuestionIds] = useState<Set<string>>(() => new Set());
  const [favoritedQuestionIds, setFavoritedQuestionIds] = useState<Set<string>>(
    () => new Set(favoritedGameReviewQuestionIds),
  );
  const [successfulMoveSessionId, setSuccessfulMoveSessionId] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const { findGame, chesscomUsername, lichessUsername } = useImportedGames();
  const { status, error, criticalMoments, reviewQuestions, review } = useGameReview(
    analysis?.data,
    initialReviewQuestions,
  );

  const importedGame = findGame(source, gameId);
  const pgn = analysis?.data.pgn?.trim() || importedGame?.pgn?.trim() || "";
  const sourceId = `game-review-${source}-${gameId}`;
  const focusUsername = source === "chesscom" ? chesscomUsername : lichessUsername;
  const { youAreBlack } = importedGame ? importedGameFocus(importedGame, focusUsername) : { youAreBlack: false };
  const whitePlayer = pgnHeader(pgn, "White");
  const blackPlayer = pgnHeader(pgn, "Black");
  const whiteElo =
    pgnHeader(pgn, "WhiteElo") ?? (importedGame?.white.rating != null ? String(importedGame.white.rating) : null);
  const blackElo =
    pgnHeader(pgn, "BlackElo") ?? (importedGame?.black.rating != null ? String(importedGame.black.rating) : null);
  const originalMoveByPly = useMemo(() => {
    return criticalMoments.reduce<Record<number, string>>((acc, moment) => {
      acc[moment.ply] = moment.playedSan;
      return acc;
    }, {});
  }, [criticalMoments]);
  const originalMoveUciByPly = useMemo(() => {
    return criticalMoments.reduce<Record<number, string>>((acc, moment) => {
      acc[moment.ply] = moment.playedUci;
      return acc;
    }, {});
  }, [criticalMoments]);
  const activeMoveSequence = activeQuestion?.moveSequence ?? null;
  const boardFen =
    activeMoveSequence?.initialFen ??
    criticalMoments[0]?.fen ??
    reviewQuestions[0]?.moveSequence.initialFen ??
    getFenFromPgnAtPly(pgn, 0) ??
    new Chess().fen();
  const playSessionId = activeQuestion ? `${activeQuestion.id}:${replayKey}` : `${sourceId}:${boardFen}`;
  const activeQuestionIndex = activeQuestion
    ? reviewQuestions.findIndex((question) => question.id === activeQuestion.id)
    : -1;
  const activeQuestionPlayedMove = activeQuestion ? playedMoveLabel(activeQuestion, originalMoveByPly) : "";
  const activeQuestionPlayedMoveUci = activeQuestion ? originalMoveUciByPly[activeQuestion.ply] : null;
  const completedQuestionsCount = reviewQuestions.filter((question) => completedQuestionIds.has(question.id)).length;
  const questionProgressValue =
    reviewQuestions.length > 0 ? Math.round((completedQuestionsCount / reviewQuestions.length) * 100) : 0;
  const isActiveQuestionFavorited = activeQuestion ? favoritedQuestionIds.has(activeQuestion.id) : false;
  const coachTitle = activeQuestion ? getTurnLabel(activeMoveSequence?.initialFen ?? boardFen) : "Game review";
  const coachMessage = activeQuestion
    ? activeQuestionPlayedMove
      ? `You played ${activeQuestionPlayedMove} in the game. Find the best move to play here.`
      : "Solve the original game position on the board."
    : "Pick a review question to solve it on the board.";
  const {
    handleMoveCheck,
    handleSuccessMovePlayed,
    handleNextMoveRequest,
    hintCount,
    hintRequested,
    expectedCurrentCorrectMoveUci,
  } = useMoveSequenceController({
    sourceId: playSessionId,
    moves: activeMoveSequence?.moves ?? "",
    goals: activeMoveSequence?.goals ?? null,
  });
  const isCompleted = Boolean(
    activeQuestion && successfulMoveSessionId === playSessionId && expectedCurrentCorrectMoveUci == null,
  );

  useEffect(() => {
    if (didAutoReview.current || analysis?.data.criticalMoments.length || !pgn) return;
    if (!focusUsername.trim()) return;
    didAutoReview.current = true;
    void review(pgn, { source, gameId, username: focusUsername });
  }, [analysis, focusUsername, gameId, pgn, review, source]);

  useEffect(() => {
    const validQuestionIds = new Set(reviewQuestions.map((question) => question.id));
    const nextCompletedQuestionIds = new Set(
      [...completedQuestionIdsRef.current].filter((questionId) => validQuestionIds.has(questionId)),
    );

    completedQuestionIdsRef.current = nextCompletedQuestionIds;
    setCompletedQuestionIds(nextCompletedQuestionIds);
  }, [reviewQuestions]);

  useEffect(() => {
    const firstQuestion = reviewQuestions[0] ?? null;

    if (!firstQuestion) {
      if (activeQuestion) setActiveQuestion(null);
      return;
    }

    if (activeQuestion && reviewQuestions.some((question) => question.id === activeQuestion.id)) return;

    setActiveQuestion(firstQuestion);
  }, [activeQuestion, reviewQuestions]);

  useEffect(() => {
    if (!activeQuestion || !isCompleted) return;
    if (completedSessionRef.current === playSessionId) return;

    completedSessionRef.current = playSessionId;
    const nextCompletedQuestionIds = new Set(completedQuestionIdsRef.current);
    nextCompletedQuestionIds.add(activeQuestion.id);
    completedQuestionIdsRef.current = nextCompletedQuestionIds;
    setCompletedQuestionIds(nextCompletedQuestionIds);

    const nextQuestion = activeQuestionIndex >= 0 ? reviewQuestions[activeQuestionIndex + 1] : null;
    if (!nextQuestion) return;

    const timeoutId = setTimeout(() => {
      setActiveQuestion(nextQuestion);
      setReplayKey((key) => key + 1);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [activeQuestion, activeQuestionIndex, isCompleted, playSessionId, reviewQuestions]);

  const handleBackClick = () => {
    startTransition(() => {
      router.push(backUrl);
    });
  };

  const handleSelectQuestion = (question: GameReviewQuestion) => {
    setActiveQuestion(question);
    setReplayKey((key) => key + 1);
  };

  const handleQuestionFavoritedChange = (questionId: string, favorited: boolean) => {
    setFavoritedQuestionIds((current) => {
      const next = new Set(current);
      if (favorited) {
        next.add(questionId);
      } else {
        next.delete(questionId);
      }
      return next;
    });
  };

  const handleBoardCheckMove = (move: MoveAttemptPayload) => {
    if (!activeQuestion || isCompleted) return false;
    return handleMoveCheck(move).isCorrect;
  };

  const handleQuestionSuccessMovePlayed = (move: Move) => {
    setSuccessfulMoveSessionId(playSessionId);
    handleSuccessMovePlayed(move);
  };

  const handleHintClick = () => {
    const nextHintCount = hintRequested();
    if (nextHintCount == null || !expectedCurrentCorrectMoveUci) return;
    boardRef.current?.showHint(nextHintCount);
  };

  return (
    <div className="page-container">
      <div className="page-container-controller-layout">
        <div className="relative flex w-full min-w-0 shrink-0 flex-col gap-2 self-start md:flex-[3]">
          <div className="relative aspect-square w-full">
            <VoltBoard
              ref={boardRef}
              key={playSessionId}
              sourceId={playSessionId}
              initialFen={boardFen}
              coordinates={!isMobile}
              playerOrientation={youAreBlack ? "black" : "white"}
              viewOnly={!activeQuestion}
              drawHintMove={expectedCurrentCorrectMoveUci}
              playedMoveArrow={activeQuestionPlayedMoveUci}
              onCheckMove={activeQuestion ? handleBoardCheckMove : () => true}
              onSuccessMovePlayed={activeQuestion ? handleQuestionSuccessMovePlayed : () => {}}
              onNextMoveRequest={activeQuestion ? handleNextMoveRequest : () => undefined}
            />
          </div>
          <BoardPlayerName
            name={youAreBlack ? whitePlayer : blackPlayer}
            elo={youAreBlack ? whiteElo : blackElo}
            color={youAreBlack ? "white" : "black"}
            className="absolute top-[-30px] left-0"
          />
          <BoardPlayerName
            name={youAreBlack ? blackPlayer : whitePlayer}
            elo={youAreBlack ? blackElo : whiteElo}
            color={youAreBlack ? "black" : "white"}
            className="absolute bottom-[-40px] left-0"
          />
        </div>

        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          <div className="flex justify-between">
            <div>
              <Button variant="voltIcon" onClick={handleBackClick} disabled={isPending} aria-label="Back">
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
              {activeQuestion ? (
                <div data-tour="favorite-button">
                  <FavoriteButton
                    gameReviewQuestionId={activeQuestion.id}
                    isFavorited={isActiveQuestionFavorited}
                    onFavoritedChange={(favorited) => handleQuestionFavoritedChange(activeQuestion.id, favorited)}
                  />
                </div>
              ) : (
                <div className="size-9" />
              )}
            </div>
          </div>

          <div className="card-border-bottom-shadow p-4">
            <VoltCoach title={coachTitle} message={coachMessage} ttsKey={activeQuestion ? playSessionId : sourceId} />
          </div>

          {reviewQuestions.length > 0 ? (
            <div className="flex items-center">
              <Progress
                value={questionProgressValue}
                className="h-4 flex-1 rounded-r-none"
                aria-label="Solved questions progress"
              />
              <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
                <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
              </div>
            </div>
          ) : null}

          <GameReviewQuestionStepper
            questions={reviewQuestions}
            originalMoveByPly={originalMoveByPly}
            activeQuestionId={activeQuestion?.id ?? null}
            completedQuestionIds={completedQuestionIds}
            isLoading={status === "loading"}
            error={error}
            hasResult={status === "success"}
            onSelectQuestion={handleSelectQuestion}
          />

          {activeQuestion && !isCompleted ? (
            <div className="mt-auto flex gap-2">
              <Button
                type="button"
                variant="voltGreen"
                onClick={handleHintClick}
                disabled={hintCount >= MAX_HINT_COUNT || !expectedCurrentCorrectMoveUci}
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
