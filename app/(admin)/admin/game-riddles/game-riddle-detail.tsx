"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getPlyFromPgnAndFen } from "@/lib/chess/getPlyFromPgnAndFen";
import { getUciMovesFromPgnAfterPlyAtMoveCount } from "@/lib/chess/getUciMovesFromPgnAfterPlyAtMoveCount";
import { cn } from "@/lib/utilities/cn";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteGameRiddleAction, updateGameRiddleAction } from "./actions";

type Props = {
  riddle: GameRiddle;
  game: Game | null;
};

function getMoveCountFromMoves(moves: string | null): string {
  if (!moves?.trim()) return "1";
  const count = moves.trim().split(/\s+/).filter(Boolean).length;
  return String(Math.max(1, count));
}

export function GameRiddleDetail({ riddle, game }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [ply, setPly] = useState(() => {
    if (game?.pgn && riddle.displayFen?.trim()) {
      const p = getPlyFromPgnAndFen(game.pgn, riddle.displayFen.trim());
      return p != null ? String(p) : "0";
    }
    return "0";
  });
  const [moveCountForAnswer, setMoveCountForAnswer] = useState(() =>
    getMoveCountFromMoves(riddle.moves),
  );
  const [moves, setMoves] = useState(riddle.moves ?? "");
  const [displayFen, setDisplayFen] = useState<string | null>(null);

  useEffect(() => {
    if (!game?.pgn) return;
    const plyNum = parseInt(ply, 10);
    const moveCount = parseInt(moveCountForAnswer, 10);
    if (isNaN(plyNum) || plyNum < 0) return;
    const fen = getFenFromPgnAtPly(game.pgn, plyNum);
    setDisplayFen(fen);
    if (!isNaN(moveCount) && moveCount > 0) {
      const uci = getUciMovesFromPgnAfterPlyAtMoveCount(
        game.pgn,
        plyNum,
        moveCount,
      );
      setMoves(uci ?? "");
    }
  }, [game?.pgn, ply, moveCountForAnswer]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/game-riddles" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{riddle.title}</CardTitle>
            <CardDescription>
              Game: {game?.whitePlayer ?? "?"} vs {game?.blackPlayer ?? "?"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={async () => {
                if (!confirm("This game riddle will be deleted. Are you sure?"))
                  return;
                await deleteGameRiddleAction(riddle.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form
              action={async (formData) => {
                await updateGameRiddleAction(riddle.id, formData);
              }}
              className="space-y-4"
            >
              <FieldGroup>
                <Field>
                  <FieldLabel>Game ID</FieldLabel>
                  <Input name="gameId" defaultValue={riddle.gameId} required />
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
                    name="moveCountForAnswer"
                    type="number"
                    min={1}
                    placeholder="PGN'den UCI çıkarmak için"
                    value={moveCountForAnswer}
                    onChange={(e) => setMoveCountForAnswer(e.target.value)}
                    className={cn(
                      "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                    )}
                  />
                </Field>
                {displayFen && (
                  <Field>
                    <FieldLabel>Pozisyon (PLY ile hesaplanan FEN)</FieldLabel>
                    <Input
                      readOnly
                      value={displayFen}
                      className="font-mono text-sm"
                    />
                  </Field>
                )}
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input name="title" defaultValue={riddle.title} required />
                </Field>
                <Field>
                  <FieldLabel>Moves</FieldLabel>
                  <Input
                    name="moves"
                    value={moves}
                    onChange={(e) => setMoves(e.target.value)}
                    placeholder="PLY + Move Count ile otomatik"
                    className={cn(
                      "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Game Type</FieldLabel>
                  <Input
                    name="gameType"
                    required
                    defaultValue={riddle.gameType ?? ""}
                    placeholder="e.g. legend_games"
                  />
                </Field>
              </FieldGroup>
              <Button type="submit">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </form>
          ) : (
            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground font-medium">ID</dt>
                <dd className="font-mono text-xs">{riddle.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Game ID</dt>
                <dd>{riddle.gameId}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Title</dt>
                <dd>{riddle.title}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Moves</dt>
                <dd className="font-mono text-xs break-all">
                  {riddle.moves ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Game Type</dt>
                <dd>{riddle.gameType ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">
                  Display FEN
                </dt>
                <dd className="font-mono text-xs break-all">
                  {riddle.displayFen ?? "—"}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
