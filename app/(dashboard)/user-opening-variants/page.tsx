import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { UserPracticeOpeningVariantList } from "@/features/user-practice-opening-variant/components/user-practice-opening-variant";
import { getUserPracticeOpeningVariantsForUserWithSequences } from "@/features/user-practice-opening-variant/services/user-practice-opening-variant.service";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function UserOpeningVariantsPage() {
  const { user, supabase } = await getAuthenticatedUser();

  // ================================================================================================
  // Getting user practice opening variants with sequences
  // ================================================================================================
  const userPracticeOpeningVariants = await getUserPracticeOpeningVariantsForUserWithSequences(supabase, user.id);

  // ================================================================================================
  // Getting practice sequence ids for user which are added to practice by User
  // ================================================================================================
  const openingVariantSequenceIds = [
    ...new Set(userPracticeOpeningVariants.map((practice) => practice.openingVariant.moveSequence.id)),
  ];

  // ================================================================================================
  // Getting attempt stats by user for a single opening variant for multiple SequenceIds
  // ================================================================================================
  const openingAttempts =
    openingVariantSequenceIds.length > 0
      ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, user.id, openingVariantSequenceIds)
      : [];

  // ================================================================================================
  // Building volt scores by sequence id for opening variants that are added to the list by User
  // ================================================================================================
  const voltScoresBySequenceId =
    openingVariantSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          openingAttempts,
          userPracticeOpeningVariants.map((openingVariant) => ({
            sequenceId: openingVariant.openingVariant.moveSequence.id,
            totalMoveCount: getSequenceMoveCount(openingVariant.openingVariant.moveSequence.moves),
            rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
          })),
        )
      : {};

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <UserPracticeOpeningVariantList
        openingVariants={userPracticeOpeningVariants}
        voltScoresBySequenceId={voltScoresBySequenceId}
      />
    </div>
  );
}
