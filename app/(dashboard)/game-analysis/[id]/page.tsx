"use client";

import { useParams, useSearchParams } from "next/navigation";

import GameAnalysisController from "@/features/game-analysis/components/game-analysis-controller";
import { useChessComGames } from "@/features/game-analysis/hooks/use-chesscom-games";

export default function GameAnalysisGamePage() {
  const params = useParams<{ id: string }>();
  const initialMistakeId = useSearchParams().get("mistakeId");
  const { findGame, chessComUsername } = useChessComGames();
  const game = findGame(params.id);

  return (
    <GameAnalysisController
      gameId={params.id}
      game={game}
      username={chessComUsername}
      initialMistakeId={initialMistakeId}
    />
  );
}
