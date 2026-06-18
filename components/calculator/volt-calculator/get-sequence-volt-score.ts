import type { SupabaseClient } from "@supabase/supabase-js";

import { calculateVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

export type SequenceVoltScoring = {
  totalMoveCount: number;
  rating: number;
};

export type GetSequenceVoltScoreParams = {
  supabase: SupabaseClient;
  userId: string;
  sequenceId: string;
} & SequenceVoltScoring;

export async function getSequenceVoltScore({
  supabase,
  userId,
  sequenceId,
  totalMoveCount,
  rating,
}: GetSequenceVoltScoreParams): Promise<VoltScoreResult> {
  const attempts = await attemptService.getAttemptsByUserAndSequence(supabase, userId, sequenceId);

  return calculateVoltScore({
    attempts,
    totalMoveCount,
    rating,
  });
}
