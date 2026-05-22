import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import type { SequenceAttemptSummary } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

/** Maps each opening variant id to board card completion from latest attempt on its move sequence. */
export function buildAttemptByVariantId(
  variants: OpeningVariant[],
  summaries: SequenceAttemptSummary[],
): Record<string, boolean | undefined> {
  const statusBySequenceId = Object.fromEntries(summaries.map((s) => [s.sequenceId, s.status]));

  return Object.fromEntries(
    variants.map((variant) => [
      variant.id,
      attemptStatusToIsComplete(statusBySequenceId[variant.moveSequence.id]),
    ]),
  );
}
