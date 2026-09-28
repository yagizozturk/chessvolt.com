"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { requestAnalyzeGame } from "@/features/test/api/analyze-game";
import { useChesscomGames } from "@/features/test/hooks/use-chesscom-games";

export default function TestGamePage() {
  const params = useParams<{ id: string }>();
  const { findGame } = useChesscomGames();
  const game = findGame(params.id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (!game) {
    return (
      <div className="page-container">
        <div className="page-container-children-layout">
          <p>This game is not in memory. Load games first.</p>
          <Link href="/test">Back</Link>
        </div>
      </div>
    );
  }

  async function analyze() {
    if (!game || isAnalyzing) return;

    setIsAnalyzing(true);
    setStatus(null);
    try {
      const response = await requestAnalyzeGame(game.pgn, game.uuid);
      setStatus(response.success ? `Saved ${response.data?.moveCount ?? 0} moves` : "Analyze failed");
    } catch (error) {
      const message =
        error && typeof error === "object" && "error" in error ? String(error.error) : "Analyze failed";
      setStatus(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <Link href="/test">Back</Link>
        <h1>
          {game.white.username} vs {game.black.username}
        </h1>
        <Button type="button" variant="volt" disabled={isAnalyzing} onClick={() => void analyze()}>
          {isAnalyzing ? <Spinner data-icon="inline-start" /> : null}
          {isAnalyzing ? "Analyzing…" : "Analyze"}
        </Button>
        {status ? <p>{status}</p> : null}
      </div>
    </div>
  );
}
