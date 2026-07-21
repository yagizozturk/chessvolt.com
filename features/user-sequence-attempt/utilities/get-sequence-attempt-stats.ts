import type {
  SequenceAttemptData,
  SequenceAttemptStats,
} from "@/features/user-sequence-attempt/types/user-sequence-attempt";
import { computeSequenceAttemptAccuracy } from "@/features/user-sequence-attempt/utilities/compute-sequence-attempt-accuracy";

export function getSequenceAttemptStats(stats?: SequenceAttemptStats): SequenceAttemptData {
  return {
    accuracyPercent: stats ? computeSequenceAttemptAccuracy(stats) : null,
  };
}
