"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { requestGameAnalysis, requestOutsourceGameAnalysis } from "@/features/test/api/analyze-game";
import { useChesscomGames } from "@/features/test/hooks/use-chesscom-games";
import type { GameAnalysisWithMistakes } from "@/features/test/types/game-analysis-with-mistakes";

export default function TestGamePage() {
  const params = useParams<{ id: string }>();
  const { findGame } = useChesscomGames();
  const game = findGame(params.id);
  const [analysis, setAnalysis] = useState<GameAnalysisWithMistakes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

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

  // ===================================================================================================
  // Analiz buttonuna basınca çalışır.
  // analyze metodu chess-api.com a gider ve analiz ettirir oyunu.
  // ===================================================================================================
  async function analyze() {
    if (!game || isAnalyzing || analysis) return;

    setIsAnalyzing(true);
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
      setIsAnalyzing(false);
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
        {analysis ? null : (
          <Button type="button" variant="volt" disabled={isAnalyzing} onClick={() => void analyze()}>
            {isAnalyzing ? <Spinner data-icon="inline-start" /> : null}
            {isAnalyzing ? "Analyzing…" : "Analyze"}
          </Button>
        )}
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
