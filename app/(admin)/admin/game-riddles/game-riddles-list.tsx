"use client";

import Link from "next/link";
import type { GameRiddle } from "@/features/game-riddle/types/game-riddle";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteGameRiddleAction } from "./actions";

type Props = {
  riddles: GameRiddle[];
};

export function GameRiddlesList({ riddles }: Props) {
  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("This game riddle will be deleted. Are you sure?")) return;
    await deleteGameRiddleAction(id);
  }

  if (riddles.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No game riddles yet.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {riddles.map((r) => (
        <Link
          key={r.id}
          href={`/admin/game-riddles/${r.id}`}
          className="hover:bg-accent flex items-center justify-between rounded-lg border px-4 py-3 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">Ply {r.ply}</span>
            <span className="font-medium">{r.title}</span>
            {r.gameType && (
              <span className="bg-muted rounded px-2 py-0.5 text-xs">
                {r.gameType}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => handleDelete(e, r.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Link>
      ))}
    </div>
  );
}
