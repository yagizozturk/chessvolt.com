"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Game } from "@/features/game/types/game";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

import { createRiddleAction } from "./actions";

type Props = {
  games: Game[];
};

export function RiddleForm({ games }: Props) {
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const [gameId, setGameId] = useState("");
  const [ply, setPly] = useState("0");
  const [moveCountForAnswer, setMoveCountForAnswer] = useState("");
  const [moves, setMoves] = useState("");
  const [displayFen, setDisplayFen] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId || !moveCountForAnswer) return;
    const game = gameMap[gameId];
    if (!game?.pgn) return;
    const plyNum = parseInt(ply, 10);
    const moveCount = parseInt(moveCountForAnswer, 10);
    if (isNaN(plyNum) || isNaN(moveCount) || moveCount <= 0) return;
    const uci = getUciMovesFromPgnAfterPlyAtMoveCount(
      game.pgn,
      plyNum,
      moveCount,
    );
    if (uci) setMoves(uci);
  }, [gameId, ply, moveCountForAnswer, gameMap]);

  useEffect(() => {
    if (!gameId) {
      setDisplayFen(null);
      return;
    }
    const game = gameMap[gameId];
    if (!game?.pgn) {
      setDisplayFen(null);
      return;
    }
    const plyNum = parseInt(ply, 10);
    if (isNaN(plyNum) || plyNum < 0) {
      setDisplayFen(null);
      return;
    }
    const fen = getFenFromPgnAtPly(game.pgn, plyNum);
    setDisplayFen(fen);
  }, [gameId, ply, gameMap]);

  return (
    <form action={createRiddleAction} className="space-y-4">
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
            <option value="">Select...</option>
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
        {displayFen && (
          <Field>
            <FieldLabel>Pozisyon (PGN + PLY ile hesaplanan FEN)</FieldLabel>
            <Input readOnly value={displayFen} className="font-mono text-sm" />
          </Field>
        )}
        <Field>
          <FieldLabel>Move Count For Answer</FieldLabel>
          <Input
            type="number"
            min={1}
            placeholder="To extract UCI from PGN (not saved to DB)"
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
          <Input name="title" required placeholder="e.g. Find the best move" />
        </Field>
        <Field>
          <FieldLabel>Moves</FieldLabel>
          <Input
            name="moves"
            value={moves}
            onChange={(e) => setMoves(e.target.value)}
            placeholder="UCI format or auto-fill with Move Count"
          />
        </Field>
        <Field>
          <FieldLabel>Game Type</FieldLabel>
          <Input name="gameType" required placeholder="e.g. legend_games" />
        </Field>
        <Field>
          <FieldLabel>Themes</FieldLabel>
          <Input name="themes" placeholder="Comma-separated, e.g. tactics, endgame" />
        </Field>
        <Field className="flex flex-row items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked className="size-4 rounded border" />
          <FieldLabel className="mb-0">Active (visible on challenge pages)</FieldLabel>
        </Field>
        <Field>
          <FieldLabel>Goals (JSON)</FieldLabel>
          <textarea
            name="goals"
            rows={6}
            placeholder='[{"ply":1,"move":"e2e4","title":"...","description":"...","isCompleted":false}]'
            className={cn(
              "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            )}
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Create</Button>
    </form>
  );
}
