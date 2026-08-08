"use client";

import { useMemo, useState } from "react";

import { PlyPgnCreateForm } from "@/app/(admin)/admin/puzzles/components/ply-pgn-create-form";
import { Field, FieldLabel } from "@/components/ui/field";
import type { Study } from "@/features/study/types/study";
import type { Game } from "@/features/game/types/game";

type Props = {
  studies: Study[];
  games: Game[];
};

export function FromGameCreateForm({ studies, games }: Props) {
  const [gameId, setGameId] = useState(games[0]?.id ?? "");

  const selectedGame = useMemo(() => games.find((g) => g.id === gameId) ?? null, [games, gameId]);

  if (games.length === 0) {
    return <p className="text-muted-foreground text-sm">No games in the database. Add a game first.</p>;
  }

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel>Game</FieldLabel>
        <select
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="border-input focus-visible:border-primary focus-visible:ring-primary/50 w-full rounded-md border border-2 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
        >
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.whitePlayer} vs {game.blackPlayer} ({game.playedAt.slice(0, 10)})
            </option>
          ))}
        </select>
      </Field>

      {selectedGame ? (
        <PlyPgnCreateForm
          key={selectedGame.id}
          studies={studies}
          initialPgn={selectedGame.pgn}
          readOnlyPgn
          hiddenGameId={selectedGame.id}
          defaultTitle={`${selectedGame.whitePlayer} vs ${selectedGame.blackPlayer}`}
        />
      ) : null}
    </div>
  );
}
