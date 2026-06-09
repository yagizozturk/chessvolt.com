import type { SequenceAttemptStats } from "@/features/user-sequence-attempt/types/user-sequence-attempt";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import { computeSequenceAttemptAccuracy } from "@/features/user-sequence-attempt/utilities/compute-sequence-attempt-accuracy";

export type SequenceAttemptDisplay = {
  isComplete?: boolean;
  accuracyPercent: number | null;
};

export function toSequenceAttemptStats(stats?: SequenceAttemptStats): SequenceAttemptDisplay {
  return {
    isComplete: attemptStatusToIsComplete(stats?.status),
    accuracyPercent: stats ? computeSequenceAttemptAccuracy(stats) : null,
  };
}
