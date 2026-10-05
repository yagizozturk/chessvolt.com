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
import { requestGameAnalysis, requestGameAnalysisInsert } from "@/features/game-analysis/api/analyze-game";
import { BoardPlayerName } from "@/features/game-analysis/components/board-player-name";
import { GameAnalysisMistakeStepper } from "@/features/game-analysis/components/game-analysis-mistake-stepper";
import { GameAnalysisStatus } from "@/features/game-analysis/components/game-analysis-status";
import type { ChessComGame } from "@/features/game-analysis/types/chesscom-game";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";
import { analyzePgnWithStockfish } from "@/features/game-analysis/utilities/analyze-pgn-with-stockfish";
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
import { getPlayerColorFromPgn } from "@/lib/chess/getPlayerColorFromPgn";
import { getTurnLabel } from "@/lib/chess/getTurnLabel";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import animationData from "@/public/images/animations/animation-rocjet-launch.json";

type GameAnalysisControllerProps = {
  gameId: string;
  game?: ChessComGame;
  username?: string;
  initialMistakeId?: string | null;
};

export default function GameAnalysisController({
  gameId,
  game,
  username = "",
  initialMistakeId,
}: GameAnalysisControllerProps) {
  const router = useRouter();
  const boardRef = useRef<VoltBoardHandle>(null);
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const solvedRef = useRef(false);
  const [boardKey, setBoardKey] = useState(0);
  const [analysis, setAnalysis] = useState<GameAnalysisWithMistakes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisEngine, setAnalysisEngine] = useState<"local" | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<{ completed: number; total: number } | null>(null);
  const [status, setStatus] = useState<string | null>("Getting critical moments from server");
  const localAbortRef = useRef<AbortController | null>(null);

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

  // Hataları ply ye göre gruplar. Analiz yokken boş kalır.
  const mistakesByPly = useMemo(() => (analysis ? getMistakesByPly(analysis) : []), [analysis]);

  // Ply ye göre gruplanmış hataları döndürür. Sadece hatalar döner.
  const mistakes = useMemo(() => mistakesByPly.map((item) => item.mistake), [mistakesByPly]);

  // Ply ye göre hamleleri döndürür. San formatında. Koç bu durumda ne oynadığını söyler. Played Nf3 gibi.
  const userMoveByPlyWithSan = useMemo(() => {
    if (!analysis) return {};
    return Object.fromEntries(analysis.criticalMoments.map((moment) => [moment.ply, moment.playedSan]));
  }, [analysis]);

  // Aktif hangi pozisyonla başlanacağına karar verir. Analiz gelince applyAnalysis set eder.
  const [activeMistakeId, setActiveMistakeId] = useState<string | null>(null);

  // Hangi pozisyonlar çözüldü bilgisini tutar.
  const [completedMistakeIds, setCompletedMistakeIds] = useState<Set<string>>(() => new Set());

  // Hangi pozisyonlar hatalar favorilere eklendi bilgisini tutar.
  const [favoritedMistakeIds, setFavoritedMistakeIds] = useState<Set<string>>(() => new Set());

  // ==========================================================================================
  // Mevcutta analiz yapılmışsa Saved game analysisi çeker.
  // ==========================================================================================
  useEffect(() => {
    let cancelled = false; // Eğer sayfada sonuç gelmeden sayfadan çıkarsa oyuncu(unmount) bu durumda request devam etmez. setAnalysis kısmına boş yere girmez.

    async function getSavedGameAnalysis() {
      setIsLoading(true);
      setStatus("Getting critical moments from server");
      let redirecting = false;
      try {
        const response = await requestGameAnalysis(gameId); // api dosyasına gönderir isteği. Oradan http ye gidecek.
        if (cancelled) return;
        if (response.success && response.data) {
          applyAnalysis(response.data);
          return;
        }
        // Refresh drops the in-memory Chess.com game. With no saved row there is no PGN or FEN, so leave the dead page.
        if (!game) {
          redirecting = true;
          router.replace("/game-analysis");
        }
      } catch (error) {
        if (!cancelled) console.error(error);
      } finally {
        if (!cancelled && !redirecting) {
          setIsLoading(false);
          setStatus(null);
        }
      }
    }

    void getSavedGameAnalysis(); // React bu metodu useEffect içinde olduğundan kaydeder. React sayfadaki ID params ı değişmedikçe bu metodu loop gibi tekrar tekrar çağırmaz.
    return () => {
      cancelled = true; // Burası cleanup artık. Browser kapanırsa devam etmesin diye.
    };
  }, [game, gameId, router]);

  // ================================================================================================
  // Stockfish analizini iptal etmek için sayfadan çıkıldığında.
  // ================================================================================================
  useEffect(() => {
    return () => {
      localAbortRef.current?.abort();
    };
  }, []);

  // ================================================================================================
  // Stockfish analizini lokalde oyuncunun makinasında yapmak için.
  // ================================================================================================
  async function analyzeWithStockfish() {
    if (!game || analysisEngine) return;

    const controller = new AbortController(); // Stockfish analizini iptal etmek için. Eğer sayfadan erken çkılırsa
    localAbortRef.current = controller;
    setAnalysisEngine("local");
    setAnalysisProgress({ completed: 0, total: 0 });
    setStatus("Evaluating via Stockfish. Large games can take a while...");

    try {
      // analyzePgnWithStockfish: Stockfish analiz sonucu. Her iki oyuncu içinde criticalMoments datasını içerir.
      const localAnalysis = await analyzePgnWithStockfish(game.pgn, {
        signal: controller.signal, // controller setlenir
        onProgress: (completed, total) => {
          if (!controller.signal.aborted) setAnalysisProgress({ completed, total });
        },
      });

      if (controller.signal.aborted) return; // Eğer iptal edilirse return eder. Etmezse devam eder.

      setStatus("Saving analysis results…");

      const response = await requestGameAnalysisInsert(game.pgn, game.uuid, localAnalysis, username);
      if (!response.success || !response.data) {
        setStatus("Local analysis failed");
        return;
      }

      applyAnalysis(response.data);
      setStatus(null);
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof Error) {
        setStatus(error.message || "Local analysis failed");
        return;
      }
      const message =
        error && typeof error === "object" && "error" in error ? String(error.error) : "Local analysis failed";
      setStatus(message);
    } finally {
      if (localAbortRef.current === controller) localAbortRef.current = null;
      setAnalysisProgress(null);
      if (!controller.signal.aborted) setAnalysisEngine(null);
    }
  }

  // ================================================================================================
  // Analiz gelince aktif hatayı ve favorileri kurar. Review state ilk renderda oluşmaz.
  // ================================================================================================
  function applyAnalysis(next: GameAnalysisWithMistakes) {
    const nextMistakes = getMistakesByPly(next).map((item) => item.mistake);
    const nextMistakeId =
      initialMistakeId && nextMistakes.some((mistake) => mistake.id === initialMistakeId)
        ? initialMistakeId
        : (nextMistakes[0]?.id ?? null);

    setAnalysis(next);
    setFavoritedMistakeIds(new Set(next.favoritedMistakeIds));
    setCompletedMistakeIds(new Set());
    setActiveMistakeId(nextMistakeId);
    solvedRef.current = false;
    setSolved(false);
    setHintCount(0);
    setBoardKey((key) => key + 1);
  }

  // Seçili hatanın tam çifti: kayıtlı hata ve ona karşılık gelen kritik an.
  const activeMistake = mistakesByPly.find((item) => item.mistake.id === activeMistakeId) ?? null;
  const playerColor = game ? getPlayerColorFromPgn(game.pgn, username) : null;
  const youAreBlack = playerColor === "b" || (playerColor === null && mistakesByPly[0]?.moment.turn === "b");
  const bottomPlayer = youAreBlack ? game?.black : game?.white; // Alt oyuncu.
  const topPlayer = youAreBlack ? game?.white : game?.black; // Üst oyuncu.
  const playSessionId = activeMistake ? `${activeMistake.mistake.id}:${boardKey}` : "game-analysis"; // Board'a bağlı olan ID.
  const playedMove = activeMistake ? (userMoveByPlyWithSan[activeMistake.mistake.ply]?.trim() ?? "") : ""; // Koç bu durumda ne oynadığını söyler. Played Nf3 gibi.
  const coachTitle = activeMistake ? getTurnLabel(activeMistake.moment.fen) : "Game review"; // Koç başlığı.
  const coachMessage = activeMistake // Koç mesajı.
    ? playedMove
      ? `You played ${playedMove} in the game. Find the best move to play here.`
      : "Solve the original game position on the board."
    : "Analyze this game to find the moves you missed.";
  const boardFen = activeMistake?.moment.fen ?? game?.fen ?? null;
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
            {boardFen ? (
              <VoltBoard
                ref={boardRef}
                key={boardKey}
                sourceId={playSessionId}
                initialFen={boardFen}
                viewOnly={!activeMistake}
                coordinates={!isMobile}
                playerOrientation={youAreBlack ? "black" : "white"}
                drawHintMove={activeMistake?.moment.bestUci}
                playedMoveArrow={activeMistake?.moment.playedUci}
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

          {/* ====== Coach ====== */}
          <div className="card-border-bottom-shadow p-4">
            <VoltCoach title={coachTitle} message={coachMessage} ttsKey={playSessionId} />
          </div>

          {/* ====== Progress Bar ====== */}
          {analysisProgress ? (
            <Progress
              value={
                analysisProgress.total > 0 ? Math.round((analysisProgress.completed / analysisProgress.total) * 100) : 0
              }
              className="h-4 w-full"
              aria-label={`Stockfish analysis progress ${analysisProgress.completed} of ${analysisProgress.total}`}
            />
          ) : mistakes.length > 0 ? (
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

          {/* ====== Game Analysis Status ====== */}
          <GameAnalysisStatus message={status} />

          {/* ====== Stepper ====== */}
          {analysis || analysisEngine ? (
            <GameAnalysisMistakeStepper
              mistakes={mistakes}
              originalMoveByPly={userMoveByPlyWithSan}
              activeMistakeId={activeMistake?.mistake.id ?? null}
              completedMistakeIds={completedMistakeIds}
              isLoading={analysisEngine !== null}
              error={null}
              hasResult={analysis !== null}
              onSelectMistake={handleSelectMistake}
            />
          ) : null}

          {/* ====== Analyze Button ====== */}
          {!isLoading && !analysis ? (
            <div className="mt-auto flex flex-col gap-2">
              <Button
                type="button"
                variant="volt"
                disabled={analysisEngine !== null || !game}
                onClick={() => void analyzeWithStockfish()}
              >
                {analysisEngine === "local" ? <Spinner data-icon="inline-start" /> : null}
                {analysisEngine === "local" ? "Analyzing Game…" : "Analyze Game"}
              </Button>
            </div>
          ) : null}

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
