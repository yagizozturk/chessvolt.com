// TODO: Refactor
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import {
  getActiveRiddlesByStudyId,
  getActiveRiddlesCountByStudyId,
} from "@/features/study-riddles/services/study-riddles.service";
import { STUDY_RIDDLES_PAGE_SIZE } from "@/features/study/constants/study-riddles-pagination.constants";
import { getStudyBySlug } from "@/features/study/services/study.service";
import type {
  StudyRiddleCardItemData,
  StudyRiddlesPageData,
} from "@/features/study/types/study-riddles";
import {
  clampStudyRiddlesPage,
  getStudyRiddlesTotalPages,
} from "@/features/study/utilities/study-riddles-pagination.utils";
import { getGamesByIds } from "@/features/game/services/game.service";
import { getPrimaryThemesByRiddleIds } from "@/features/riddle-theme/services/riddle-theme.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { buildStudyRiddleUrl } from "@/features/riddle/utilities/build-riddle-url";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { attemptStatusToIsComplete } from "@/features/user-sequence-attempt/utilities/attempt-status";
import { createAttemptStatsBySequenceIdMap } from "@/features/user-sequence-attempt/utilities/create-attempt-stats-by-sequence-id-map";
import { getLatestAttemptStats } from "@/features/user-sequence-attempt/utilities/get-latest-attempt-stats";
import { getSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/get-sequence-attempt-stats";

// ================================================================================================
// Getting study riddles to display them in details page
// ================================================================================================
export async function loadStudyRiddles({
  supabase,
  user,
  slug,
  pagination,
}: {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  pagination?: number;
}): Promise<StudyRiddlesPageData> {
  // ================================================================================================
  // Getting study informatin by its slug(params)
  // ================================================================================================
  const study = await getStudyBySlug(supabase, slug);
  if (!study || !study.isActive) {
    notFound();
  }

  // ================================================================================================
  // Getting riddles in this study by id (paginated when page is provided)
  // Default is 1
  // ================================================================================================
  const paginate = pagination != null;
  const requestedPage = pagination ?? 1;
  let paginatedRiddles: Riddle[];
  let paginationResult: StudyRiddlesPageData["pagination"] = undefined;

  // ================================================================================================
  // Getting paginated data in a paginationResult Type which is a final StudyRiddlesPageData Type
  // ================================================================================================
  if (paginate) {
    const totalRiddleCount = await getActiveRiddlesCountByStudyId(supabase, study.id);
    const totalPages = getStudyRiddlesTotalPages(totalRiddleCount);
    const currentPage = clampStudyRiddlesPage(requestedPage, totalPages);
    paginatedRiddles = await getActiveRiddlesByStudyId(supabase, study.id, {
      offset: (currentPage - 1) * STUDY_RIDDLES_PAGE_SIZE,
      limit: STUDY_RIDDLES_PAGE_SIZE,
    });
    paginationResult = {
      page: currentPage,
      pageSize: STUDY_RIDDLES_PAGE_SIZE,
      totalRiddleCount,
      totalPages,
    };
  } else {
    // If no pagination is requested, get all active riddles in the study
    paginatedRiddles = await getActiveRiddlesByStudyId(supabase, study.id);
  }

  // ================================================================================================
  // Getting move sequence ids for riddles in study. Move sequence table holds e1e2 like moves
  // ================================================================================================
  const riddleSequenceIds = [...new Set(paginatedRiddles.map((r) => r.moveSequence.id))];

  // ================================================================================================
  // Games: optional FK for board context. Themes: primary theme per riddle.
  // ================================================================================================
  const gameIds = [...new Set(paginatedRiddles.map((r) => r.gameId).filter((id): id is string => id != null))];

  // ================================================================================================
  // Attempts: accuracyPercent only (volt-score is in favourites-only).
  // ================================================================================================
  const [riddleAttempts, realPlayedGames, primaryThemesByRiddleId] = await Promise.all([
    // Getting attemopts for sequence ids for that user
    user && riddleSequenceIds.length > 0
      ? attemptService.getAttemptsByUserAndSequenceIds(supabase, user.id, riddleSequenceIds)
      : Promise.resolve([]),

    // Getting reel games for game ids. Check if there is a real game in study
    gameIds.length > 0 ? getGamesByIds(supabase, gameIds) : Promise.resolve([]),

    // Getting primary themes for riddle ids
    getPrimaryThemesByRiddleIds(
      supabase,
      paginatedRiddles.map((riddle) => riddle.id),
    ),
  ]);

  // mapping game map
  const realPlayedGamesMap = Object.fromEntries(realPlayedGames.map((g) => [g.id, g]));

  // create a mapping attempt stats by sequence id map
  const attemptStatsBySequenceIdMap = createAttemptStatsBySequenceIdMap(
    getLatestAttemptStats(riddleAttempts), // get the last attempt stats
  );

  // ================================================================================================
  // Mapping items for the page
  // Calculating accuracy from last attempt
  // Getting theme
  // ================================================================================================
  const studyRiddles: StudyRiddleCardItemData[] = paginatedRiddles
    .map((riddle) => {
      const game = riddle.gameId ? realPlayedGamesMap[riddle.gameId] : null;
      if (!game && !riddle.moveSequence.displayFen) return null;
      return { riddle, game };
    })
    .filter((x): x is NonNullable<typeof x> => x != null) // Skip unrenderable riddles: if there’s no game and no displayFen, return null.
    .map(({ riddle, game }) => {
      const rawAttemptStats = attemptStatsBySequenceIdMap[riddle.moveSequence.id];
      const attemptStats = getSequenceAttemptStats(rawAttemptStats);

      return {
        riddle,
        game,
        href: buildStudyRiddleUrl(riddle.id, { studySlug: study.slug }),
        displayFen: riddle.moveSequence.displayFen,
        accuracyPercent: attemptStats.accuracyPercent,
        primaryTheme: primaryThemesByRiddleId.get(riddle.id) ?? null,
        isComplete: attemptStatusToIsComplete(rawAttemptStats?.status),
      };
    });

  return {
    study,
    studyRiddles,
    pagination: paginationResult,
  };
}
