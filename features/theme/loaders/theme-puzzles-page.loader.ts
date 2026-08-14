import type { SupabaseClient, User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import { getGamesByIds } from "@/features/game/services/game.service";
import {
  getActivePuzzlesByThemeId,
  getActivePuzzlesCountByThemeId,
  getPrimaryThemesByPuzzleIds,
} from "@/features/puzzle-theme/services/puzzle-theme.service";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { buildThemePuzzleUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import { THEME_PUZZLES_PAGE_SIZE } from "@/features/theme/constants/theme-puzzles-pagination.constants";
import { getThemeBySlug } from "@/features/theme/services/theme.service";
import type { ThemePuzzleCardItemData, ThemePuzzlesPageData } from "@/features/theme/types/theme-puzzles";
import {
  clampThemePuzzlesPage,
  getThemePuzzlesTotalPages,
} from "@/features/theme/utilities/theme-puzzles-pagination.utils";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import { createAttemptStatsBySequenceIdMap } from "@/features/user-sequence-attempt/utilities/create-attempt-stats-by-sequence-id-map";
import { getLatestAttemptStats } from "@/features/user-sequence-attempt/utilities/get-latest-attempt-stats";
import { getSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/get-sequence-attempt-stats";

export async function loadThemePuzzles({
  supabase,
  user,
  slug,
  pagination,
}: {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  pagination?: number;
}): Promise<ThemePuzzlesPageData> {
  const theme = await getThemeBySlug(supabase, slug);
  if (!theme || !theme.isActive) {
    notFound();
  }

  const paginate = pagination != null;
  const requestedPage = pagination ?? 1;
  let paginatedPuzzles: Puzzle[];
  let paginationResult: ThemePuzzlesPageData["pagination"] = undefined;

  if (paginate) {
    const totalPuzzleCount = await getActivePuzzlesCountByThemeId(supabase, theme.id);
    const totalPages = getThemePuzzlesTotalPages(totalPuzzleCount);
    const currentPage = clampThemePuzzlesPage(requestedPage, totalPages);
    paginatedPuzzles = await getActivePuzzlesByThemeId(supabase, theme.id, {
      offset: (currentPage - 1) * THEME_PUZZLES_PAGE_SIZE,
      limit: THEME_PUZZLES_PAGE_SIZE,
    });
    paginationResult = {
      page: currentPage,
      pageSize: THEME_PUZZLES_PAGE_SIZE,
      totalPuzzleCount,
      totalPages,
    };
  } else {
    paginatedPuzzles = await getActivePuzzlesByThemeId(supabase, theme.id);
  }

  const puzzleSequenceIds = [...new Set(paginatedPuzzles.map((r) => r.moveSequence.id))];
  const gameIds = [...new Set(paginatedPuzzles.map((r) => r.gameId).filter((id): id is string => id != null))];

  const [puzzleAttempts, realPlayedGames, primaryThemesByPuzzleId] = await Promise.all([
    user && puzzleSequenceIds.length > 0
      ? attemptService.getAttemptsByUserAndSequenceIds(supabase, user.id, puzzleSequenceIds)
      : Promise.resolve([]),
    gameIds.length > 0 ? getGamesByIds(supabase, gameIds) : Promise.resolve([]),
    getPrimaryThemesByPuzzleIds(
      supabase,
      paginatedPuzzles.map((puzzle) => puzzle.id),
    ),
  ]);

  const realPlayedGamesMap = Object.fromEntries(realPlayedGames.map((g) => [g.id, g]));
  const attemptStatsBySequenceIdMap = createAttemptStatsBySequenceIdMap(getLatestAttemptStats(puzzleAttempts));

  const themePuzzles: ThemePuzzleCardItemData[] = paginatedPuzzles
    .map((puzzle) => {
      const game = puzzle.gameId ? realPlayedGamesMap[puzzle.gameId] : null;
      if (!game && !puzzle.moveSequence.displayFen) return null;
      return { puzzle, game };
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
    .map(({ puzzle, game }) => {
      const rawAttemptStats = attemptStatsBySequenceIdMap[puzzle.moveSequence.id];
      const attemptStats = getSequenceAttemptStats(rawAttemptStats);

      return {
        puzzle,
        game,
        href: buildThemePuzzleUrl(puzzle.id, { themeSlug: theme.slug }),
        displayFen: puzzle.moveSequence.displayFen,
        accuracyPercent: attemptStats.accuracyPercent,
        primaryTheme: primaryThemesByPuzzleId.get(puzzle.id) ?? null,
        isComplete: attemptStatusToIsComplete(rawAttemptStats?.status),
      };
    });

  return {
    theme,
    themePuzzles,
    pagination: paginationResult,
  };
}
