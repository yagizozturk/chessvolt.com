// TODO: Refactor
import * as openingVariantRepo from "@/features/openings/repository/opening-variant.repository";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import type { OpeningVariantForGoalsBackfill } from "@/features/openings/types/opening-variant-for-goals-backfill";
import { generateOpeningVariantGoals } from "@/lib/gemini/generate-opening-variant-goals";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export type BackfillOpeningGoalsResult = {
  processed: number;
  succeeded: number;
  failed: number;
  errors: { id: string; message: string }[];
  dryRun: boolean;
  previews?: {
    variantId: string;
    description: string;
    goals: MoveGoal[];
  }[];
};

export type BackfillOpeningGoalsOptions = {
  limit: number;
  dryRun?: boolean;
  variantId?: string;
};

async function backfillOneVariant(
  supabase: SupabaseClient,
  variant: OpeningVariantForGoalsBackfill,
  dryRun: boolean,
): Promise<
  | { ok: true; description: string; goals: MoveGoal[] }
  | { ok: false; message: string }
> {
  try {
    const { description, goals } = await generateOpeningVariantGoals({
      initialFen: variant.moveSequence.initialFen,
      pgn: variant.moveSequence.pgn,
      moves: variant.moveSequence.moves,
      initialPly: variant.initialPly,
    });

    if (dryRun) {
      return { ok: true, description, goals };
    }

    const updated = await openingVariantRepo.update(supabase, variant.variantId, {
      description,
      goals,
    });
    if (!updated) {
      return { ok: false, message: "Failed to update opening variant" };
    }

    return { ok: true, description, goals };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

export async function backfillOpeningVariantGoalsGemini(
  options: BackfillOpeningGoalsOptions,
): Promise<BackfillOpeningGoalsResult> {
  const supabase = createAdminClient();
  const dryRun = options.dryRun ?? false;
  const limit = Math.max(1, Math.min(options.limit, 50));

  let variants: OpeningVariantForGoalsBackfill[] = [];
  if (options.variantId) {
    const variant = await openingVariantRepo.findByIdWithNullGoals(supabase, options.variantId);
    if (variant) variants = [variant];
  } else {
    variants = await openingVariantRepo.findWithNullGoals(supabase, { limit });
  }

  const result: BackfillOpeningGoalsResult = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    errors: [],
    dryRun,
    previews: dryRun ? [] : undefined,
  };

  if (options.variantId && variants.length === 0) {
    result.errors.push({
      id: options.variantId,
      message: "Variant not found or goals already set",
    });
    return result;
  }

  for (const variant of variants) {
    result.processed++;
    const outcome = await backfillOneVariant(supabase, variant, dryRun);

    if (outcome.ok) {
      result.succeeded++;
      if (dryRun && result.previews) {
        result.previews.push({
          variantId: variant.variantId,
          description: outcome.description,
          goals: outcome.goals,
        });
      }
    } else {
      result.failed++;
      result.errors.push({ id: variant.variantId, message: outcome.message });
    }
  }

  return result;
}
