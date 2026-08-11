import type { SupabaseClient } from "@supabase/supabase-js";

import { getGamesByIds } from "@/features/game/services/game.service";
import type { Game } from "@/features/game/types/game";
import * as puzzleThemeRepo from "@/features/puzzle-theme/repository/puzzle-theme.repository";
import type { PuzzlePrimaryTheme } from "@/features/puzzle-theme/types/puzzle-theme";
import type { AttemptedPuzzlesSortBy } from "@/features/puzzle/constants/puzzles-list.constants";
import { PUZZLES_THEME_FILTER_ALL } from "@/features/puzzle/constants/puzzles-list.constants";
import * as puzzleRepo from "@/features/puzzle/repository/puzzle.repository";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/get-sequence-attempt-stats";

export type AttemptedPuzzleListItem = {
  puzzle: Puzzle;
  game: Game | null;
  themeSlugs: string[];
  primaryTheme: PuzzlePrimaryTheme | null;
  lastPlayedAt: string;
  accuracyPercent: number | null;
};

export function filterAttemptedPuzzleItems(
  items: AttemptedPuzzleListItem[],
  themeSlug: string,
): AttemptedPuzzleListItem[] {
  if (themeSlug === PUZZLES_THEME_FILTER_ALL) return items;
  return items.filter((item) => item.themeSlugs.includes(themeSlug));
}

export function sortAttemptedPuzzleItems(
  items: AttemptedPuzzleListItem[],
  sortBy: AttemptedPuzzlesSortBy,
): AttemptedPuzzleListItem[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (sortBy === "lastPlayed") {
      return new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime();
    }

    return (b.accuracyPercent ?? -1) - (a.accuracyPercent ?? -1);
  });

  return sorted;
}
