import type { SupabaseClient } from "@supabase/supabase-js";

import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { getUserFavouritesForUserWithDetails } from "@/features/user-favourites/services/user-favourite.service";
import type { UserFavouriteWithDetails } from "@/features/user-favourites/types/user-favourite";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

export async function UserFavouriteOpeningVariants({
  userId,
  supabase,
}: {
  userId: string;
  supabase: SupabaseClient;
}) {
  const favourites = await getUserFavouritesForUserWithDetails(supabase, userId);
  const openingFavourites = favourites.filter(
    (favourite): favourite is UserFavouriteWithDetails & { openingVariant: NonNullable<UserFavouriteWithDetails["openingVariant"]> } =>
      favourite.openingVariant != null,
  );

  const openingVariantSequenceIds = [
    ...new Set(openingFavourites.map((favourite) => favourite.openingVariant.moveSequence.id)),
  ];

  const openingAttempts =
    openingVariantSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, openingVariantSequenceIds)
      : [];

  const voltScoresBySequenceId =
    openingVariantSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          openingAttempts,
          openingFavourites.map((favourite) => ({
            sequenceId: favourite.openingVariant.moveSequence.id,
            totalMoveCount: getPlayerMoveCount(favourite.openingVariant.moveSequence.moves),
            rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
          })),
        )
      : {};

  if (openingFavourites.length === 0) {
    return <EmptyDataMessage message="You haven't favourited any opening variants yet." />;
  }

  return (
    <div className="page-container-grid-data-layout">
      {openingFavourites.map((favourite) => {
        const { openingVariant } = favourite;
        return (
          <OpeningBoardCard
            key={favourite.id}
            id={openingVariant.id}
            name={openingVariant.title ?? "Untitled variant"}
            boardWrapperClassName="aspect-square w-[180px] shrink-0"
            href={`/openings/variant/${openingVariant.id}`}
            fen={openingVariant.moveSequence.displayFen ?? openingVariant.moveSequence.initialFen}
            description={openingVariant.description}
            moves={openingVariant.moveSequence.moves}
            voltScore={voltScoresBySequenceId[openingVariant.moveSequence.id] ?? null}
          />
        );
      })}
    </div>
  );
}
