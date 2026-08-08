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
}: {
  userId: string;
  supabase: SupabaseClient;
}) {
  const favourites = await getUserFavoritesForUserWithDetails(supabase, userId);
  const puzzleFavourites = favourites.filter(
    (favourite): favourite is UserFavoriteWithDetails & { puzzle: NonNullable<UserFavoriteWithDetails["puzzle"]> } =>
      favourite.puzzle != null,
  );

  const puzzleSequenceIds = [...new Set(puzzleFavourites.map((favourite) => favourite.puzzle.moveSequence.id))];

  const puzzleAttempts =
    puzzleSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, puzzleSequenceIds)
      : [];

  const voltScoresBySequenceId =
    puzzleSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          puzzleAttempts,
          puzzleFavourites.map((favourite) => ({
            sequenceId: favourite.puzzle.moveSequence.id,
            totalMoveCount: getPlayerMoveCount(favourite.puzzle.moveSequence.moves),
            rating: getPuzzleRatingForScoring(favourite.puzzle.rating),
          })),
        )
      : {};

  const attemptStatsBySequenceIdMap = createAttemptStatsBySequenceIdMap(getLatestAttemptStats(puzzleAttempts));

  if (puzzleFavourites.length === 0) {
    return <EmptyDataMessage message="You haven't favourited any puzzles yet." />;
  }

  return (
    <div className="page-container-grid-data-layout">
      {puzzleFavourites.map((favourite) => {
        const { puzzle } = favourite;
        return (
          <PuzzleBoardCard
            key={favourite.id}
            puzzle={puzzle}
            game={null}
            boardWrapperClassName="aspect-square w-[180px] shrink-0"
            href={buildStandalonePuzzleUrl(puzzle.id, { from: "favorites" })}
            displayFen={puzzle.moveSequence.displayFen}
            showVoltScore
            voltScore={voltScoresBySequenceId[puzzle.moveSequence.id] ?? null}
            isComplete={attemptStatusToIsComplete(attemptStatsBySequenceIdMap[puzzle.moveSequence.id]?.status)}
          />
        );
      })}
    </div>
  );
}
