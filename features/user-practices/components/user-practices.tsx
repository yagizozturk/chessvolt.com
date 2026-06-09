import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import { buildVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import type { UserPracticeOpeningVariantWithDetails } from "@/features/user-practice-opening-variant/types/user-practice-opening-variant";
import { UserPracticesTabs } from "@/features/user-practices/components/user-practices-tabs";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import type { SupabaseClient } from "@supabase/supabase-js";

type UserPracticesProps = {
  userCollections: CollectionWithRiddleCountAndThemes[];
  userPracticeVariants: UserPracticeOpeningVariantWithDetails[];
  userId: string;
  supabase: SupabaseClient;
};

export async function UserPractices({
  userCollections,
  userPracticeVariants,
  userId,
  supabase,
}: UserPracticesProps) {
  const practiceSequenceIds = [
    ...new Set(userPracticeVariants.map((practice) => practice.openingVariant.moveSequence.id)),
  ];

  const voltBySequenceId =
    practiceSequenceIds.length > 0
      ? buildVoltScoresBySequenceId(
          await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, practiceSequenceIds),
          userPracticeVariants.map((practice) => ({
            sequenceId: practice.openingVariant.moveSequence.id,
            totalMoveCount: getSequenceMoveCount(practice.openingVariant.moveSequence.moves),
            rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
          })),
        )
      : {};

  return (
    <UserPracticesTabs
      userCollections={userCollections}
      userPracticeVariants={userPracticeVariants}
      voltBySequenceId={voltBySequenceId}
    />
  );
}
