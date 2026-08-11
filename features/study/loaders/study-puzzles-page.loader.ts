import type { SupabaseClient, User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import { getGamesByIds } from "@/features/game/services/game.service";
import { getPrimaryThemesByPuzzleIds } from "@/features/puzzle-theme/services/puzzle-theme.service";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { buildStudyPuzzleUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import {
  getActivePuzzlesByStudyId,
  getActivePuzzlesCountByStudyId,
} from "@/features/study-puzzles/services/study-puzzles.service";
import { STUDY_PUZZLES_PAGE_SIZE } from "@/features/study/constants/study-puzzles-pagination.constants";
import { getStudyBySlug } from "@/features/study/services/study.service";
import type { StudyPuzzleCardItemData, StudyPuzzlesPageData } from "@/features/study/types/study-puzzles";
import {
  clampStudyPuzzlesPage,
  getStudyPuzzlesTotalPages,
} from "@/features/study/utilities/study-puzzles-pagination.utils";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import { createAttemptStatsBySequenceIdMap } from "@/features/user-sequence-attempt/utilities/create-attempt-stats-by-sequence-id-map";
import { getLatestAttemptStats } from "@/features/user-sequence-attempt/utilities/get-latest-attempt-stats";
import { getSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/get-sequence-attempt-stats";

// ================================================================================================
// Getting study puzzles to display them in details page
// ================================================================================================
export async function loadStudyPuzzles({
  supabase,
  user,
  slug,
  pagination,
}: {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  pagination?: number;
}): Promise<StudyPuzzlesPageData> {
  // ================================================================================================
  // Getting study informatin by its slug(params)
  // ================================================================================================
  const study = await getStudyBySlug(supabase, slug);
  if (!study || !study.isActive) {
    notFound();
  }

  // ================================================================================================
  // Getting puzzles in this study by id (paginated when page is provided)
  // Default is 1
  // ================================================================================================
  const paginate = pagination != null;
  const requestedPage = pagination ?? 1;
  let paginatedPuzzles: Puzzle[];
  let paginationResult: StudyPuzzlesPageData["pagination"] = undefined;

  // ================================================================================================
  // Getting paginated data in a paginationResult Type which is a final StudyPuzzlesPageData Type
  // ================================================================================================
  if (paginate) {
    const totalPuzzleCount = await getActivePuzzlesCountByStudyId(supabase, study.id);
    const totalPages = getStudyPuzzlesTotalPages(totalPuzzleCount);
    const currentPage = clampStudyPuzzlesPage(requestedPage, totalPages);
    paginatedPuzzles = await getActivePuzzlesByStudyId(supabase, study.id, {
      offset: (currentPage - 1) * STUDY_PUZZLES_PAGE_SIZE,
      limit: STUDY_PUZZLES_PAGE_SIZE,
    });
    paginationResult = {
      page: currentPage,
      pageSize: STUDY_PUZZLES_PAGE_SIZE,
      totalPuzzleCount,
      totalPages,
    };
  } else {
    // If no pagination is requested, get all active puzzles in the study
    paginatedPuzzles = await getActivePuzzlesByStudyId(supabase, study.id);
  }

  // ================================================================================================
  // Getting move sequence ids for puzzles in study. Move sequence table holds e1e2 like moves
  // ================================================================================================
  const puzzleSequenceIds = [...new Set(paginatedPuzzles.map((r) => r.moveSequence.id))];

  // ================================================================================================
  // Games: optional FK for board context. Themes: primary theme per puzzle.
  // ================================================================================================
  const gameIds = [...new Set(paginatedPuzzles.map((r) => r.gameId).filter((id): id is string => id != null))];

  // ================================================================================================
  // Attempts: accuracyPercent only (volt-score is in favorites-only).
  // ================================================================================================
  const [puzzleAttempts, realPlayedGames, primaryThemesByPuzzleId] = await Promise.all([
    // Getting attemopts for sequence ids for that user
    user && puzzleSequenceIds.length > 0
      ? attemptService.getAttemptsByUserAndSequenceIds(supabase, user.id, puzzleSequenceIds)
      : Promise.resolve([]),

    // Getting reel games for game ids. Check if there is a real game in study
    gameIds.length > 0 ? getGamesByIds(supabase, gameIds) : Promise.resolve([]),

    // Getting primary themes for puzzle ids
    getPrimaryThemesByPuzzleIds(
      supabase,
      paginatedPuzzles.map((puzzle) => puzzle.id),
    ),
  ]);

  // mapping game map
  const realPlayedGamesMap = Object.fromEntries(realPlayedGames.map((g) => [g.id, g]));

  // create a mapping attempt stats by sequence id map
  const attemptStatsBySequenceIdMap = createAttemptStatsBySequenceIdMap(
    getLatestAttemptStats(puzzleAttempts), // get the last attempt stats
  );

  // ================================================================================================
  // Mapping items for the page
  // Calculating accuracy from last attempt
  // Getting theme
  // ================================================================================================
  const studyPuzzles: StudyPuzzleCardItemData[] = paginatedPuzzles
    .map((puzzle) => {
      const game = puzzle.gameId ? realPlayedGamesMap[puzzle.gameId] : null;
      if (!game && !puzzle.moveSequence.displayFen) return null;
      return { puzzle, game };
    })
    .filter((x): x is NonNullable<typeof x> => x != null) // Skip unrenderable puzzles: if there’s no game and no displayFen, return null.
    .map(({ puzzle, game }) => {
      const rawAttemptStats = attemptStatsBySequenceIdMap[puzzle.moveSequence.id];
      const attemptStats = getSequenceAttemptStats(rawAttemptStats);

      return {
        puzzle,
        game,
        href: buildStudyPuzzleUrl(puzzle.id, { studySlug: study.slug }),
        displayFen: puzzle.moveSequence.displayFen,
        accuracyPercent: attemptStats.accuracyPercent,
        primaryTheme: primaryThemesByPuzzleId.get(puzzle.id) ?? null,
        isComplete: attemptStatusToIsComplete(rawAttemptStats?.status),
      };
    });

  return {
    study,
    studyPuzzles,
    pagination: paginationResult,
  };
}
