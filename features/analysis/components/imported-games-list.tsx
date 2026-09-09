"use client";

import { type FormEvent } from "react";

import { EmptyState } from "@/components/empty-state/empty-state";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useImportedGames } from "@/features/analysis/components/imported-games-provider";
import { UserGameBoardCard } from "@/features/analysis/components/user-game-board-card";

export function ImportedGamesList() {
  const {
    chesscomUsername,
    lichessUsername,
    setChesscomUsername,
    setLichessUsername,
    chesscomGames,
    lichessGames,
    chesscomError,
    lichessError,
    chesscomStatus,
    lichessStatus,
    isLoading,
    load,
  } = useImportedGames();

  const games = [...chesscomGames, ...lichessGames];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field className="flex-1">
            <FieldLabel htmlFor="analysis-chesscom-username">Chess.com</FieldLabel>
            <Input
              id="analysis-chesscom-username"
              value={chesscomUsername}
              onChange={(event) => setChesscomUsername(event.target.value)}
              placeholder="username"
              autoComplete="off"
            />
          </Field>
          <Field className="flex-1">
            <FieldLabel htmlFor="analysis-lichess-username">Lichess</FieldLabel>
            <Input
              id="analysis-lichess-username"
              value={lichessUsername}
              onChange={(event) => setLichessUsername(event.target.value)}
              placeholder="username"
              autoComplete="off"
            />
          </Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner data-icon="inline-start" /> : null}
            {isLoading ? "Loading…" : "Load games"}
          </Button>
        </FieldGroup>
      </form>

      {chesscomError ? (
        <p className="text-destructive text-sm" role="alert">
          Chess.com: {chesscomError}
        </p>
      ) : null}
      {lichessError ? (
        <p className="text-destructive text-sm" role="alert">
          Lichess: {lichessError}
        </p>
      ) : null}

      {isLoading && games.length === 0 ? (
        <EmptyState message="Loading games…" />
      ) : null}

      {!isLoading && chesscomStatus === "idle" && lichessStatus === "idle" ? (
        <EmptyState message="Enter a Chess.com or Lichess username and load games." />
      ) : null}

      {!isLoading &&
      (chesscomStatus === "success" || lichessStatus === "success") &&
      games.length === 0 ? (
        <EmptyState message="No public games found for those usernames." />
      ) : null}

      {games.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {chesscomGames.map((game) => (
            <UserGameBoardCard key={`chesscom-${game.id}`} game={game} focusUsername={chesscomUsername} />
          ))}
          {lichessGames.map((game) => (
            <UserGameBoardCard key={`lichess-${game.id}`} game={game} focusUsername={lichessUsername} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
