import { buildVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { UserPractices } from "@/features/user-practices/components/user-practices-tabs";
import { getUserCustomCollectionsWithRiddleCountAndThemes } from "@/features/collection/services/collection.service";
import { getUserPracticeOpeningVariantsForUserWithDetails } from "@/features/user-practice-opening-variant/services/user-practice-opening-variant.service";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export default async function MyCollectionsPage() {
  const { user, supabase } = await getAuthenticatedUser();
  const [collections, practiceVariants] = await Promise.all([
    getUserCustomCollectionsWithRiddleCountAndThemes(supabase, user.id),
    getUserPracticeOpeningVariantsForUserWithDetails(supabase, user.id, { activeOnly: true }),
  ]);

  const practiceSequenceIds = [
    ...new Set(practiceVariants.map((practice) => practice.openingVariant.moveSequence.id)),
  ];

  const voltBySequenceId =
    practiceSequenceIds.length > 0
      ? buildVoltScoresBySequenceId(
          await attemptService.getAttemptsByUserAndSequenceIds(
            supabase,
            user.id,
            practiceSequenceIds,
          ),
          practiceVariants.map((practice) => ({
            sequenceId: practice.openingVariant.moveSequence.id,
            totalMoveCount: getSequenceMoveCount(practice.openingVariant.moveSequence.moves),
            rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
          })),
        )
      : {};

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <UserPractices
        collections={collections}
        practiceVariants={practiceVariants}
        voltBySequenceId={voltBySequenceId}
      />
    </div>
  );
}
