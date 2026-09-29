"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  requestGameAnalysis,
  requestLocalGameAnalysis,
  requestOutsourceGameAnalysis,
} from "@/features/test/api/analyze-game";
import { useChesscomGames } from "@/features/test/hooks/use-chesscom-games";
import type { GameAnalysisWithMistakes } from "@/features/test/types/game-analysis-with-mistakes";
import { analyzePgnWithStockfish } from "@/features/test/utilities/analyze-pgn-with-stockfish";

export default function TestGamePage() {
  const params = useParams<{ id: string }>();
  const { findGame } = useChesscomGames();
  const game = findGame(params.id);
  const [analysis, setAnalysis] = useState<GameAnalysisWithMistakes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisEngine, setAnalysisEngine] = useState<"remote" | "local" | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const localAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false; // Eğer sayfada sonuç gelmeden sayfadan çıkarsa oyuncu(unmount) bu durumda request devam etmez. setAnalysis kısmına boş yere girmez.

    async function getSavedGameAnalysis() {
      setIsLoading(true); // spinner için
      try {
        const response = await requestGameAnalysis(params.id); // api folder call for saved game analysis
        if (cancelled) return;
        if (response.success && response.data) {
          setAnalysis(response.data);
          setStatus(`Loaded ${response.data.questions.length} questions`);
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

  useEffect(() => {
    return () => {
      localAbortRef.current?.abort();
    };
  }, []);

  // ===================================================================================================
  // Analiz buttonuna basınca çalışır.
  // analyze metodu chess-api.com a gider ve analiz ettirir oyunu.
  // ===================================================================================================
  async function analyze() {
    if (!game || analysisEngine || analysis) return;

    setAnalysisEngine("remote");
    setStatus(null);
    try {
      const response = await requestOutsourceGameAnalysis(game.pgn, game.uuid);
      if (!response.success || !response.data) {
        setStatus("Analyze failed");
        return;
      }

      setAnalysis(response.data);
      setStatus(`Saved ${response.data.moveCount} moves and ${response.data.questions.length} questions`);
    } catch (error) {
      const message = error && typeof error === "object" && "error" in error ? String(error.error) : "Analyze failed";
      setStatus(message);
    } finally {
      setAnalysisEngine(null);
    }
  }

  async function analyzeLocally() {
    if (!game || analysisEngine) return;

    const controller = new AbortController();
    localAbortRef.current = controller;
    setAnalysisEngine("local");
    setStatus("Starting Stockfish…");

    try {
      const localAnalysis = await analyzePgnWithStockfish(game.pgn, {
        signal: controller.signal,
        onProgress: (completed, total) => {
          if (!controller.signal.aborted) setStatus(`Stockfish ${completed}/${total}`);
        },
      });

      if (controller.signal.aborted) return;

      setStatus("Saving questions…");
      const response = await requestLocalGameAnalysis(game.pgn, game.uuid, localAnalysis);
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
      const message = error && typeof error === "object" && "error" in error ? String(error.error) : "Local analysis failed";
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
          <Link href="/test">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <Link href="/test">Back</Link>
        <h1>{game ? `${game.white.username} vs ${game.black.username}` : "Saved review"}</h1>
        {game ? (
          <div className="flex flex-wrap gap-3">
            {analysis ? null : (
              <Button type="button" variant="volt" disabled={analysisEngine !== null} onClick={() => void analyze()}>
                {analysisEngine === "remote" ? <Spinner data-icon="inline-start" /> : null}
                {analysisEngine === "remote" ? "Analyzing…" : "Analyze"}
              </Button>
            )}
            <Button
              type="button"
              variant="voltMuted"
              disabled={analysisEngine !== null}
              onClick={() => void analyzeLocally()}
            >
              {analysisEngine === "local" ? <Spinner data-icon="inline-start" /> : null}
              {analysisEngine === "local" ? "Analyzing locally…" : "Analyze locally"}
            </Button>
          </div>
        ) : null}
        {status ? <p>{status}</p> : null}
        {analysis ? (
          <ul>
            {analysis.questions.map((question) => (
              <li key={question.id}>
                {question.title} · ply {question.ply} · {question.quality}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
