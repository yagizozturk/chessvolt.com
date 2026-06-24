"use server";

import {
  backfillMoveSequenceGoals,
  type BackfillGoalsResult,
} from "@/features/move-sequence/services/backfill-goals.service";
import { getAdminUser } from "@/lib/supabase/auth";

export type BackfillGoalsFormState = {
  error: string | null;
  result: BackfillGoalsResult | null;
};

export async function backfillMoveSequenceGoalsAction(
  _prevState: BackfillGoalsFormState,
  formData: FormData,
): Promise<BackfillGoalsFormState> {
  await getAdminUser();

  const limitRaw = Number(formData.get("limit"));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 1;
  const dryRun = formData.get("dryRun") === "on";
  const sequenceId = ((formData.get("sequenceId") as string) || "").trim() || undefined;

  try {
    const result = await backfillMoveSequenceGoals({ limit, dryRun, sequenceId });
    return { error: null, result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backfill failed";
    return { error: message, result: null };
  }
}
