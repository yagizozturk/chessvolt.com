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
import { usePlatformGames } from "@/features/game-analysis/hooks/use-platform-games";
import { mapLichessGame } from "@/features/game-analysis/utilities/map-lichess-game";

export default function GameAnalysisPage() {
  const [isLichessLoading, setIsLichessLoading] = useState(false);
  const [isChessComLoading, setIsChessComLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const {
    chessComGames,
    setChessComGames,
    chessComUsername,
    setChessComUsername,
    lichessGames,
    setLichessGames,
    lichessUsername,
    setLichessUsername,
  } = usePlatformGames();

  // ================================================================================================
  // Chess.com oyunlarını çeker.
  // requestChessComGames /http/game-analysis/chesscom-games üzerinden oyunları çeker.
  // ================================================================================================
  async function handleChessComSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chessComUsername || isChessComLoading) return;

    setIsChessComLoading(true);
    try {
      const page = await requestChessComGames(chessComUsername);
      setChessComGames(page.games);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error(error);
      setChessComGames([]);
      setHasMore(false);
    } finally {
      setIsChessComLoading(false);
    }
  }

  async function handleLichessSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lichessUsername.trim() || isLichessLoading) return;

    setIsLichessLoading(true);
    try {
      const page = await requestLichessGames(lichessUsername);
      setLichessGames(
        page.games.flatMap((game) => {
          const mapped = mapLichessGame(game);
          return mapped ? [mapped] : [];
        }),
      );
    } catch (error) {
      console.error(error);
      setLichessGames([]);
    } finally {
      setIsLichessLoading(false);
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
              isLoading={isChessComLoading}
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
              isLoading={isLichessLoading}
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
                key={`${game.source}-${game.uuid}`}
                game={game}
                searchedUsername={chessComUsername.trim().toLowerCase()}
              />
            ))}
          </div>
        ) : null}
        {lichessGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {lichessGames.map((game) => (
              <UserPlayedGamesBoard
                key={`${game.source}-${game.uuid}`}
                game={game}
                platformLabel="Lichess"
                searchedUsername={lichessUsername.trim().toLowerCase()}
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
