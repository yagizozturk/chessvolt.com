"use client";

import { ChessKnight, ChessPawn, Clock, Swords } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import DisplayBoard from "@/components/boards/display-board/display-board";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { ImportedGame } from "@/features/analysis/types/imported-game";
import {
  getImportedGameDisplayFen,
  getImportedGameMoveCountLabel,
} from "@/features/analysis/utilities/imported-game-board";
import { importedGameFocus, importedGameHref } from "@/features/analysis/utilities/imported-game-label";
import { cn } from "@/lib/utils";

type UserGameBoardCardProps = {
  game: ImportedGame;
  focusUsername: string;
  boardWrapperClassName?: string;
};

function formatPlayedAt(endTime: number): string {
  if (!endTime) return "";
  const playedDate = new Date(endTime * 1000);
  const month = playedDate.toLocaleDateString(undefined, { month: "short" });

  return `${playedDate.getDate()} ${month}`;
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
  boardWrapperClassName = "aspect-square w-full md:w-[240px] shrink-0",
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
    <Link
      href={href}
      onClick={() => setIsLoading(true)}
      aria-busy={isLoading}
      className={cn(
        "bg-card border-b-card-shadow text-foreground relative flex flex-col rounded-lg border-b-[6px] no-underline",
        isLoading && "pointer-events-none",
      )}
    >
      {isLoading ? (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
          <Spinner className="size-8" />
        </div>
      ) : null}

      <div className="relative flex flex-col items-stretch gap-6 p-6 md:flex-row">
        <div className={cn("self-start", boardWrapperClassName)}>
          <DisplayBoard
            sourceId={`user-game-${game.platform}-${game.id}`}
            initialFen={fen}
            coordinates={false}
            playerOrientation={youAreBlack ? "black" : "white"}
          />
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-xl font-bold">{title}</span>
          <p className="text-muted-foreground hidden text-base md:block">
            {game.white.username}
            {game.white.rating != null ? ` (${game.white.rating})` : ""} vs {game.black.username}
            {game.black.rating != null ? ` (${game.black.rating})` : ""}
          </p>
          <div className="text-muted-foreground flex items-center text-sm">
            <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
              {game.platform === "chesscom" ? (
                <ChessPawn className="text-emerald-500" />
              ) : (
                <ChessKnight className="text-white" />
              )}
              <span>
                {platformLabel} &#8226; {playedAt ? <span className="text-primary">{playedAt}</span> : null}
              </span>
            </Badge>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3 capitalize">
              <Clock className="text-blue-500" />
              <span>{game.timeClass}</span>
            </Badge>
            {result ? (
              <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3 capitalize">
                <Swords className="text-red-500" />
                <span>{result}</span>
              </Badge>
            ) : null}
            {moveCountLabel ? (
              <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                <ChessPawn className="text-primary" />
                <span>{moveCountLabel}</span>
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
