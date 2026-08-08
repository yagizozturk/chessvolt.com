import type { SupabaseClient } from "@supabase/supabase-js";

import * as puzzleThemeRepo from "@/features/puzzle-theme/repository/puzzle-theme.repository";
import { DEFAULT_PUZZLE_RATING } from "@/features/puzzle/constants/puzzle-rating.constants";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { getRandomPuzzleByRating } from "@/features/puzzle/utilities/get-random-puzzle-by-rating";
import * as themeRepo from "@/features/theme/repository/theme.repository";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

// ================================================================================
// Picks one rating-matched unsolved puzzle for the clicked theme.
// Only that theme is queried — the list page does not fetch puzzles for every theme.
// ================================================================================
export async function getFirstRandomPuzzleForTheme(
  supabase: SupabaseClient,
  options: {
    themeSlug: string;
    userId?: string | null;
    targetRating?: number | null;
  },
): Promise<Puzzle | null> {
  const { themeSlug, userId, targetRating } = options;

  const theme = await themeRepo.findBySlug(supabase, themeSlug);
  if (!theme || !theme.isActive) return null;

  const puzzles = await puzzleThemeRepo.findActivePuzzlesByThemeId(supabase, theme.id);
  const solvedSequenceIds = await getSolvedSequenceIds(supabase, userId);
  const rating = targetRating ?? DEFAULT_PUZZLE_RATING;

  const unsolvedPuzzles = excludeSolved(puzzles, solvedSequenceIds);
  return getRandomPuzzleByRating(unsolvedPuzzles, rating);
}

// ================================================================================
// Getting user solved sequences Ids. We can use this to get users solved puzzles and opening-variants.
// ================================================================================
async function getSolvedSequenceIds(supabase: SupabaseClient, userId?: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  return attemptService.getCompletedSequenceIdsByUser(supabase, userId);
}

// ================================================================================
// Excluding solved puzzles from the list of puzzles.
// ================================================================================
function excludeSolved(puzzles: Puzzle[], solvedSequenceIds: Set<string>): Puzzle[] {
  if (solvedSequenceIds.size === 0) return puzzles;
  return puzzles.filter((puzzle) => !solvedSequenceIds.has(puzzle.moveSequence.id));
}
