import type { SequenceAttemptStats } from "@/features/user-sequence-attempt/types/user-sequence-attempt";
import { computeSequenceAttemptAccuracy } from "@/features/user-sequence-attempt/utilities/compute-sequence-attempt-accuracy";

export type SequenceAttemptDisplay = {
  accuracyPercent: number | null;
};

export function toSequenceAttemptStats(stats?: SequenceAttemptStats): SequenceAttemptDisplay {
  return {
    accuracyPercent: stats ? computeSequenceAttemptAccuracy(stats) : null,
  };
}
