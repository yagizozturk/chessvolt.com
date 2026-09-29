import { Calendar, CircleX, Globe } from "lucide-react";
import Link from "next/link";

import DisplayBoard from "@/components/boards/display-board/display-board";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import { GAME_ANALYSIS_MISTAKE_DESCRIPTION_TEMPLATES } from "@/features/game-analysis-mistakes/constants/game-analysis-mistake-description.constants";
import type { GameAnalysisMistake } from "@/features/game-analysis-mistakes/types/game-analysis-mistake";
import type { UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";

function getSourcePlatform(source: string): GameAnalysisSource | null {
  const normalizedSource = source.toLowerCase();
  if (normalizedSource.includes("lichess")) return "lichess";
  if (normalizedSource.includes("chess-com") || normalizedSource.includes("chesscom")) return "chesscom";
  return null;
}

function buildGameReviewUrl(question: GameAnalysisMistake) {
  const params = new URLSearchParams({
    source: getSourcePlatform(question.source) ?? question.source,
    questionId: question.id,
  });
  return `/game-analysis/${encodeURIComponent(question.gameId)}?${params.toString()}`;
}

function qualityLabel(quality: GameAnalysisMistake["quality"]) {
  return quality === "blunder" ? "Blunder" : "Mistake";
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function sourceLabel(source: string) {
  const platform = getSourcePlatform(source);
  if (platform === "lichess") return "lichess";
  if (platform === "chesscom") return "chess.com";
  return source;
}

function getGameAnalysisMistakeDescription(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return GAME_ANALYSIS_MISTAKE_DESCRIPTION_TEMPLATES[hash % GAME_ANALYSIS_MISTAKE_DESCRIPTION_TEMPLATES.length];
}

export async function UserFavoriteGameAnalysisMistakes({
  favorites,
  emptyMessage = "You haven't added any game review questions to Volt Tracker yet.",
  showEmptyMessage = true,
}: {
  favorites: UserFavoriteWithDetails[];
  emptyMessage?: string;
  showEmptyMessage?: boolean;
}) {
  const gameAnalysisMistakeFavorites = favorites.filter(
    (
      favorite,
    ): favorite is UserFavoriteWithDetails & {
      gameAnalysisMistake: NonNullable<UserFavoriteWithDetails["gameAnalysisMistake"]>;
    } => favorite.gameAnalysisMistake != null,
  );

  if (gameAnalysisMistakeFavorites.length === 0) {
    if (!showEmptyMessage) return null;
    return (
      <div>
        <h2 className="mb-3 text-lg font-bold">Game reviews</h2>
        <EmptyDataMessage message={emptyMessage} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-bold">Chess.com / Lichess Mistakes</h2>
      <div className="page-container-grid-data-layout">
        {gameAnalysisMistakeFavorites.map((favorite) => {
          const { gameAnalysisMistake } = favorite;
          const href = buildGameReviewUrl(gameAnalysisMistake);

          return (
            <Link
              key={favorite.id}
              href={href}
              className="bg-card border-b-card-shadow text-foreground relative flex flex-col rounded-lg border-b-[6px] no-underline"
            >
              <div className="relative flex flex-col items-stretch gap-6 p-6 md:flex-row">
                <div className="aspect-square w-full shrink-0 self-start md:w-[240px]">
                  <DisplayBoard
                    sourceId={gameAnalysisMistake.id}
                    initialFen={favorite.positionFen ?? undefined}
                    coordinates={false}
                  />
                </div>
                <div className="relative flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-xl font-bold">{gameAnalysisMistake.title}</span>
                  <p className="text-muted-foreground hidden text-base md:block">
                    {getGameAnalysisMistakeDescription(gameAnalysisMistake.id)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                      <CircleX className="text-red-500" />
                      <span>{qualityLabel(gameAnalysisMistake.quality)}</span>
                    </Badge>
                    <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                      <Calendar className="text-primary" />
                      <span>{formatDate(gameAnalysisMistake.createdAt)}</span>
                    </Badge>
                    <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                      <Globe className="text-emerald-500" />
                      <span>{sourceLabel(gameAnalysisMistake.source)}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
