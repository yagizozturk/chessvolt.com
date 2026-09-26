"use client";

import { EmptyState } from "@/components/empty-state/empty-state";
import { ImportedGamesForm } from "@/features/analysis/components/imported-games-form";
import { ImportedGamesGrid } from "@/features/analysis/components/imported-games-grid";
import { useImportedGames } from "@/features/analysis/components/imported-games-provider";

export function ImportedGamesList() {
  const { games, chesscomError, lichessError, chesscomStatus, lichessStatus, isLoading } = useImportedGames();

  return (
    <div className="flex flex-col gap-6">
      <ImportedGamesForm />

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

      {isLoading && games.length === 0 ? <EmptyState message="Loading games…" /> : null}

      {!isLoading && chesscomStatus === "idle" && lichessStatus === "idle" ? (
        <EmptyState message="Enter a Chess.com or Lichess username and load games." />
      ) : null}

      {!isLoading && (chesscomStatus === "success" || lichessStatus === "success") && games.length === 0 ? (
        <EmptyState message="No public games found for those usernames." />
      ) : null}

      {games.length > 0 ? <ImportedGamesGrid /> : null}
    </div>
  );
}
