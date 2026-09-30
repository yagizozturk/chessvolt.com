"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { requestGameAnalysis, requestGameAnalysisInsert } from "@/features/game-analysis/api/analyze-game";
import GameAnalysisController from "@/features/game-analysis/components/game-analysis-controller";
import { useChessComGames } from "@/features/game-analysis/hooks/use-chesscom-games";
import type { GameAnalysisWithMistakes } from "@/features/game-analysis/types/game-analysis-with-mistakes";
import { analyzePgnWithStockfish } from "@/features/game-analysis/utilities/analyze-pgn-with-stockfish";

export default function GameAnalysisGamePage() {
  const params = useParams<{ id: string }>();
  const initialMistakeId = useSearchParams().get("mistakeId");
  const { findGame } = useChessComGames();
  const game = findGame(params.id);
  const [analysis, setAnalysis] = useState<GameAnalysisWithMistakes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisEngine, setAnalysisEngine] = useState<"local" | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const localAbortRef = useRef<AbortController | null>(null);

  // ==========================================================================================
  // Mevcutta analiz yapılmışsa Saved game analysisi çeker.
  // ==========================================================================================
  useEffect(() => {
    let cancelled = false; // Eğer sayfada sonuç gelmeden sayfadan çıkarsa oyuncu(unmount) bu durumda request devam etmez. setAnalysis kısmına boş yere girmez.

    async function getSavedGameAnalysis() {
      setIsLoading(true); // spinner için
      try {
        const response = await requestGameAnalysis(params.id); // api dosyasına gönderir isteği. Oradan http ye gidecek.
        if (cancelled) return;
        if (response.success && response.data) {
          setAnalysis(response.data);
          setStatus(`Loaded ${response.data.questions.length} mistakes`);
        }
      } catch (error) {
        if (!cancelled) console.error(error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void getSavedGameAnalysis(); // React bu metodu useEffect içinde olduğundan kaydeder. React sayfadaki ID params ı değişmedikçe bu metodu loop gibi tekrar tekrar çağırmaz.
    return () => {
      cancelled = true; // Burası cleanup artık. Browser kapanırsa devam etmesin diye.
    };
  }, [params.id]);

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
    setStatus("Starting Stockfish…");

    try {
      const localAnalysis = await analyzePgnWithStockfish(game.pgn, {
        signal: controller.signal, // controller setlenir
        onProgress: (completed, total) => {
          if (!controller.signal.aborted) setStatus(`Stockfish ${completed}/${total}`);
        },
      });

      if (controller.signal.aborted) return; // Eğer iptal edilirse return eder. Etmezse devam eder.

      setStatus("Saving analysis results…");
      const response = await requestGameAnalysisInsert(game.pgn, game.uuid, localAnalysis);
      if (!response.success || !response.data) {
        setStatus("Local analysis failed");
        return;
      }

      setAnalysis(response.data);
      setStatus(`Saved ${response.data.moveCount} moves and ${response.data.questions.length} questions`);
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
      if (!controller.signal.aborted) setAnalysisEngine(null);
    }
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-container-children-layout">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!game && !analysis) {
    return (
      <div className="page-container">
        <div className="page-container-children-layout">
          <p>This game is not in memory. Load games first.</p>
          <Link href="/game-analysis">Back</Link>
        </div>
      </div>
    );
  }

  if (analysis) {
    return (
      <GameAnalysisController
        key={`${analysis.questions.map((question) => question.id).join("|")}:${initialMistakeId ?? ""}`}
        analysis={analysis}
        game={game}
        initialMistakeId={initialMistakeId}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <Link href="/game-analysis">Back</Link>
        <h1>{game ? `${game.white.username} vs ${game.black.username}` : "Saved review"}</h1>
        {game ? (
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="voltMuted"
              disabled={analysisEngine !== null}
              onClick={() => void analyzeWithStockfish()}
            >
              {analysisEngine === "local" ? <Spinner data-icon="inline-start" /> : null}
              {analysisEngine === "local" ? "Analyzing locally…" : "Analyze locally"}
            </Button>
          </div>
        ) : null}
        {status ? <p>{status}</p> : null}
      </div>
    </div>
  );
}
