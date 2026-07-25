// TODO: Refactor
import type { SupabaseClient } from "@supabase/supabase-js";

import { getGamesByIds } from "@/features/game/services/game.service";
import type { Game } from "@/features/game/types/game";
import * as riddleThemeRepo from "@/features/riddle-theme/repository/riddle-theme.repository";
import type { PrimaryRiddleTheme } from "@/features/riddle-theme/services/riddle-theme.service";
import type { AttemptedRiddlesSortBy } from "@/features/riddle/constants/riddles-list.constants";
import { RIDDLES_THEME_FILTER_ALL } from "@/features/riddle/constants/riddles-list.constants";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import type { Riddle } from "@/features/riddle/types/riddle";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/get-sequence-attempt-stats";

export type AttemptedRiddleListItem = {
  riddle: Riddle;
  game: Game | null;
  themeSlugs: string[];
  primaryTheme: PrimaryRiddleTheme | null;
  lastPlayedAt: string;
  accuracyPercent: number | null;
};

export function filterAttemptedRiddleItems(
  items: AttemptedRiddleListItem[],
  themeSlug: string,
): AttemptedRiddleListItem[] {
  if (themeSlug === RIDDLES_THEME_FILTER_ALL) return items;
  return items.filter((item) => item.themeSlugs.includes(themeSlug));
}

export function sortAttemptedRiddleItems(
  items: AttemptedRiddleListItem[],
  sortBy: AttemptedRiddlesSortBy,
): AttemptedRiddleListItem[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    if (sortBy === "lastPlayed") {
      return new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime();
    }

    return (b.accuracyPercent ?? -1) - (a.accuracyPercent ?? -1);
  });

  return sorted;
}
