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
import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import { BoardPlayerName } from "@/features/game-analysis/components/board-player-name";
import { GameAnalysisMistakeStepper } from "@/features/game-analysis/components/game-analysis-mistake-stepper";
import type { ChessComGame } from "@/features/game-analysis/types/chesscom-game";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";
import { getMistakesByPly } from "@/features/game-analysis/utilities/get-mistakes-by-ply";
import { getRatingLabel } from "@/features/game-analysis/utilities/get-rating-label";
import { MAX_HINT_COUNT } from "@/features/move-sequence/hooks/use-move-sequence-controller";
import { FavoriteButton } from "@/features/user-favorites/components/favorite-button";
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

type GameAnalysisControllerProps = {
  analysis: GameAnalysisWithMistakes;
  game?: ChessComGame;
  initialMistakeId?: string | null;
};

export default function GameAnalysisController({ analysis, game, initialMistakeId }: GameAnalysisControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const solvedRef = useRef(false);
  const [boardKey, setBoardKey] = useState(0);

  // ================================================================================================
  // Timer ve score tracking için refler.
  // ================================================================================================
  const startedAtRef = useRef<number | null>(null);
  const correctMoveCountRef = useRef(0);
  const wrongMoveCountRef = useRef(0);
  const totalHintCountRef = useRef(0);
  const currentCorrectStreakRef = useRef(0);
  const maxCorrectStreakRef = useRef(0);
  const [hintCount, setHintCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [completionStats, setCompletionStats] = useState<MoveSequenceCompleteDialogStats | null>(null);

  // Hataları ply ye göre gruplar.
  const mistakesByPly = useMemo(() => getMistakesByPly(analysis), [analysis]);

  // Ply ye göre gruplanmış hataları döndürür. Sadece hatalar döner.
  const mistakes = useMemo(() => mistakesByPly.map((item) => item.mistake), [mistakesByPly]);

  // Ply ye göre hamleleri döndürür. San formatında. Koç bu durumda ne oynadığını söyler. Played Nf3 gibi.
  const userMoveByPlyWithSan = useMemo(() => {
    return Object.fromEntries(analysis.criticalMoments.map((moment) => [moment.ply, moment.playedSan]));
  }, [analysis.criticalMoments]);

  // Aktif hangi pozisyonla başlanacağına karar verir. Favorilere eklenen hata ile başlar.
  const [activeMistakeId, setActiveMistakeId] = useState<string | null>(() => {
    if (initialMistakeId && mistakes.some((mistake) => mistake.id === initialMistakeId)) {
      return initialMistakeId;
    }
    return mistakes[0]?.id ?? null;
  });

  // Hangi pozisyonlar çözüldü bilgisini tutar.
  const [completedMistakeIds, setCompletedMistakeIds] = useState<Set<string>>(() => new Set());

  // Hangi pozisyonlar hatalar favorilere eklendi bilgisini tutar.
  const [favoritedMistakeIds, setFavoritedMistakeIds] = useState<Set<string>>(
    () => new Set(analysis.favoritedMistakeIds),
  );

  // Seçili hatanın tam çifti: kayıtlı hata ve ona karşılık gelen kritik an.
  const activeMistake = mistakesByPly.find((item) => item.mistake.id === activeMistakeId) ?? null;
  const youAreBlack = mistakesByPly[0]?.moment.turn === "b"; // Oyuncu rengi hataya göre belirlenir.
  const bottomPlayer = youAreBlack ? game?.black : game?.white; // Alt oyuncu.
  const topPlayer = youAreBlack ? game?.white : game?.black; // Üst oyuncu.
  const playSessionId = activeMistake ? `${activeMistake.mistake.id}:${boardKey}` : "game-analysis"; // Board'a bağlı olan ID.
  const playedMove = activeMistake ? (userMoveByPlyWithSan[activeMistake.mistake.ply]?.trim() ?? "") : ""; // Koç bu durumda ne oynadığını söyler. Played Nf3 gibi.
  const coachTitle = activeMistake ? getTurnLabel(activeMistake.moment.fen) : "Game review"; // Koç başlığı.
  const coachMessage = activeMistake // Koç mesajı.
    ? playedMove
      ? `You played ${playedMove} in the game. Find the best move to play here.`
      : "Solve the original game position on the board."
    : "Pick a review mistake to solve it on the board.";
  const progressValue = mistakes.length > 0 ? Math.round((completedMistakeIds.size / mistakes.length) * 100) : 0;
  const isActiveMistakeFavorited = activeMistake ? favoritedMistakeIds.has(activeMistake.mistake.id) : false; // Seçili hatanın favori mi değil mi bilgisini tutar. Button için

  // Timer için kullanılır.
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  // Geri butonu için kullanılır.
  function handleBack() {
    startTransition(() => {
      router.push("/game-analysis");
    });
  }

  // ================================================================================================
  // Stepper bu metodu tetikler, handler.
  // ================================================================================================
  function handleSelectMistake(mistake: GameAnalysisMistake) {
    selectMistakeToPlay(mistake.id);
  }

  // ================================================================================================
  // Seçili hatayı oynatmak için kullanılır. Aktif mistakeId yi değiştirir.
  // ================================================================================================
  function selectMistakeToPlay(mistakeId: string) {
    solvedRef.current = false;
    setSolved(false);
    setHintCount(0);
    setActiveMistakeId(mistakeId);
    setBoardKey((key) => key + 1);
  }

  // ================================================================================================
  // Favori butonu için kullanılır. Handler. Favorite button u kullanır.
  // ================================================================================================
  function handleMistakeFavoritedChange(mistakeId: string, favorited: boolean) {
    setFavoritedMistakeIds((current) => {
      const next = new Set(current);
      if (favorited) next.add(mistakeId);
      else next.delete(mistakeId);
      return next;
    });
  }

  // ================================================================================================
  // Board'a hamle yapıldığında kullanılır. Handler. Doğru mu yanlış mı hamle kontrolü.
  // ================================================================================================
  function handleCheckMove(move: MoveAttemptPayload) {
    if (!activeMistake || solvedRef.current) return false;

    if (move.uci === activeMistake.moment.bestUci) {
      correctMoveCountRef.current += 1;
      updateCorrectStreak(currentCorrectStreakRef, maxCorrectStreakRef);
      return true;
    }

    wrongMoveCountRef.current += 1;
    currentCorrectStreakRef.current = 0;
    return false;
  }

  // ================================================================================================
  // Başarılı hamlede tetiklenir.
  // ================================================================================================
  function handleSuccess() {
    if (!activeMistake || solvedRef.current) return;

    solvedRef.current = true;
    setSolved(true);

    const nextCompleted = new Set(completedMistakeIds);
    nextCompleted.add(activeMistake.mistake.id);
    setCompletedMistakeIds(nextCompleted);

    const activeIndex = mistakesByPly.indexOf(activeMistake);
    const later = mistakesByPly.slice(activeIndex + 1);
    const earlier = mistakesByPly.slice(0, activeIndex);
    const remaining = [...later, ...earlier].filter((item) => !nextCompleted.has(item.mistake.id));

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

    selectMistakeToPlay(remaining[0].mistake.id);
  }

  // ================================================================================================
  // Hint butonu için kullanılır. Handler.
  // ================================================================================================
  function handleHint() {
    if (!activeMistake || solved || hintCount >= MAX_HINT_COUNT) return;
    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
    totalHintCountRef.current += 1;
    boardRef.current?.showHint(nextHintCount);
  }

  return (
    <div className="page-container">
      {/* ====== Dialog ====== */}
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
            {/* ====== Board ====== */}
            {activeMistake ? (
              <VoltBoard
                ref={boardRef}
                key={boardKey}
                sourceId={playSessionId}
                initialFen={activeMistake.moment.fen}
                coordinates={!isMobile}
                playerOrientation={youAreBlack ? "black" : "white"}
                drawHintMove={activeMistake.moment.bestUci}
                playedMoveArrow={activeMistake.moment.playedUci}
                onCheckMove={handleCheckMove}
                onSuccessMovePlayed={handleSuccess}
                onNextMoveRequest={() => undefined}
              />
            ) : null}
          </div>

          {/* ====== Player Names ====== */}
          <BoardPlayerName
            name={topPlayer?.username ?? null}
            elo={getRatingLabel(topPlayer?.rating)}
            color={youAreBlack ? "white" : "black"}
            className="absolute top-[-30px] left-0"
          />
          <BoardPlayerName
            name={bottomPlayer?.username ?? null}
            elo={getRatingLabel(bottomPlayer?.rating)}
            color={youAreBlack ? "black" : "white"}
            className="absolute bottom-[-40px] left-0"
          />
        </div>

        <div className="bg-card relative flex min-w-0 flex-col gap-4 rounded-xl p-4 md:flex-[2]">
          <div className="flex justify-between">
            {/* ====== Back Button ====== */}
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
              {/* ====== Favorite Button ====== */}
              {activeMistake ? (
                <FavoriteButton
                  gameAnalysisMistakeId={activeMistake.mistake.id}
                  isFavorited={isActiveMistakeFavorited}
                  onFavoritedChange={(favorited) => handleMistakeFavoritedChange(activeMistake.mistake.id, favorited)}
                />
              ) : (
                <div className="size-9" />
              )}
            </div>
          </div>

          <div className="card-border-bottom-shadow p-4">
            <VoltCoach title={coachTitle} message={coachMessage} ttsKey={playSessionId} />
          </div>

          {/* ====== Progress Bar ====== */}
          {mistakes.length > 0 ? (
            <div className="flex items-center">
              <Progress
                value={progressValue}
                className="h-4 flex-1 rounded-r-none"
                aria-label="Solved mistakes progress"
              />
              <div className="ml-auto flex size-10 items-center justify-center rounded-2xl bg-red-400">
                <Lottie animationData={animationData} loop={true} autoplay={true} className="size-15" />
              </div>
            </div>
          ) : null}

          {/* ====== Stepper ====== */}
          <GameAnalysisMistakeStepper
            mistakes={mistakes}
            originalMoveByPly={userMoveByPlyWithSan}
            activeMistakeId={activeMistake?.mistake.id ?? null}
            completedMistakeIds={completedMistakeIds}
            isLoading={false}
            error={null}
            hasResult
            onSelectMistake={handleSelectMistake}
          />

          {/* ====== Hint Button ====== */}
          {activeMistake && !solved ? (
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
