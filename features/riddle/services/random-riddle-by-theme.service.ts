import type { SupabaseClient } from "@supabase/supabase-js";

import * as riddleThemeRepo from "@/features/riddle-theme/repository/riddle-theme.repository";
import { DEFAULT_RIDDLE_RATING } from "@/features/riddle/constants/riddle-rating.constants";
import type { Riddle } from "@/features/riddle/types/riddle";
import { buildStandaloneRiddleUrl } from "@/features/riddle/utilities/build-riddle-url";
import { getRandomRiddleByRating } from "@/features/riddle/utilities/get-random-riddle-by-rating";
import * as themeRepo from "@/features/theme/repository/theme.repository";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

// ================================================================================
// Tıklanan tek tema için riddle ları çekeriz.
// Kullanıcının çözdüğü Sequence id leri çekeriz.
// Rating ve solved filtresinden geçirip o tema için tek bir random riddle URL i döneriz.
// Sadece tıklanan tema sorgulanır, liste sayfasında tüm temalar için sorgu yapılmaz.
// ================================================================================
export async function getFirstRandomRiddleUrlForTheme(
  supabase: SupabaseClient,
  options: {
    themeSlug: string;
    userId?: string | null;
    targetRating?: number | null;
  },
): Promise<string | null> {
  const { themeSlug, userId, targetRating } = options;

  const theme = await themeRepo.findBySlug(supabase, themeSlug);
  if (!theme || !theme.isActive) return null;

  // Getting riddles by theme id
  const riddles = await riddleThemeRepo.findActiveRiddlesByThemeId(supabase, theme.id);

  // Getting user solved sequences
  const solvedSequenceIds = await getSolvedSequenceIds(supabase, userId);

  // Getting user rating, if there is not, default 1600
  const rating = targetRating ?? DEFAULT_RIDDLE_RATING;

  const unsolvedRiddles = excludeSolved(riddles, solvedSequenceIds);
  const ratingEligibleRandomRiddle = getRandomRiddleByRating(unsolvedRiddles, rating);
  if (!ratingEligibleRandomRiddle) return null;

  return buildStandaloneRiddleUrl(ratingEligibleRandomRiddle.id, {
    from: "riddles",
    theme: theme.slug,
  });
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
