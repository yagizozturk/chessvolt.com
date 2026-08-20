import type { SupabaseClient } from "@supabase/supabase-js";

import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PuzzleBoardCard } from "@/features/puzzle/components/puzzle-board-card";
import { getPuzzleRatingForScoring } from "@/features/puzzle/types/puzzle-rating";
import { buildStandalonePuzzleUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import { getUserFavoritesForUserWithDetails } from "@/features/user-favorites/services/user-favorite.service";
import type { UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import { createAttemptStatsBySequenceIdMap } from "@/features/user-sequence-attempt/utilities/create-attempt-stats-by-sequence-id-map";
import { getLatestAttemptStats } from "@/features/user-sequence-attempt/utilities/get-latest-attempt-stats";

export async function UserFavoritePuzzles({
  userId,
  supabase,
  showEmptyMessage = true,
}: {
  userId: string;
  supabase: SupabaseClient;
  showEmptyMessage?: boolean;
}) {
  const favorites = await getUserFavoritesForUserWithDetails(supabase, userId);
  const puzzleFavorites = favorites.filter(
    (favorite): favorite is UserFavoriteWithDetails & { puzzle: NonNullable<UserFavoriteWithDetails["puzzle"]> } =>
      favorite.puzzle != null,
  );

  const puzzleSequenceIds = [...new Set(puzzleFavorites.map((favorite) => favorite.puzzle.moveSequence.id))];

  const puzzleAttempts =
    puzzleSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, puzzleSequenceIds)
      : [];

  const voltScoresBySequenceId =
    puzzleSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          puzzleAttempts,
          puzzleFavorites.map((favorite) => ({
            sequenceId: favorite.puzzle.moveSequence.id,
            totalMoveCount: getPlayerMoveCount(favorite.puzzle.moveSequence.moves),
            rating: getPuzzleRatingForScoring(favorite.puzzle.rating),
          })),
        )
      : {};

  const attemptStatsBySequenceIdMap = createAttemptStatsBySequenceIdMap(getLatestAttemptStats(puzzleAttempts));

  if (puzzleFavorites.length === 0) {
    if (!showEmptyMessage) return null;
    return (
      <div>
        <h2 className="mb-3 text-lg font-bold">Puzzles</h2>
        <EmptyDataMessage message="You haven't added any puzzles to Volt Tracker yet." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-bold">Puzzles</h2>
      <div className="page-container-grid-data-layout">
        {puzzleFavorites.map((favorite) => {
          const { puzzle } = favorite;
          return (
            <PuzzleBoardCard
              key={favorite.id}
              puzzle={puzzle}
              game={null}
              href={buildStandalonePuzzleUrl(puzzle.id, { from: "favorites" })}
              displayFen={puzzle.moveSequence.displayFen}
              showVoltScore
              voltScore={voltScoresBySequenceId[puzzle.moveSequence.id] ?? null}
              isComplete={attemptStatusToIsComplete(attemptStatsBySequenceIdMap[puzzle.moveSequence.id]?.status)}
            />
          );
        })}
      </div>
    </div>
  );
}
