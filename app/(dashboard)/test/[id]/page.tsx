"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { requestAnalyzeGame, requestSavedGameReview } from "@/features/test/api/analyze-game";
import { useChesscomGames } from "@/features/test/hooks/use-chesscom-games";
import type { GameReviewPayload } from "@/features/test/types/game-review-payload";

export default function TestGamePage() {
  const params = useParams<{ id: string }>();
  const { findGame } = useChesscomGames();
  const game = findGame(params.id);
  const [review, setReview] = useState<GameReviewPayload | null>(null);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSaved() {
      setIsLoadingSaved(true);
      try {
        const response = await requestSavedGameReview(params.id);
        if (cancelled) return;
        if (response.success && response.data) {
          setReview(response.data);
          setStatus(`Loaded ${response.data.questions.length} questions`);
        }
      } catch (error) {
        if (!cancelled) console.error(error);
      } finally {
        if (!cancelled) setIsLoadingSaved(false);
      }
    }

    void loadSaved();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function analyze() {
    if (!game || isAnalyzing || review) return;

    setIsAnalyzing(true);
    setStatus(null);
    try {
      const response = await requestAnalyzeGame(game.pgn, game.uuid);
      if (!response.success || !response.data) {
        setStatus("Analyze failed");
        return;
      }

      setReview(response.data);
      setStatus(`Saved ${response.data.moveCount} moves and ${response.data.questions.length} questions`);
    } catch (error) {
      const message =
        error && typeof error === "object" && "error" in error ? String(error.error) : "Analyze failed";
      setStatus(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (isLoadingSaved) {
    return (
      <div className="page-container">
        <div className="page-container-children-layout">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!game && !review) {
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
        <h1>
          {game ? `${game.white.username} vs ${game.black.username}` : "Saved review"}
        </h1>
        {review ? null : (
          <Button type="button" variant="volt" disabled={isAnalyzing} onClick={() => void analyze()}>
            {isAnalyzing ? <Spinner data-icon="inline-start" /> : null}
            {isAnalyzing ? "Analyzing…" : "Analyze"}
          </Button>
        )}
        {status ? <p>{status}</p> : null}
        {review ? (
          <ul>
            {review.questions.map((question) => (
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
