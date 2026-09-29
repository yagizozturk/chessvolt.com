"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { requestChesscomGames } from "@/features/game-analysis/api/chesscom-games";
import { UserPlayedGamesBoard } from "@/features/game-analysis/components/user-played-games-board";
import { useChesscomGames } from "@/features/game-analysis/hooks/use-chesscom-games";
import { normalizeChesscomGame } from "@/features/game-analysis/utilities/normalize-chesscom-game";

export default function TestPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { games, setGames } = useChesscomGames();

  // ==========================================================================================
  // Load buttonuna basınca çalışır.
  // requestChesscomGames metodu chess.com api ye gider ve oyunları çeker.
  // ==========================================================================================
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    try {
      setGames(await requestChesscomGames(trimmed));
    } catch (error) {
      console.error(error);
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
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
        {games.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {games.map((game) => (
              <UserPlayedGamesBoard
                key={game.uuid}
                game={normalizeChesscomGame(game)}
                focusUsername={username.trim()}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
