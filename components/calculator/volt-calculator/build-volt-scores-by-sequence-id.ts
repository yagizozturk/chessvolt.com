import { buildVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import type { UserSequenceAttempt } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

export type SequenceVoltContext = {
  sequenceId: string;
  totalMoveCount: number;
  rating: number;
};

export function buildVoltScoresBySequenceId(
  attempts: UserSequenceAttempt[],
  contexts: SequenceVoltContext[],
): Record<string, VoltScoreResult> {
  const attemptsBySequenceId = new Map<string, UserSequenceAttempt[]>();

  for (const attempt of attempts) {
    const list = attemptsBySequenceId.get(attempt.sequenceId) ?? [];
    list.push(attempt);
    attemptsBySequenceId.set(attempt.sequenceId, list);
  }

  return Object.fromEntries(
    contexts.map((context) => [
      context.sequenceId,
      buildVoltScore({
        attempts: attemptsBySequenceId.get(context.sequenceId) ?? [],
        totalMoveCount: context.totalMoveCount,
        rating: context.rating,
      }),
    ]),
  );
}
