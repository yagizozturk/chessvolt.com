"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useChesscomGames } from "@/features/test/hooks/use-chesscom-games";

export default function TestGamePage() {
  const params = useParams<{ id: string }>();
  const { findGame } = useChesscomGames();
  const game = findGame(params.id);

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

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <Link href="/test">Back</Link>
        <h1>
          {game.white.username} vs {game.black.username}
        </h1>
        <p>{game.time_class}</p>
        <p>{game.fen}</p>
        <pre className="whitespace-pre-wrap">{game.pgn}</pre>
      </div>
    </div>
  );
}
