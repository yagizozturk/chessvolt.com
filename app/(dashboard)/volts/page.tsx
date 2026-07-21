import type { SupabaseClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { buildStandaloneRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import { getUserFavouritesForUserWithDetails } from "@/features/user-favourites/services/user-favourite.service";
import type { UserFavouriteWithDetails } from "@/features/user-favourites/types/user-favourite";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { VoltsViewFilter } from "@/features/volts/components/volts-view-filter";
import { parseVoltsView } from "@/features/volts/types/volts-view";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Volts | ChessVolt",
  description: "Your Volt scores and progress.",
};

type SearchParams = Promise<{ view?: string }>;

export default async function VoltsPage({ searchParams }: { searchParams: SearchParams }) {
  const { user, supabase } = await getAuthenticatedUser();
  const params = await searchParams;
  const view = parseVoltsView(params.view);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Volts"
          description="Your Volt scores and progress."
          actions={<VoltsViewFilter view={view} />}
        />

        {view === "riddles" ? (
          <UserFavouriteRiddles userId={user.id} supabase={supabase} />
        ) : (
          <UserFavouriteOpeningVariants userId={user.id} supabase={supabase} />
        )}
      </div>
    </div>
  );
}

async function UserFavouriteOpeningVariants({ userId, supabase }: { userId: string; supabase: SupabaseClient }) {
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

async function UserFavouriteRiddles({ userId, supabase }: { userId: string; supabase: SupabaseClient }) {
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
            href={buildStandaloneRiddlePath(riddle.id)}
            displayFen={riddle.moveSequence.displayFen}
            showVoltScore
            voltScore={voltScoresBySequenceId[riddle.moveSequence.id] ?? null}
          />
        );
      })}
    </div>
  );
}
