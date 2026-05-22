"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Riddle } from "@/features/riddle/types/riddle";
import type { Game } from "@/features/game/types/game";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deleteRiddleAction } from "./actions";
import { RiddleEditForm } from "./riddle-edit-form";

type Props = {
  riddle: Riddle;
  game: Game | null;
};

export function RiddleDetail({ riddle, game }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/riddles" className="flex items-center gap-2">
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
              {game
                ? `Game: ${game.whitePlayer} vs ${game.blackPlayer}`
                : "Standalone riddle (no linked game)"}
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
                if (!confirm("This riddle will be deleted. Are you sure?"))
                  return;
                await deleteRiddleAction(riddle.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <RiddleEditForm
              key={riddle.id}
              riddle={riddle}
              game={game}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground font-medium">ID</dt>
                <dd className="font-mono text-xs">{riddle.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Game ID</dt>
                <dd>{riddle.gameId ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Title</dt>
                <dd>{riddle.title}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Moves</dt>
                <dd className="font-mono text-xs break-all">
                  {riddle.moveSequence.moves ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Game Type</dt>
                <dd>{riddle.gameType ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Themes</dt>
                <dd>{riddle.themes.length > 0 ? riddle.themes.join(", ") : "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Active</dt>
                <dd>{riddle.isActive ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">
                  Display FEN
                </dt>
                <dd className="font-mono text-xs break-all">
                  {riddle.moveSequence.displayFen ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground font-medium">Goals</dt>
                <dd>
                  {riddle.moveSequence.goals != null ? (
                    <pre className="bg-muted/30 max-h-64 overflow-auto rounded-md border p-3 font-mono text-xs whitespace-pre-wrap">
                      {JSON.stringify(riddle.moveSequence.goals, null, 2)}
                    </pre>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
