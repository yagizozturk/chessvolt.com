/**
 * Grand Volt Score
 *
 * Computes the user's total Volt across all riddles and opening variants they played
 * within the standard Volt lookback window (VOLT_CONFIG.lookbackMonths, default 3 months).
 *
 * Pipeline:
 * 1. Load all user_sequence_attempts since lookback start.
 * 2. Collect distinct sequence_id values from those attempts.
 * 3. Resolve each sequence to a riddle or opening variant (for move count + rating).
 * 4. Reuse getVoltScoresBySequenceId (same logic as collection / practice-list pages).
 * 5. Sum volt and maxVolt across all resolved sequences.
 *
 * Sequences with attempts but no matching riddle/variant row are skipped (orphaned data).
 */
import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import {
  getVoltScoresBySequenceId,
  type SequenceVoltContext,
} from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import {
  EMPTY_GRAND_VOLT_SCORE,
  type GrandVoltScoreResult,
} from "@/components/calculator/volt-calculator/grand-volt.types";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { getVoltLookbackStart, VOLT_CONFIG } from "@/components/calculator/volt-calculator/volt.config";
import * as openingVariantRepo from "@/features/openings/repository/opening-variant.repository";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Maps DB rows to SequenceVoltContext inputs required by calculateVoltScore.
 * Riddles take precedence when a sequence_id appears in both tables (should not happen in practice).
 */
function buildSequenceContexts(
  sequenceIds: string[],
  riddles: Awaited<ReturnType<typeof riddleRepo.findByMoveSequenceIds>>,
  openingVariants: Awaited<ReturnType<typeof openingVariantRepo.findByMoveSequenceIds>>,
): {
  contexts: SequenceVoltContext[];
  riddleSequenceIds: Set<string>;
  openingVariantSequenceIds: Set<string>;
} {
  const riddleSequenceIds = new Set<string>();
  const openingVariantSequenceIds = new Set<string>();
  const contexts: SequenceVoltContext[] = [];

  for (const riddle of riddles) {
    const sequenceId = riddle.moveSequence.id;
    if (!sequenceIds.includes(sequenceId)) continue;

    contexts.push({
      sequenceId,
      totalMoveCount: getPlayerMoveCount(riddle.moveSequence.moves),
      rating: getRiddleRatingForScoring(riddle.rating),
    });
    riddleSequenceIds.add(sequenceId);
  }

  for (const variant of openingVariants) {
    const sequenceId = variant.moveSequence.id;
    if (!sequenceIds.includes(sequenceId) || riddleSequenceIds.has(sequenceId)) continue;

    contexts.push({
      sequenceId,
      totalMoveCount: getPlayerMoveCount(variant.moveSequence.moves),
      rating: RATING_TIMING_CONFIG.defaultOpeningVariantRating,
    });
    openingVariantSequenceIds.add(sequenceId);
  }

  return { contexts, riddleSequenceIds, openingVariantSequenceIds };
}

export async function getGrandVoltScore(
  supabase: SupabaseClient,
  userId: string,
): Promise<GrandVoltScoreResult> {
  // ================================================================================================
  // Step 1: Load all attempts within the Volt lookback window (default: last 3 calendar months).
  // ================================================================================================
  const lookbackStart = getVoltLookbackStart();
  const attempts = await attemptService.getAttemptsByUserSince(
    supabase,
    userId,
    lookbackStart.toISOString(),
  );

  // ================================================================================================
  // Step 2: Derive unique sequence IDs — only sequences the user actually played count.
  // ================================================================================================
  const sequenceIds = [...new Set(attempts.map((attempt) => attempt.sequenceId))];
  if (sequenceIds.length === 0) {
    return {
      ...EMPTY_GRAND_VOLT_SCORE,
      lookbackMonths: VOLT_CONFIG.lookbackMonths,
    };
  }

  // ================================================================================================
  // Step 3: Resolve sequence metadata — riddles and opening variants in parallel.
  // Each sequence needs totalMoveCount (player moves) and rating for timing/Volt scoring.
  // ================================================================================================
  const [riddles, openingVariants] = await Promise.all([
    riddleRepo.findByMoveSequenceIds(supabase, sequenceIds),
    openingVariantRepo.findByMoveSequenceIds(supabase, sequenceIds),
  ]);

  const { contexts, riddleSequenceIds, openingVariantSequenceIds } = buildSequenceContexts(
    sequenceIds,
    riddles,
    openingVariants,
  );

  if (contexts.length === 0) {
    return {
      ...EMPTY_GRAND_VOLT_SCORE,
      lookbackMonths: VOLT_CONFIG.lookbackMonths,
    };
  }

  // ================================================================================================
  // Step 4: Compute per-sequence Volt using the same batch helper as collection / practice pages.
  // ================================================================================================
  const voltScoresBySequenceId = getVoltScoresBySequenceId(attempts, contexts);

  // ================================================================================================
  // Step 5: Sum totals and split by source (riddles vs opening variants) for Profile breakdown.
  // ================================================================================================
  let volt = 0;
  let maxVolt = 0;
  let riddleVolt = 0;
  let openingVariantVolt = 0;

  for (const context of contexts) {
    const score = voltScoresBySequenceId[context.sequenceId];
    volt += score.volt;
    maxVolt += score.maxVolt;

    if (riddleSequenceIds.has(context.sequenceId)) {
      riddleVolt += score.volt;
    } else if (openingVariantSequenceIds.has(context.sequenceId)) {
      openingVariantVolt += score.volt;
    }
  }

  return {
    volt,
    maxVolt,
    lookbackMonths: VOLT_CONFIG.lookbackMonths,
    sequenceCount: contexts.length,
    riddleVolt,
    openingVariantVolt,
    riddleCount: riddleSequenceIds.size,
    openingVariantCount: openingVariantSequenceIds.size,
  };
}
