import {
  ONBOARDING_RIDDLE_RATING_TOLERANCE,
  ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK,
  ONBOARDING_STARTER_COLLECTION_MIN_RIDDLES,
  ONBOARDING_STARTER_COLLECTION_RIDDLE_LIMIT,
} from "@/features/onboarding/constants/onboarding-starter-collection.config";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import type { Riddle } from "@/features/riddle/types/riddle";
import { ratingDistanceFromTarget } from "@/features/riddle/types/riddle-rating";
import type { SupabaseClient } from "@supabase/supabase-js";

const FETCH_BUFFER = 2;

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

function hasEnoughMatches(riddles: Riddle[]): boolean {
  return riddles.length >= ONBOARDING_STARTER_COLLECTION_MIN_RIDDLES;
}

export async function selectOnboardingStarterRiddles(
  supabase: SupabaseClient,
  input: { themeSlugs: string[]; userRating: number },
): Promise<Riddle[]> {
  const limit = ONBOARDING_STARTER_COLLECTION_RIDDLE_LIMIT;
  const fetchLimit = limit * FETCH_BUFFER;
  const { themeSlugs, userRating } = input;

  if (themeSlugs.length > 0) {
    const strictMatches = await riddleRepo.findActiveByThemesAndRatingRange(supabase, {
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

    const wideMatches = await riddleRepo.findActiveByThemesAndRatingRange(supabase, {
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

    const themeMatches = await riddleRepo.findActiveByThemes(supabase, {
      themeSlugs,
      limit: fetchLimit,
    });

    if (themeMatches.length > 0) {
      return pickClosestRiddles(themeMatches, userRating, limit);
    }
  }

  const ratingMatches = await riddleRepo.findActiveByRatingRange(supabase, {
    minRating: userRating - ONBOARDING_RIDDLE_RATING_TOLERANCE,
    maxRating: userRating + ONBOARDING_RIDDLE_RATING_TOLERANCE,
    limit: fetchLimit,
  });

  if (ratingMatches.length > 0) {
    return pickClosestRiddles(ratingMatches, userRating, limit);
  }

  const wideRatingMatches = await riddleRepo.findActiveByRatingRange(supabase, {
    minRating: userRating - ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK,
    maxRating: userRating + ONBOARDING_RIDDLE_RATING_TOLERANCE_FALLBACK,
    limit: fetchLimit,
  });

  return pickClosestRiddles(wideRatingMatches, userRating, limit);
}
