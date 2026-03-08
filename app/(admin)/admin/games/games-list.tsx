"use client";

import Link from "next/link";
import type { Game } from "@/lib/model/game";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteGameAction } from "./actions";

type Props = {
  games: Game[];
};

export function GamesList({ games }: Props) {
  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Bu oyun silinecek. Emin misiniz?")) return;
    await deleteGameAction(id);
  }

  if (games.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Henüz oyun yok.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {games.map((g) => (
        <Link
          key={g.id}
          href={`/admin/games/${g.id}`}
          className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <span className="font-medium">
              {g.whitePlayer} vs {g.blackPlayer}
            </span>
            <span className="rounded bg-muted px-2 py-0.5 text-xs">
              {g.result}
            </span>
            {g.event && (
              <span className="text-sm text-muted-foreground">{g.event}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => handleDelete(e, g.id)}
            title="Sil"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Link>
      ))}
    </div>
  );
}
