import type { SupabaseClient } from "@supabase/supabase-js";

import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import { getGamesByIds } from "@/features/game/services/game.service";
import type { Game } from "@/features/game/types/game";
import * as riddleThemeRepo from "@/features/riddle-theme/repository/riddle-theme.repository";
import type { PrimaryRiddleTheme } from "@/features/riddle-theme/services/riddle-theme.service";
import type { AttemptedRiddlesSortBy } from "@/features/riddle/constants/riddles-list.constants";
import { RIDDLES_THEME_FILTER_ALL } from "@/features/riddle/constants/riddles-list.constants";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import type { Riddle } from "@/features/riddle/types/riddle";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { toSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/to-sequence-attempt-stats";

export type AttemptedRiddleListItem = {
  riddle: Riddle;
  game: Game | null;
  themeSlugs: string[];
  primaryTheme: PrimaryRiddleTheme | null;
  lastPlayedAt: string;
  accuracyPercent: number | null;
  voltScore: VoltScoreResult | null;
};

export async function getUserAttemptedRiddlesForDisplay(
  supabase: SupabaseClient,
  userId: string,
): Promise<AttemptedRiddleListItem[]> {
  const latestAttempts = await attemptService.getLatestFinishedAttemptsByUser(supabase, userId);
  if (latestAttempts.length === 0) return [];

  const sequenceIds = latestAttempts.map((attempt) => attempt.sequenceId);
  const latestBySequenceId = Object.fromEntries(latestAttempts.map((attempt) => [attempt.sequenceId, attempt]));

  const riddles = await riddleRepo.findByMoveSequenceIds(supabase, sequenceIds);
  if (riddles.length === 0) return [];

  const riddleThemes = await riddleThemeRepo.findByRiddleIdsWithTheme(
    supabase,
    riddles.map((riddle) => riddle.id),
  );
  const themeSlugsByRiddleId = new Map<string, string[]>();
  const primaryThemeByRiddleId = new Map<string, PrimaryRiddleTheme>();

  for (const row of riddleThemes) {
    const slugs = themeSlugsByRiddleId.get(row.riddleId) ?? [];
    slugs.push(row.theme.slug);
    themeSlugsByRiddleId.set(row.riddleId, slugs);

    if (!primaryThemeByRiddleId.has(row.riddleId)) {
      primaryThemeByRiddleId.set(row.riddleId, {
        title: row.theme.title,
        slug: row.theme.slug,
      });
    }
  }

  const riddleAttempts = await attemptService.getAttemptsByUserAndSequenceIds(supabase, userId, sequenceIds);

  const voltScoresBySequenceId = getVoltScoresBySequenceId(
    riddleAttempts,
    riddles.map((riddle) => ({
      sequenceId: riddle.moveSequence.id,
      totalMoveCount: getPlayerMoveCount(riddle.moveSequence.moves),
      rating: getRiddleRatingForScoring(riddle.rating),
    })),
  );

  const gameIds = [...new Set(riddles.map((riddle) => riddle.gameId).filter((id): id is string => id != null))];
  const games = await getGamesByIds(supabase, gameIds);
  const gameMap = Object.fromEntries(games.map((game) => [game.id, game]));

  const items: AttemptedRiddleListItem[] = [];

  for (const riddle of riddles) {
    const game = riddle.gameId ? (gameMap[riddle.gameId] ?? null) : null;
    if (!game && !riddle.moveSequence.displayFen) continue;

    const latest = latestBySequenceId[riddle.moveSequence.id];
    if (!latest) continue;

    const attemptStats = toSequenceAttemptStats(latest.stats);

    items.push({
      riddle,
      game,
      themeSlugs: themeSlugsByRiddleId.get(riddle.id) ?? [],
      primaryTheme: primaryThemeByRiddleId.get(riddle.id) ?? null,
      lastPlayedAt: latest.startedAt,
      accuracyPercent: attemptStats.accuracyPercent,
      voltScore: voltScoresBySequenceId[riddle.moveSequence.id] ?? null,
    });
  }

  return items;
}

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

    if (sortBy === "voltScore") {
      return (b.voltScore?.volt ?? 0) - (a.voltScore?.volt ?? 0);
    }

    return (b.accuracyPercent ?? -1) - (a.accuracyPercent ?? -1);
  });

  return sorted;
}
