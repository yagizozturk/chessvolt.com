import type { SupabaseClient } from "@supabase/supabase-js";

import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { buildStandaloneRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import { getUserFavouritesForUserWithDetails } from "@/features/user-favourites/services/user-favourite.service";
import type { UserFavouriteWithDetails } from "@/features/user-favourites/types/user-favourite";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

export async function UserFavouriteRiddles({
  userId,
  supabase,
}: {
  userId: string;
  supabase: SupabaseClient;
}) {
  const favourites = await getUserFavouritesForUserWithDetails(supabase, userId);
  const riddleFavourites = favourites.filter(
    (favourite): favourite is UserFavouriteWithDetails & { riddle: NonNullable<UserFavouriteWithDetails["riddle"]> } =>
      favourite.riddle != null,
  );

  const riddleSequenceIds = [...new Set(riddleFavourites.map((favourite) => favourite.riddle.moveSequence.id))];

  const riddleAttempts =
    riddleSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, riddleSequenceIds)
      : [];

  const voltScoresBySequenceId =
    riddleSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          riddleAttempts,
          riddleFavourites.map((favourite) => ({
            sequenceId: favourite.riddle.moveSequence.id,
            totalMoveCount: getPlayerMoveCount(favourite.riddle.moveSequence.moves),
            rating: getRiddleRatingForScoring(favourite.riddle.rating),
          })),
        )
      : {};

  if (riddleFavourites.length === 0) {
    return <EmptyDataMessage message="You haven't favourited any riddles yet." />;
  }

  return (
    <div className="page-container-grid-data-layout">
      {riddleFavourites.map((favourite) => {
        const { riddle } = favourite;
        return (
          <RiddleBoardCard
            key={favourite.id}
            riddle={riddle}
            game={null}
            boardWrapperClassName="aspect-square w-[180px] shrink-0"
            href={buildStandaloneRiddlePath(riddle.id, { from: "favorites" })}
            displayFen={riddle.moveSequence.displayFen}
            showVoltScore
            voltScore={voltScoresBySequenceId[riddle.moveSequence.id] ?? null}
          />
        );
      })}
    </div>
  );
}
