"use client";

import { useParams, useSearchParams } from "next/navigation";

import GameAnalysisController from "@/features/game-analysis/components/game-analysis-controller";
import { usePlatformGames } from "@/features/game-analysis/hooks/use-platform-games";

export default function GameAnalysisGamePage() {
  const params = useParams<{ id: string }>();
  const initialMistakeId = useSearchParams().get("mistakeId");
  const { findGame, chessComUsername, lichessUsername } = usePlatformGames();
  const game = findGame(params.id);
  const username = game?.source === "lichess" ? lichessUsername : chessComUsername;

  return (
    <GameAnalysisController gameId={params.id} game={game} username={username} initialMistakeId={initialMistakeId} />
  );
}
