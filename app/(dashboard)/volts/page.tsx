import type { SupabaseClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { PageHeader } from "@/components/page-header";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import { getUserPracticeOpeningVariantsForUserWithSequences } from "@/features/user-practice-opening-variant/services/user-practice-opening-variant.service";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { VoltsViewFilter } from "@/features/volts/components/volts-view-filter";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Volts | ChessVolt",
  description: "Your Volt scores and progress.",
};

export default async function VoltsPage() {
  const { user, supabase } = await getAuthenticatedUser();

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader
          title="Volts"
          description="Your Volt scores and progress."
          actions={<VoltsViewFilter view="openings" />}
        />

        <OpeningsVoltsList userId={user.id} supabase={supabase} />
      </div>
    </div>
  );
}

async function OpeningsVoltsList({ userId, supabase }: { userId: string; supabase: SupabaseClient }) {
  const userPracticeOpeningVariants = await getUserPracticeOpeningVariantsForUserWithSequences(supabase, userId);

  const openingVariantSequenceIds = [
    ...new Set(userPracticeOpeningVariants.map((practice) => practice.openingVariant.moveSequence.id)),
  ];

  const openingAttempts =
    openingVariantSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, openingVariantSequenceIds)
      : [];

  const voltScoresBySequenceId =
    openingVariantSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          openingAttempts,
          userPracticeOpeningVariants.map((openingVariant) => ({
            sequenceId: openingVariant.openingVariant.moveSequence.id,
            totalMoveCount: getPlayerMoveCount(openingVariant.openingVariant.moveSequence.moves),
            rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
          })),
        )
      : {};

  if (userPracticeOpeningVariants.length === 0) {
    return <EmptyDataMessage message="You haven't added any opening variants to your practice list yet." />;
  }

  return (
    <div className="page-container-grid-data-layout">
      {userPracticeOpeningVariants.map((practice) => {
        const { openingVariant } = practice;
        return (
          <OpeningBoardCard
            key={practice.id}
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

