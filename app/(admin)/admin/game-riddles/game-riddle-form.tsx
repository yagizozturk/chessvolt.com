"use client";

import { useState, useEffect } from "react";
import type { Game } from "@/lib/model/game";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createGameRiddleAction } from "./actions";
import { extractMovesFromPgn } from "@/lib/utils/pgn";
import { cn } from "@/lib/utils";

type Props = {
  games: Game[];
};

export function GameRiddleForm({ games }: Props) {
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const [gameId, setGameId] = useState("");
  const [ply, setPly] = useState("0");
  const [moveCountForAnswer, setMoveCountForAnswer] = useState("");
  const [moves, setMoves] = useState("");

  useEffect(() => {
    if (!gameId || !moveCountForAnswer) return;
    const game = gameMap[gameId];
    if (!game?.pgn) return;
    const plyNum = parseInt(ply, 10);
    const moveCount = parseInt(moveCountForAnswer, 10);
    if (isNaN(plyNum) || isNaN(moveCount) || moveCount <= 0) return;
    const uci = extractMovesFromPgn(game.pgn, plyNum, moveCount);
    if (uci) setMoves(uci);
  }, [gameId, ply, moveCountForAnswer, gameMap]);

  return (
    <form action={createGameRiddleAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Game</FieldLabel>
          <select
            name="gameId"
            required
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className={cn(
              "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            <option value="">Seçin...</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.whitePlayer} vs {g.blackPlayer} ({g.result})
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel>Ply</FieldLabel>
          <Input
            name="ply"
            type="number"
            required
            value={ply}
            onChange={(e) => setPly(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Move Count For Answer</FieldLabel>
          <Input
            type="number"
            min={1}
            placeholder="PGN'den UCI çıkarmak için (DB'ye yazılmaz)"
            value={moveCountForAnswer}
            onChange={(e) => setMoveCountForAnswer(e.target.value)}
            className={cn(
              "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" required placeholder="Örn: Find the best move" />
        </Field>
        <Field>
          <FieldLabel>Moves</FieldLabel>
          <Input
            name="moves"
            value={moves}
            onChange={(e) => setMoves(e.target.value)}
            placeholder="UCI format veya Move Count ile otomatik doldur"
          />
        </Field>
        <Field>
          <FieldLabel>Game Type</FieldLabel>
          <Input name="gameType" placeholder="örn: legend_games" />
        </Field>
      </FieldGroup>
      <Button type="submit">Oluştur</Button>
    </form>
  );
}
