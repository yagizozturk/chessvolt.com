"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import DisplayBoard from "@/components/boards/display-board/display-board";
import { Button } from "@/components/ui/button";
import { formatRiddleDifficultyLabel } from "@/features/riddle/types/riddle-difficulty";
import type { Riddle } from "@/features/riddle/types/riddle";

type Props = {
  riddle: Riddle;
  onDelete: (e: React.MouseEvent, id: string) => Promise<void>;
};

export function RiddleItem({ riddle, onDelete }: Props) {
  const createdAtLabel = new Date(riddle.createdAt).toLocaleString();

  return (
    <Link
      href={`/admin/riddles/edit?id=${riddle.id}`}
      className="bg-card border-b-card-shadow hover:bg-accent/60 flex flex-row items-stretch gap-6 rounded-lg border-b-[6px] p-6 transition-colors"
    >
      <div className="shrink-0">
        <DisplayBoard
          sourceId={riddle.id}
          initialFen={riddle.moveSequence.displayFen ?? undefined}
          size={200}
          coordinates={false}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="truncate text-xl font-bold">{riddle.title}</p>
        {riddle.description ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">{riddle.description}</p>
        ) : null}
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <time dateTime={riddle.createdAt} className="bg-muted rounded px-2 py-0.5">
            {createdAtLabel}
          </time>
          <span className="bg-muted rounded px-2 py-0.5">{formatRiddleDifficultyLabel(riddle.difficulty)}</span>
          {riddle.gameType && <span className="bg-muted rounded px-2 py-0.5">{riddle.gameType}</span>}
          {!riddle.isActive && <span className="bg-muted rounded px-2 py-0.5">inactive</span>}
          {riddle.themes.map((theme) => (
            <span key={theme} className="bg-muted rounded px-2 py-0.5">
              {theme}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/admin/riddles/edit?id=${riddle.id}`;
            }}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => onDelete(e, riddle.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
