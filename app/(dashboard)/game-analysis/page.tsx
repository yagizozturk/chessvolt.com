"use client";

import { useState } from "react";

import { PageHeader } from "@/components/page-header/page-header";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { requestChessComGames } from "@/features/game-analysis/api/chesscom-games";
import { requestLichessGames } from "@/features/game-analysis/api/lichess-games";
import { ChessComUsernameForm } from "@/features/game-analysis/components/chess-com-username-form";
import { LichessUsernameForm } from "@/features/game-analysis/components/lichess-username-form";
import { UserPlayedGamesBoard } from "@/features/game-analysis/components/user-played-games-board";
import { useChessComGames } from "@/features/game-analysis/hooks/use-chesscom-games";
import type { LichessGame } from "@/lib/lichess/types";

export default function GameAnalysisPage() {
  const [lichessUsername, setLichessUsername] = useState("");
  const [lichessGames, setLichessGames] = useState<LichessGame[]>([]);
  const [lichessHasMore, setLichessHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const { chessComGames, setChessComGames, chessComUsername, setChessComUsername } = useChessComGames();

  // ================================================================================================
  // Chess.com oyunlarını çeker.
  // requestChessComGames /http/game-analysis/chesscom-games üzerinden oyunları çeker.
  // ================================================================================================
  async function handleChessComSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chessComUsername || isLoading) return;

    setIsLoading(true);
    try {
      const page = await requestChessComGames(chessComUsername);
      setChessComGames(page.games);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error(error);
      setChessComGames([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLichessSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lichessUsername.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const page = await requestLichessGames(lichessUsername);
      setLichessGames(page.games);
      setLichessHasMore(page.hasMore);
    } catch (error) {
      console.error(error);
      setLichessGames([]);
      setLichessHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoadMore() {
    if (!chessComUsername || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const page = await requestChessComGames(chessComUsername, chessComGames.length);
      const seen = new Set(chessComGames.map((game) => game.uuid));
      setChessComGames([...chessComGames, ...page.games.filter((game) => !seen.has(game.uuid))]);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* ====== Page Header ====== */}
        <PageHeader
          title="Analyze Your Chess.com and LichessGames"
          description="Analyze your chess.com and lichess.org games and find your mistakes."
        />

        {/* ====== Platform Form Cards ====== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card-border-bottom-shadow p-4">
            <ChessComUsernameForm
              image="/images/form/chess-com-logo.png"
              title="Chess.com"
              description="Load your recent Chess.com games."
              chessComUsername={chessComUsername}
              isLoading={isLoading}
              setChessComUsername={setChessComUsername}
              onSubmit={handleChessComSubmit}
            />
          </div>
          <div className="card-border-bottom-shadow p-4">
            <LichessUsernameForm
              image="/images/form/lichess-logo.png"
              title="Lichess"
              description="Load your recent Lichess games."
              lichessUsername={lichessUsername}
              isLoading={isLoading}
              setLichessUsername={setLichessUsername}
              onSubmit={handleLichessSubmit}
            />
          </div>
        </div>

        {/* ====== Chess.com Oyunları ====== */}
        {chessComGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {chessComGames.map((game) => (
              <UserPlayedGamesBoard
                key={game.uuid}
                game={game}
                searchedUsername={chessComUsername.trim().toLowerCase()}
              />
            ))}
          </div>
        ) : null}
        {hasMore ? (
          <div className="flex justify-center">
            <Button type="button" variant="volt" onClick={() => void handleLoadMore()} disabled={isLoadingMore}>
              {isLoadingMore ? <Spinner data-icon="inline-start" /> : null}
              {isLoadingMore ? "Loading…" : "Load more"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
