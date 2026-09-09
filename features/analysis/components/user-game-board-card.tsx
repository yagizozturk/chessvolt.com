"use client";

import { Clock, Puzzle, Swords } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { BoardCardMetaRow } from "@/components/board-card-meta/board-card-meta-row";
import DisplayBoard from "@/components/boards/display-board/display-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ImportedGame } from "@/features/analysis/types/imported-game";
import { getImportedGameDisplayFen, getImportedGameMoveCountLabel } from "@/features/analysis/utilities/imported-game-board";
import { importedGameFocus, importedGameHref } from "@/features/analysis/utilities/imported-game-label";
import { cn } from "@/lib/utils";

type UserGameBoardCardProps = {
  game: ImportedGame;
  focusUsername: string;
  boardWrapperClassName?: string;
};

function formatPlayedAt(endTime: number): string {
  if (!endTime) return "";
  return new Date(endTime * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function resultForFocus(game: ImportedGame, focusUsername: string): string {
  const { youAreWhite, youAreBlack } = importedGameFocus(game, focusUsername);
  if (youAreWhite) return game.white.result;
  if (youAreBlack) return game.black.result;
  return game.white.result;
}

export function UserGameBoardCard({
  game,
  focusUsername,
  boardWrapperClassName = "aspect-square w-[240px] shrink-0",
}: UserGameBoardCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const href = importedGameHref(game.platform, game.id);
  const { opponent, youAreBlack } = importedGameFocus(game, focusUsername);
  const title = opponent ? `vs ${opponent.username}` : `${game.white.username} vs ${game.black.username}`;
  const fen = useMemo(() => getImportedGameDisplayFen(game.pgn), [game.pgn]);
  const moveCountLabel = useMemo(() => getImportedGameMoveCountLabel(game.pgn), [game.pgn]);
  const playedAt = formatPlayedAt(game.endTime);
  const result = resultForFocus(game, focusUsername);
  const platformLabel = game.platform === "chesscom" ? "Chess.com" : "Lichess";

  return (
    <div
      aria-busy={isLoading}
      className={cn(
        "bg-card border-b-card-shadow relative flex flex-col rounded-lg border-b-[6px]",
        isLoading && "pointer-events-none",
      )}
    >
      {isLoading ? (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
          <Spinner className="size-8" />
        </div>
      ) : null}

      <div className="relative flex flex-row items-stretch gap-6 p-6">
        <div className={cn("self-start", boardWrapperClassName)}>
          <DisplayBoard
            sourceId={`user-game-${game.platform}-${game.id}`}
            initialFen={fen}
            coordinates={false}
            playerOrientation={youAreBlack ? "black" : "white"}
          />
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col gap-2">
          <Link href={href} onClick={() => setIsLoading(true)} className="text-xl font-bold hover:underline">
            {title}
          </Link>
          <p className="text-muted-foreground hidden text-base md:block">
            {game.white.username}
            {game.white.rating != null ? ` (${game.white.rating})` : ""} vs {game.black.username}
            {game.black.rating != null ? ` (${game.black.rating})` : ""}
          </p>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <Badge variant="secondary" className="rounded-lg p-3">
              {platformLabel}
            </Badge>
            <BoardCardMetaRow icon={Clock} label={game.timeClass} className="capitalize" />
            {result ? <BoardCardMetaRow icon={Swords} label={result} className="capitalize" /> : null}
            {moveCountLabel ? <BoardCardMetaRow icon={Puzzle} label={moveCountLabel} /> : null}
          </div>
          {playedAt ? <p className="text-muted-foreground text-sm">{playedAt}</p> : null}
          <div className="mt-auto flex justify-end">
            <Button variant="voltCompact" size="xs" className="w-fit shrink-0" asChild>
              <Link href={href} onClick={() => setIsLoading(true)}>
                Review
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
