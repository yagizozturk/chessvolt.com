"use client";

import { useState } from "react";

import { PageHeader } from "@/components/page-header/page-header";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { requestChessComGames } from "@/features/game-analysis/api/chesscom-games";
import { UserPlayedGamesBoard } from "@/features/game-analysis/components/user-played-games-board";
import { useChessComGames } from "@/features/game-analysis/hooks/use-chesscom-games";

export default function GameAnalysisPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const { chessComGames, setChessComGames } = useChessComGames(); // Provider context ile bütün çocuklara, setGames ve içindeki findGame aktarılır.

  // ================================================================================================
  // Chess.com oyunlarını çeker.
  // requestChessComGames /http/game-analysis/chesscom-games üzerinden oyunları çeker.
  // ================================================================================================
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username || isLoading) return;

    setIsLoading(true);
    try {
      const page = await requestChessComGames(username);
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

  async function handleLoadMore() {
    if (!username || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const page = await requestChessComGames(username, chessComGames.length);
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

        {/* ====== Chess.com Form ====== */}
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <FieldGroup className="flex max-w-md flex-col gap-4 sm:flex-row sm:items-end">
            <Field className="min-w-0 flex-1">
              <FieldLabel htmlFor="test-chesscom-username">Chess.com</FieldLabel>
              <Input
                id="test-chesscom-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="username"
                autoComplete="off"
              />
            </Field>
            <Button type="submit" variant="volt" disabled={isLoading}>
              {isLoading ? <Spinner data-icon="inline-start" /> : null}
              {isLoading ? "Loading…" : "Load"}
            </Button>
          </FieldGroup>
        </form>
        {chessComGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {chessComGames.map((game) => (
              <UserPlayedGamesBoard key={game.uuid} game={game} searchedUsername={username.trim().toLowerCase()} />
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
