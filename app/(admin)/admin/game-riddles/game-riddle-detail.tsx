"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/features/game/types/game";
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
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { extractMovesFromPgn } from "@/lib/chess/extractMovesFromPgn";
import { getPlyFromPgnAtFen } from "@/lib/chess/getFenFromPgnAtPly";
import { updateGameRiddleAction, deleteGameRiddleAction } from "./actions";
import { cn } from "@/lib/utilities/cn";

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
  const [displayFen, setDisplayFen] = useState(riddle.displayFen ?? "");
  const [moveCountForAnswer, setMoveCountForAnswer] = useState(() =>
    getMoveCountFromMoves(riddle.moves),
  );
  const [moves, setMoves] = useState(riddle.moves ?? "");

  useEffect(() => {
    if (!game?.pgn || !moveCountForAnswer || !displayFen?.trim()) return;
    const ply = getPlyFromPgnAtFen(game.pgn, displayFen.trim());
    if (ply == null) return;
    const moveCount = parseInt(moveCountForAnswer, 10);
    if (isNaN(moveCount) || moveCount <= 0) return;
    const uci = extractMovesFromPgn(game.pgn, ply, moveCount);
    if (uci) setMoves(uci);
  }, [game?.pgn, displayFen, moveCountForAnswer]);

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
                  <FieldLabel>Display FEN</FieldLabel>
                  <Input
                    name="displayFen"
                    value={displayFen}
                    onChange={(e) => setDisplayFen(e.target.value)}
                    placeholder="Pozisyon FEN"
                    className="font-mono text-sm"
                  />
                </Field>
                <Field>
                  <FieldLabel>Move Count For Answer</FieldLabel>
                  <Input
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
                    placeholder="UCI format veya Move Count ile otomatik"
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
                <dt className="text-muted-foreground font-medium">Display FEN</dt>
                <dd className="font-mono break-all text-xs">
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
