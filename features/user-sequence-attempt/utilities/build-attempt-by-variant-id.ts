import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type {
  SequenceAttemptBoardStats,
  SequenceAttemptSummary,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";
import { mapAttemptBoardStatsByEntityId } from "@/features/user-sequence-attempt/utilities/build-attempt-board-stats";

/** Maps each opening variant id to board card stats from latest attempt on its move sequence. */
export function buildAttemptByVariantId(
  variants: OpeningVariant[],
  summaries: SequenceAttemptSummary[],
): Record<string, SequenceAttemptBoardStats> {
  return mapAttemptBoardStatsByEntityId(variants, summaries);
}
