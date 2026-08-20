import type { SupabaseClient } from "@supabase/supabase-js";

import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { getUserFavoritesForUserWithDetails } from "@/features/user-favorites/services/user-favorite.service";
import type { UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

export async function UserFavoriteOpeningVariants({
  userId,
  supabase,
  showEmptyMessage = true,
}: {
  userId: string;
  supabase: SupabaseClient;
  showEmptyMessage?: boolean;
}) {
  const favorites = await getUserFavoritesForUserWithDetails(supabase, userId);
  const openingFavorites = favorites.filter(
    (
      favorite,
    ): favorite is UserFavoriteWithDetails & {
      openingVariant: NonNullable<UserFavoriteWithDetails["openingVariant"]>;
    } => favorite.openingVariant != null,
  );

  const openingVariantSequenceIds = [
    ...new Set(openingFavorites.map((favorite) => favorite.openingVariant.moveSequence.id)),
  ];

  const openingAttempts =
    openingVariantSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, openingVariantSequenceIds)
      : [];

  const voltScoresBySequenceId =
    openingVariantSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          openingAttempts,
          openingFavorites.map((favorite) => ({
            sequenceId: favorite.openingVariant.moveSequence.id,
            totalMoveCount: getPlayerMoveCount(favorite.openingVariant.moveSequence.moves),
            rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
          })),
        )
      : {};

  if (openingFavorites.length === 0) {
    if (!showEmptyMessage) return null;
    return (
      <div>
        <h2 className="mb-3 text-lg font-bold">Openings</h2>
        <EmptyDataMessage message="You haven't added any opening variants to Volt Tracker yet." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-bold">Openings</h2>
      <div className="page-container-grid-data-layout">
        {openingFavorites.map((favorite) => {
          const { openingVariant } = favorite;
          return (
            <OpeningBoardCard
              key={favorite.id}
              id={openingVariant.id}
              name={openingVariant.title ?? "Untitled variant"}
              href={`/openings/variant/${openingVariant.id}`}
              fen={openingVariant.moveSequence.displayFen ?? openingVariant.moveSequence.initialFen}
              description={openingVariant.description}
              moves={openingVariant.moveSequence.moves}
              voltScore={voltScoresBySequenceId[openingVariant.moveSequence.id] ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}
