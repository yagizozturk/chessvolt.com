import { Calendar, CircleX, Globe } from "lucide-react";
import Link from "next/link";

import DisplayBoard from "@/components/boards/display-board/display-board";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";
import { GAME_REVIEW_QUESTION_DESCRIPTION_TEMPLATES } from "@/features/game-review-question/constants/game-review-question-description.constants";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import type { UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";

function getSourcePlatform(source: string): GameAnalysisSource | null {
  const normalizedSource = source.toLowerCase();
  if (normalizedSource.includes("lichess")) return "lichess";
  if (normalizedSource.includes("chess-com") || normalizedSource.includes("chesscom")) return "chesscom";
  return null;
}

function buildGameReviewUrl(question: GameReviewQuestion) {
  const params = new URLSearchParams({ source: getSourcePlatform(question.source) ?? question.source });
  return `/game-review/${encodeURIComponent(question.gameId)}?${params.toString()}`;
}

function qualityLabel(quality: GameReviewQuestion["quality"]) {
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

function getGameReviewQuestionDescription(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return GAME_REVIEW_QUESTION_DESCRIPTION_TEMPLATES[hash % GAME_REVIEW_QUESTION_DESCRIPTION_TEMPLATES.length];
}

export async function UserFavoriteGameReviewQuestions({
  favorites,
  emptyMessage = "You haven't added any game review questions to Volt Tracker yet.",
  showEmptyMessage = true,
}: {
  favorites: UserFavoriteWithDetails[];
  emptyMessage?: string;
  showEmptyMessage?: boolean;
}) {
  const gameReviewQuestionFavorites = favorites.filter(
    (
      favorite,
    ): favorite is UserFavoriteWithDetails & {
      gameReviewQuestion: NonNullable<UserFavoriteWithDetails["gameReviewQuestion"]>;
    } => favorite.gameReviewQuestion != null,
  );

  if (gameReviewQuestionFavorites.length === 0) {
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
        {gameReviewQuestionFavorites.map((favorite) => {
          const { gameReviewQuestion } = favorite;
          const href = buildGameReviewUrl(gameReviewQuestion);

          return (
            <Link
              key={favorite.id}
              href={href}
              className="bg-card border-b-card-shadow text-foreground relative flex flex-row items-stretch gap-6 rounded-lg border-b-[6px] p-6 no-underline"
            >
              <div className="aspect-square w-[240px] shrink-0 self-start">
                <DisplayBoard
                  sourceId={gameReviewQuestion.id}
                  initialFen={gameReviewQuestion.moveSequence.displayFen ?? gameReviewQuestion.moveSequence.initialFen}
                  coordinates={false}
                />
              </div>
              <div className="relative flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-xl font-bold">{gameReviewQuestion.title}</span>
                <p className="text-muted-foreground hidden text-base md:block">
                  {getGameReviewQuestionDescription(gameReviewQuestion.id)}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                    <CircleX className="text-red-500" />
                    <span>{qualityLabel(gameReviewQuestion.quality)}</span>
                  </Badge>
                  <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                    <Calendar className="text-primary" />
                    <span>{formatDate(gameReviewQuestion.createdAt)}</span>
                  </Badge>
                  <Badge variant="secondary" className="w-fit rounded-xl px-2 py-3">
                    <Globe className="text-emerald-500" />
                    <span>{sourceLabel(gameReviewQuestion.source)}</span>
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
