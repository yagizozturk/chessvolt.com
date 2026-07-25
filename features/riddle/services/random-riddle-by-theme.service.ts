import type { SupabaseClient } from "@supabase/supabase-js";

import * as riddleThemeRepo from "@/features/riddle-theme/repository/riddle-theme.repository";
import { DEFAULT_RIDDLE_RATING } from "@/features/riddle/constants/riddle-rating.constants";
import type { Riddle } from "@/features/riddle/types/riddle";
import { getRandomRiddleByRating } from "@/features/riddle/utilities/get-random-riddle-by-rating";
import * as themeRepo from "@/features/theme/repository/theme.repository";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

// ================================================================================
// Picks one rating-matched unsolved riddle for the clicked theme.
// Only that theme is queried — the list page does not fetch riddles for every theme.
// ================================================================================
export async function getFirstRandomRiddleForTheme(
  supabase: SupabaseClient,
  options: {
    themeSlug: string;
    userId?: string | null;
    targetRating?: number | null;
  },
): Promise<Riddle | null> {
  const { themeSlug, userId, targetRating } = options;

  const theme = await themeRepo.findBySlug(supabase, themeSlug);
  if (!theme || !theme.isActive) return null;

  const riddles = await riddleThemeRepo.findActiveRiddlesByThemeId(supabase, theme.id);
  const solvedSequenceIds = await getSolvedSequenceIds(supabase, userId);
  const rating = targetRating ?? DEFAULT_RIDDLE_RATING;

  const unsolvedRiddles = excludeSolved(riddles, solvedSequenceIds);
  return getRandomRiddleByRating(unsolvedRiddles, rating);
}

// ================================================================================
// Getting user solved sequences Ids. We can use this to get users solved riddles and opening-variants.
// ================================================================================
async function getSolvedSequenceIds(supabase: SupabaseClient, userId?: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  return attemptService.getCompletedSequenceIdsByUser(supabase, userId);
}

// ================================================================================
// Excluding solved riddles from the list of riddles.
// ================================================================================
function excludeSolved(riddles: Riddle[], solvedSequenceIds: Set<string>): Riddle[] {
  if (solvedSequenceIds.size === 0) return riddles;
  return riddles.filter((riddle) => !solvedSequenceIds.has(riddle.moveSequence.id));
}
