import type { MoveSequenceCompleteDialogStats } from "@/features/user-sequence-attempt/types/sequence-complete-dialog-stats";
import { computeSequenceAttemptAccuracy } from "@/features/user-sequence-attempt/utilities/compute-sequence-attempt-accuracy";

export function createAttemptPayload(
  correctMoveCount: number,
  wrongMoveCount: number,
  hintCount: number,
  maxCorrectStreak: number,
  durationMs: number | null,
) {
  return {
    correctMoveCount,
    wrongMoveCount,
    hintCount,
    maxCorrectStreak,
    durationMs,
  };
}

export type AttemptPayload = ReturnType<typeof createAttemptPayload>;

export function createSequenceCompleteStats(payload: AttemptPayload): MoveSequenceCompleteDialogStats {
  return {
    accuracyPercent: computeSequenceAttemptAccuracy(payload),
    maxCorrectStreak: payload.maxCorrectStreak,
    durationMs: payload.durationMs,
  };
}
