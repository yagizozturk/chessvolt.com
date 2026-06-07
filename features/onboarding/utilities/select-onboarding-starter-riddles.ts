import type { SupabaseClient } from "@supabase/supabase-js";

import {
  ONBOARDING_RIDDLE_RATING_TOLERANCE,
  ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK,
  ONBOARDING_STARTER_COLLECTION_MIN_RIDDLES,
  ONBOARDING_STARTER_COLLECTION_RIDDLE_LIMIT,
} from "@/features/onboarding/constants/onboarding-starter-collection.config";
import * as riddleService from "@/features/riddle/services/riddle.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { ratingDistanceFromTarget } from "@/features/riddle/types/riddle-rating";

// Repo queries order by DB columns (rating asc or created_at), not by distance to
// userRating. Fetch 2× the final limit so pickClosestRiddles has a wider candidate
// pool to sort and slice the closest matches — e.g. 30 rows in, 15 closest out.
const FETCH_BUFFER = 2;

// ============================================================================
// Select Onboarding Starter Riddles
//
// Picks riddles for the personalized starter collection created after onboarding.
// Uses improvement-goal themes and the user's initial rating from chess familiarity.
// Falls back through progressively wider search criteria when strict matches are sparse.
// ============================================================================

// ============================================================================
// Deduplicates riddles by id, sorts by closest rating to userRating (ties broken
// by createdAt), and returns up to limit items. Used after each repo query to
// shrink a buffered fetch down to the final collection size.
// ============================================================================
function pickClosestRiddles(riddles: Riddle[], userRating: number, limit: number): Riddle[] {
  const uniqueById = new Map<string, Riddle>();
  for (const riddle of riddles) {
    uniqueById.set(riddle.id, riddle);
  }

  return [...uniqueById.values()]
    .sort((a, b) => {
      const distanceDiff =
        ratingDistanceFromTarget(a.rating, userRating) - ratingDistanceFromTarget(b.rating, userRating);
      if (distanceDiff !== 0) return distanceDiff;
      return a.createdAt.localeCompare(b.createdAt);
    })
    .slice(0, limit);
}

// ============================================================================
// True when the picked set meets ONBOARDING_STARTER_COLLECTION_MIN_RIDDLES.
// When the pool itself is smaller than the minimum, callers accept whatever
// was found rather than widening search again.
// ============================================================================
function hasEnoughMatches(riddles: Riddle[]): boolean {
  return riddles.length >= ONBOARDING_STARTER_COLLECTION_MIN_RIDDLES;
}

// ============================================================================
// Chooses up to ONBOARDING_STARTER_COLLECTION_RIDDLE_LIMIT active riddles for
// the user's starter collection. Search strategy (first satisfactory result wins):
//
// When themeSlugs from improvement goals are non-empty:
//   1. Themes + tight rating band (± ONBOARDING_RIDDLE_RATING_TOLERANCE).
//   2. Themes + wide rating band (± ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK).
//   3. Themes only (any rating).
//
// When no themes or theme search returned nothing:
//   4. Tight rating band across all themes.
//   5. Wide rating band across all themes.
//
// Each query requests limit * FETCH_BUFFER rows (see FETCH_BUFFER above). The DB
// cannot rank by proximity to userRating, so we over-fetch and let
// pickClosestRiddles sort client-side before slicing to the final limit.
// ============================================================================
export async function selectOnboardingStarterRiddles(
  supabase: SupabaseClient,
  data: { themeSlugs: string[]; userRating: number },
): Promise<Riddle[]> {
  const limit = ONBOARDING_STARTER_COLLECTION_RIDDLE_LIMIT;
  const fetchLimit = limit * FETCH_BUFFER;
  const { themeSlugs, userRating } = data;

  // ============================================================================
  // Find strict matches in rating range
  // ============================================================================
  if (themeSlugs.length > 0) {
    // ============================================================================
    // Find strict matches in rating range
    // right themes, tight rating band (±200). Best fit.
    // ============================================================================
    const strictMatches = await riddleService.findActiveRiddlesByThemesAndRatingRange(supabase, {
      themeSlugs,
      minRating: userRating - ONBOARDING_RIDDLE_RATING_TOLERANCE,
      maxRating: userRating + ONBOARDING_RIDDLE_RATING_TOLERANCE,
      limit: fetchLimit,
    });

    if (strictMatches.length > 0) {
      const picked = pickClosestRiddles(strictMatches, userRating, limit);
      if (hasEnoughMatches(picked) || strictMatches.length < ONBOARDING_STARTER_COLLECTION_MIN_RIDDLES) {
        return picked;
      }
    }

    // ============================================================================
    // Find wide matches in rating range
    // same themes, wider band (±400). Fallback when strict finds too few riddles (under 5).
    // ============================================================================
    const wideMatches = await riddleService.findActiveRiddlesByThemesAndRatingRange(supabase, {
      themeSlugs,
      minRating: userRating - ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK,
      maxRating: userRating + ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK,
      limit: fetchLimit,
    });

    if (wideMatches.length > 0) {
      const picked = pickClosestRiddles(wideMatches, userRating, limit);
      if (hasEnoughMatches(picked) || wideMatches.length < ONBOARDING_STARTER_COLLECTION_MIN_RIDDLES) {
        return picked;
      }
    }

    // ============================================================================
    // Get Active riddles By Themes
    // ============================================================================
    const riddlesMatchedByThemes = await riddleService.findActiveRiddlesByThemes(supabase, {
      themeSlugs,
      limit: fetchLimit,
    });

    if (riddlesMatchedByThemes.length > 0) {
      return pickClosestRiddles(riddlesMatchedByThemes, userRating, limit);
    }
  }

  // ============================================================================
  // Get Active riddles By Rating Range
  // ============================================================================
  const riddlesMatchedByRatingRange = await riddleService.findActiveRiddlesByRatingRange(supabase, {
    minRating: userRating - ONBOARDING_RIDDLE_RATING_TOLERANCE,
    maxRating: userRating + ONBOARDING_RIDDLE_RATING_TOLERANCE,
    limit: fetchLimit,
  });

  if (riddlesMatchedByRatingRange.length > 0) {
    return pickClosestRiddles(riddlesMatchedByRatingRange, userRating, limit);
  }

  // ============================================================================
  // Get Active riddles By Rating Range (fallback) Wide range
  // ============================================================================
  const wideRatingMatches = await riddleService.findActiveRiddlesByRatingRange(supabase, {
    minRating: userRating - ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK,
    maxRating: userRating + ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK,
    limit: fetchLimit,
  });

  return pickClosestRiddles(wideRatingMatches, userRating, limit);
}
