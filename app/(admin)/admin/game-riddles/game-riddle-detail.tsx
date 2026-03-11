"use client";

import { useState } from "react";
import Link from "next/link";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import type { Game } from "@/lib/shared/types/game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { updateGameRiddleAction, deleteGameRiddleAction } from "./actions";

type Props = {
  riddle: GameRiddle;
  game: Game | null;
};

export function GameRiddleDetail({ riddle, game }: Props) {
  const [isEditing, setIsEditing] = useState(false);

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
              Ply: {riddle.ply} • Game: {game?.whitePlayer ?? "?"} vs{" "}
              {game?.blackPlayer ?? "?"}
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
                    defaultValue={riddle.ply}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input name="title" defaultValue={riddle.title} required />
                </Field>
                <Field>
                  <FieldLabel>Moves</FieldLabel>
                  <Input name="moves" defaultValue={riddle.moves ?? ""} />
                </Field>
                <Field>
                  <FieldLabel>Game Type</FieldLabel>
                  <Input
                    name="gameType"
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
                <dt className="text-muted-foreground font-medium">Ply</dt>
                <dd>{riddle.ply}</dd>
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
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
