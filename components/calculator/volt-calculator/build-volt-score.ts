import { type VoltAttemptRecord, computeVoltScore } from "@/components/calculator/volt-calculator/compute-volt";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import type { UserSequenceAttempt } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

/**
 * Only completed solves earn Volt. `started` rows have empty counters and a null duration,
 * which would otherwise score ~90 and win a "best solve" slot without the puzzle being solved.
 */
export function isVoltCountedAttempt(attempt: UserSequenceAttempt): boolean {
  return attempt.status === "completed";
}

export function toVoltAttemptRecord(attempt: UserSequenceAttempt): VoltAttemptRecord {
  return {
    id: attempt.id,
    startedAt: attempt.startedAt,
    durationMs: attempt.durationMs,
    correctMoveCount: attempt.correctMoveCount,
    wrongMoveCount: attempt.wrongMoveCount,
    hintCount: attempt.hintCount,
    maxCorrectStreak: attempt.maxCorrectStreak,
  };
}

export type CalculateVoltScoreParams = {
  attempts: UserSequenceAttempt[];
  totalMoveCount: number;
  rating: number;
  lookbackMonths?: number;
  scoredDayCount?: number;
};

export function calculateVoltScore({
  attempts,
  totalMoveCount,
  rating,
  lookbackMonths,
  scoredDayCount,
}: CalculateVoltScoreParams): VoltScoreResult {
  return computeVoltScore({
    attempts: attempts.filter(isVoltCountedAttempt).map(toVoltAttemptRecord),
    totalMoveCount,
    rating,
    lookbackMonths,
    scoredDayCount,
  });
}
