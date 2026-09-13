import { Brain, Calendar, Puzzle, Target } from "lucide-react";
import Link from "next/link";

import DisplayBoard from "@/components/boards/display-board/display-board";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Button } from "@/components/ui/button";
import type { GameReviewQuestion } from "@/features/game-review-question/types/game-review-question";
import { getUserFavoritesForUserWithDetails } from "@/features/user-favorites/services/user-favorite.service";
import type { UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";
import { formatMoveCountLabel } from "@/lib/chess/getFullMoveCountFromMoves";
import type { SupabaseClient } from "@supabase/supabase-js";

function buildGameReviewUrl(question: GameReviewQuestion) {
  const params = new URLSearchParams({ source: question.source });
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
  if (source === "chesscom") return "Chess.com";
  if (source === "lichess") return "Lichess";
  return source;
}

function MetaItem({ icon: Icon, label }: { icon: typeof Target; label: string }) {
  if (!label.trim()) return null;

  return (
    <span className="flex items-center gap-1.5">
      <Icon className="text-primary h-4 w-4 shrink-0" />
      <span>{label}</span>
    </span>
  );
}

export async function UserFavoriteGameReviewQuestions({
  userId,
  supabase,
  showEmptyMessage = true,
}: {
  userId: string;
  supabase: SupabaseClient;
  showEmptyMessage?: boolean;
}) {
  const favorites = await getUserFavoritesForUserWithDetails(supabase, userId);
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
        <EmptyDataMessage message="You haven't added any game review questions to Volt Tracker yet." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-bold">Game reviews</h2>
      <div className="page-container-grid-data-layout">
        {gameReviewQuestionFavorites.map((favorite) => {
          const { gameReviewQuestion } = favorite;
          const href = buildGameReviewUrl(gameReviewQuestion);
          const moveCountLabel = formatMoveCountLabel(gameReviewQuestion.moveSequence.moves);

          return (
            <div
              key={favorite.id}
              className="bg-card border-b-card-shadow relative flex flex-row items-stretch gap-6 rounded-lg border-b-[6px] p-6"
            >
              <div className="aspect-square w-[240px] shrink-0 self-start">
                <DisplayBoard
                  sourceId={gameReviewQuestion.id}
                  initialFen={gameReviewQuestion.moveSequence.displayFen ?? gameReviewQuestion.moveSequence.initialFen}
                  coordinates={false}
                />
              </div>
              <div className="relative flex min-w-0 flex-1 flex-col gap-2">
                <Link href={href} className="text-xl font-bold hover:underline">
                  {gameReviewQuestion.title}
                </Link>
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <MetaItem icon={Target} label={qualityLabel(gameReviewQuestion.quality)} />
                  <MetaItem icon={Puzzle} label={moveCountLabel ?? "No moves"} />
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <MetaItem icon={Brain} label={sourceLabel(gameReviewQuestion.source)} />
                  <MetaItem icon={Calendar} label={formatDate(gameReviewQuestion.createdAt)} />
                </div>
                <div className="mt-auto flex justify-end">
                  <Button variant="voltCompact" size="xs" className="w-fit shrink-0" asChild>
                    <Link href={href}>Review</Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
