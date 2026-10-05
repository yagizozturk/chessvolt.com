"use client";

import { ChessPawn, Clock, Swords } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import DisplayBoard from "@/components/boards/display-board/display-board";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { PlatformGame } from "@/features/game-analysis/types/platform-game";
import { formatPlayedAt } from "@/features/game-analysis/utilities/format-played-at";
import { getGameResult } from "@/features/game-analysis/utilities/get-game-result";
import {
  getImportedGameDisplayFen,
  getImportedGameMoveCountLabel,
} from "@/features/game-analysis/utilities/get-imported-game-display-info";
import { getPlayerUsernames } from "@/features/game-analysis/utilities/get-player-usernames";
import { cn } from "@/lib/utils";

type UserPlayedGamesBoardProps = {
  game: PlatformGame;
  searchedUsername: string;
  platformLabel?: string;
  boardWrapperClassName?: string;
};

export function UserPlayedGamesBoard({
  game,
  searchedUsername,
  platformLabel = "Chess.com",
  boardWrapperClassName = "aspect-square w-full md:w-[240px] shrink-0",
}: UserPlayedGamesBoardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const href = `/game-analysis/${game.uuid}`;
  const { opponent } = getPlayerUsernames(game, searchedUsername);
  const title = opponent ? `vs ${opponent.username}` : `${game.white.username} vs ${game.black.username}`;
  const fen = useMemo(() => getImportedGameDisplayFen(game.pgn), [game.pgn]); // PGN in son hamlesindeki FEN pozisyonunu döndürür. Bileşen (component) her yeniden render olduğunda hesabı tekrar yapma, sadece bağımlılıklar değiştiğinde yeniden hesapla
  const moveCountLabel = useMemo(() => getImportedGameMoveCountLabel(game.pgn), [game.pgn]); // PGN in hamle sayısını döndürür.
  const playedAt = formatPlayedAt(game.end_time);
  const result = getGameResult(game, searchedUsername); // Aranan oyuncu bilgisinin karşısındaki oyun sonucunu döndürür. Resigned örnek

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
        {/* ====== Oyun Tahtası ====== */}
        <div className={cn("self-start", boardWrapperClassName)}>
          <DisplayBoard
            sourceId={`user-game-${platformLabel === "Lichess" ? "lichess" : "chesscom"}-${game.uuid}`}
            initialFen={fen}
            coordinates={false}
            playerOrientation={searchedUsername === game.white.username.toLowerCase() ? "white" : "black"}
          />
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-xl font-bold">{title}</span>

          {/* ====== Oyuncu Bilgileri ====== */}
          <p className="text-muted-foreground hidden text-base md:block">
            {game.white.username}
            {game.white.rating != null ? ` (${game.white.rating})` : ""} vs {game.black.username}
            {game.black.rating != null ? ` (${game.black.rating})` : ""}
          </p>
          <div className="text-muted-foreground flex items-center text-sm">
            {/* ====== Oyun Tarihi ====== */}
            <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
              <ChessPawn className="text-emerald-500" />
              <span>
                {platformLabel} &#8226; {playedAt ? <span className="text-primary">{playedAt}</span> : null}
              </span>
            </Badge>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            {/* ====== Oyun Süresi ====== */}
            <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3 capitalize">
              <Clock className="text-blue-500" />
              <span>{game.time_class}</span>
            </Badge>

            {/* ====== Oyun Sonucu ====== */}
            {result ? (
              <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3 capitalize">
                <Swords className="text-red-500" />
                <span>{result}</span>
              </Badge>
            ) : null}

            {/* ====== Hamle Sayısı ====== */}
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
