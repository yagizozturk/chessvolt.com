/**
 * Volt Tracker Service
 *
 * Volt Tracker sayfasının gösterdiği veriyi tek yanıtta toplar: favoriler + her favori için
 * volt skoru ve son attempt. Puzzle ve opening variant hesabı web bileşenleriyle aynıdır
 * (user-favorite-puzzles.tsx, user-favorite-opening-variants.tsx).
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { RATING_TIMING_CONFIG } from "@/components/calculator/rating-timing-calculator/rating-timing.config";
import {
  type SequenceVoltContext,
  getVoltScoresBySequenceId,
} from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import * as moveSequenceService from "@/features/move-sequence/services/move-sequence.service";
import type { MoveSequence } from "@/features/move-sequence/types/move-sequence";
import { DEFAULT_PUZZLE_RATING } from "@/features/puzzle/constants/puzzle-rating.constants";
import { getPuzzleRatingForScoring } from "@/features/puzzle/types/puzzle-rating";
import { getUserFavoritesForUserWithDetails } from "@/features/user-favorites/services/user-favorite.service";
import type { UserFavoriteWithDetails } from "@/features/user-favorites/types/user-favorite";
import type { VoltTrackerFavorite, VoltTrackerFavoriteType } from "@/features/user-favorites/types/volt-tracker";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { createAttemptStatsBySequenceIdMap } from "@/features/user-sequence-attempt/utilities/create-attempt-stats-by-sequence-id-map";
import { getLatestAttemptStats } from "@/features/user-sequence-attempt/utilities/get-latest-attempt-stats";

type TypedFavorite = {
  favorite: UserFavoriteWithDetails;
  type: VoltTrackerFavoriteType;
  moveSequence: MoveSequence | null;
};

function getFavoriteType(favorite: UserFavoriteWithDetails): VoltTrackerFavoriteType | null {
  if (favorite.gameAnalysisMistake) return "mistake";
  if (favorite.puzzle) return "puzzle";
  if (favorite.openingVariant) return "opening";
  return null;
}

function getFavoriteMoveSequence(
  favorite: UserFavoriteWithDetails,
  mistakeSequenceById: Map<string, MoveSequence>,
): MoveSequence | null {
  if (favorite.gameAnalysisMistake) {
    const sequenceId = favorite.gameAnalysisMistake.moveSequenceId;
    return sequenceId ? (mistakeSequenceById.get(sequenceId) ?? null) : null;
  }
  return favorite.puzzle?.moveSequence ?? favorite.openingVariant?.moveSequence ?? null;
}

// ================================================================================================
// Skor bağlamı. Hata sekanslarının kendi rating'i yok; puzzle varsayılanı kullanılır.
// ================================================================================================
function getVoltContext({ favorite, type, moveSequence }: TypedFavorite): SequenceVoltContext | null {
  if (!moveSequence) return null;

  const rating =
    type === "puzzle"
      ? getPuzzleRatingForScoring(favorite.puzzle?.rating ?? null)
      : type === "opening"
        ? RATING_TIMING_CONFIG.defaultOpeningVariantRating
        : DEFAULT_PUZZLE_RATING;

  return { sequenceId: moveSequence.id, totalMoveCount: getPlayerMoveCount(moveSequence.moves), rating };
}

export async function getVoltTrackerFavorites(
  supabase: SupabaseClient,
  userId: string,
  options: { type?: VoltTrackerFavoriteType } = {},
): Promise<VoltTrackerFavorite[]> {
  const favorites = (await getUserFavoritesForUserWithDetails(supabase, userId)).flatMap((favorite) => {
    const type = getFavoriteType(favorite);
    return type && (!options.type || options.type === type) ? [{ favorite, type }] : [];
  });

  // ================================================================================================
  // Hata favorilerinin sekansları ayrıca çekilir (puzzle/opening sekansları favori sorgusunda gelir).
  // ================================================================================================
  const mistakeSequenceIds = [
    ...new Set(favorites.flatMap(({ favorite }) => favorite.gameAnalysisMistake?.moveSequenceId ?? [])),
  ];
  const mistakeSequences =
    mistakeSequenceIds.length > 0 ? await moveSequenceService.getMoveSequencesByIds(supabase, mistakeSequenceIds) : [];
  const mistakeSequenceById = new Map(mistakeSequences.map((sequence) => [sequence.id, sequence]));

  const typedFavorites: TypedFavorite[] = favorites.map(({ favorite, type }) => ({
    favorite,
    type,
    moveSequence: getFavoriteMoveSequence(favorite, mistakeSequenceById),
  }));

  const voltContexts = typedFavorites.map(getVoltContext);
  const scoredContexts = voltContexts.filter((context): context is SequenceVoltContext => context != null);
  const sequenceIds = [...new Set(scoredContexts.map((context) => context.sequenceId))];

  const attempts =
    sequenceIds.length > 0 ? await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, sequenceIds) : [];
  const voltScoresBySequenceId = getVoltScoresBySequenceId(attempts, scoredContexts);
  const latestAttemptBySequenceId = createAttemptStatsBySequenceIdMap(getLatestAttemptStats(attempts));

  return typedFavorites.map(({ favorite, type, moveSequence }, index) => {
    const context = voltContexts[index];

    return {
      ...favorite,
      type,
      moveSequence,
      volt: context
        ? {
            ...context,
            score: voltScoresBySequenceId[context.sequenceId],
            latestAttempt: latestAttemptBySequenceId[context.sequenceId] ?? null,
          }
        : null,
    };
  });
}
