import {
  computeVoltScore,
  type VoltAttemptRecord,
} from "@/components/calculator/volt-calculator/compute-volt";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import type { UserSequenceAttempt } from "@/features/user-sequence-attempt/types/user-sequence-attempt";

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

export type BuildVoltScoreParams = {
  attempts: UserSequenceAttempt[];
  totalMoveCount: number;
  rating: number;
  lookbackMonths?: number;
  scoredDayCount?: number;
};

export function buildVoltScore({
  attempts,
  totalMoveCount,
  rating,
  lookbackMonths,
  scoredDayCount,
}: BuildVoltScoreParams): VoltScoreResult {
  return computeVoltScore({
    attempts: attempts.map(toVoltAttemptRecord),
    totalMoveCount,
    rating,
    lookbackMonths,
    scoredDayCount,
  });
}
