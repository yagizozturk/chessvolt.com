// TODO: Refactor
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import {
  getActiveRiddlesByCollectionId,
  getActiveRiddlesCountByCollectionId,
} from "@/features/collection-riddles/services/collection-riddles.service";
import { COLLECTION_RIDDLES_PAGE_SIZE } from "@/features/collection/constants/collection-riddles-pagination.constants";
import { getCollectionBySlug } from "@/features/collection/services/collection.service";
import type {
  CollectionRiddleCardItemData,
  CollectionRiddlesPageData,
} from "@/features/collection/types/collection-riddles";
import {
  clampCollectionRiddlesPage,
  getCollectionRiddlesTotalPages,
} from "@/features/collection/utilities/collection-riddles-pagination.utils";
import { getGamesByIds } from "@/features/game/services/game.service";
import { getPrimaryThemesByRiddleIds } from "@/features/riddle-theme/services/riddle-theme.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { buildCollectionRiddleUrl } from "@/features/riddle/utilities/build-riddle-url";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { createAttemptStatsBySequenceIdMap } from "@/features/user-sequence-attempt/utilities/create-attempt-stats-by-sequence-id-map";
import { getLatestAttemptStats } from "@/features/user-sequence-attempt/utilities/get-latest-attempt-stats";
import { getSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/get-sequence-attempt-stats";

// ================================================================================================
// Getting collection riddles to display them in details page
// ================================================================================================
export async function loadCollectionRiddles({
  supabase,
  user,
  slug,
  pagination,
}: {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  pagination?: number;
}): Promise<CollectionRiddlesPageData> {
  // ================================================================================================
  // Getting collection informatin by its slug(params)
  // ================================================================================================
  const collection = await getCollectionBySlug(supabase, slug);
  if (!collection || !collection.isActive) {
    notFound();
  }

  // ================================================================================================
  // Getting riddles in this collection by id (paginated when page is provided)
  // Default is 1
  // ================================================================================================
  const paginate = pagination != null;
  const requestedPage = pagination ?? 1;
  let paginatedRiddles: Riddle[];
  let paginationResult: CollectionRiddlesPageData["pagination"] = undefined;

  // ================================================================================================
  // Getting paginated data in a paginationResult Type which is a final CollectionRiddlesPageData Type
  // ================================================================================================
  if (paginate) {
    const totalRiddleCount = await getActiveRiddlesCountByCollectionId(supabase, collection.id);
    const totalPages = getCollectionRiddlesTotalPages(totalRiddleCount);
    const currentPage = clampCollectionRiddlesPage(requestedPage, totalPages);
    paginatedRiddles = await getActiveRiddlesByCollectionId(supabase, collection.id, {
      offset: (currentPage - 1) * COLLECTION_RIDDLES_PAGE_SIZE,
      limit: COLLECTION_RIDDLES_PAGE_SIZE,
    });
    paginationResult = {
      page: currentPage,
      pageSize: COLLECTION_RIDDLES_PAGE_SIZE,
      totalRiddleCount,
      totalPages,
    };
  } else {
    // If no pagination is requested, get all active riddles in the collection
    paginatedRiddles = await getActiveRiddlesByCollectionId(supabase, collection.id);
  }

  // ================================================================================================
  // Getting move sequence ids for riddles in collection. Move sequence table holds e1e2 like moves
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

    // Getting reel games for game ids. Check if there is a real game in collection
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
  const collectionRiddles: CollectionRiddleCardItemData[] = paginatedRiddles
    .map((riddle) => {
      const game = riddle.gameId ? realPlayedGamesMap[riddle.gameId] : null;
      if (!game && !riddle.moveSequence.displayFen) return null;
      return { riddle, game };
    })
    .filter((x): x is NonNullable<typeof x> => x != null) // Skip unrenderable riddles: if there’s no game and no displayFen, return null.
    .map(({ riddle, game }) => {
      const attemptStats = getSequenceAttemptStats(attemptStatsBySequenceIdMap[riddle.moveSequence.id]);

      return {
        riddle,
        game,
        href: buildCollectionRiddleUrl(riddle.id, { collectionSlug: collection.slug }),
        displayFen: riddle.moveSequence.displayFen,
        accuracyPercent: attemptStats.accuracyPercent,
        primaryTheme: primaryThemesByRiddleId.get(riddle.id) ?? null,
      };
    });

  return {
    collection,
    collectionRiddles,
    pagination: paginationResult,
  };
}
