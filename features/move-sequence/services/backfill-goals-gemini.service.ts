// TODO: Refactor
import * as moveSequenceRepo from "@/features/move-sequence/repository/move-sequence.repository";
import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import type { MoveSequenceForGoalsBackfill } from "@/features/move-sequence/types/move-sequence-for-goals-backfill";
import { generateMoveSequenceGoals } from "@/lib/gemini/generate-move-sequence-goals";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export type BackfillGoalsResult = {
  processed: number;
  succeeded: number;
  failed: number;
  errors: { id: string; message: string }[];
  dryRun: boolean;
  previews?: { id: string; goals: MoveGoals }[];
};

export type BackfillGoalsOptions = {
  limit: number;
  dryRun?: boolean;
  sequenceId?: string;
};

async function backfillOneSequence(
  supabase: SupabaseClient,
  sequence: MoveSequenceForGoalsBackfill,
  dryRun: boolean,
): Promise<{ ok: true; goals: MoveGoals } | { ok: false; message: string }> {
  try {
    const goals = await generateMoveSequenceGoals({
      initialFen: sequence.initialFen,
      pgn: sequence.pgn,
      moves: sequence.moves,
    });

    if (dryRun) {
      return { ok: true, goals };
    }

    const updated = await moveSequenceRepo.update(supabase, sequence.id, { goals });
    if (!updated) {
      return { ok: false, message: "Failed to update move sequence" };
    }

    return { ok: true, goals };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

export async function backfillMoveSequenceGoalsGemini(
  options: BackfillGoalsOptions,
): Promise<BackfillGoalsResult> {
  const supabase = createAdminClient();
  const dryRun = options.dryRun ?? false;
  const limit = Math.max(1, Math.min(options.limit, 50));

  let sequences: MoveSequenceForGoalsBackfill[] = [];
  if (options.sequenceId) {
    const sequence = await moveSequenceRepo.findByIdWithNullGoals(supabase, options.sequenceId);
    if (sequence) sequences = [sequence];
  } else {
    sequences = await moveSequenceRepo.findWithNullGoals(supabase, { limit });
  }

  const result: BackfillGoalsResult = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    errors: [],
    dryRun,
    previews: dryRun ? [] : undefined,
  };

  if (options.sequenceId && sequences.length === 0) {
    result.errors.push({
      id: options.sequenceId,
      message: "Sequence not found or goals already set",
    });
    return result;
  }

  for (const sequence of sequences) {
    if (!sequence) continue;

    result.processed++;
    const outcome = await backfillOneSequence(supabase, sequence, dryRun);

    if (outcome.ok) {
      result.succeeded++;
      if (dryRun && result.previews) {
        result.previews.push({ id: sequence.id, goals: outcome.goals });
      }
    } else {
      result.failed++;
      result.errors.push({ id: sequence.id, message: outcome.message });
    }
  }

  return result;
}
