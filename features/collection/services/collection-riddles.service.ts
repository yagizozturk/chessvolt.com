// TODO: Refactor
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import { COLLECTION_RIDDLES_PAGE_SIZE } from "@/features/collection/constants/collection-riddles-pagination.constants";
import { getCollectionBySlug } from "@/features/collection/services/collection.service";
import type {
  CollectionRiddleDisplayItem,
  CollectionRiddlesDisplayData,
} from "@/features/collection/types/collection-riddles";
import {
  clampCollectionRiddlesPage,
  getCollectionRiddlesTotalPages,
} from "@/features/collection/utilities/collection-riddles-pagination.utils";
import { getGamesByIds } from "@/features/game/services/game.service";
import { getPrimaryThemesByRiddleIds } from "@/features/riddle-theme/services/riddle-theme.service";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import {
  getActiveRiddlesByCollectionId,
  getActiveRiddlesCountByCollectionId,
} from "@/features/riddle/services/riddle.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { buildRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getLatestAttemptStatsFromAttempts } from "@/features/user-sequence-attempt/utilities/get-latest-attempt-stats-from-attempts";
import { mapAttemptStatsBySequenceId as buildMapAttemptStatsBySequenceId } from "@/features/user-sequence-attempt/utilities/map-attempt-stats-by-sequence-id";
import { toSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/to-sequence-attempt-stats";

// ================================================================================================
// Getting collection riddles to display them in details page
// ================================================================================================
export async function getCollectionRiddles({
  supabase,
  user,
  slug,
  pagination,
}: {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  pagination?: number;
}): Promise<CollectionRiddlesDisplayData> {
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
  let paginationResult: CollectionRiddlesDisplayData["pagination"] = undefined;

  if (paginate) {
    const totalRiddleCount = await getActiveRiddlesCountByCollectionId(supabase, collection.id);
    const totalPages = getCollectionRiddlesTotalPages(totalRiddleCount);
    const currentPage = clampCollectionRiddlesPage(requestedPage, totalPages);
    paginatedRiddles = await riddleRepo.findActiveByCollectionId(supabase, collection.id, {
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
    paginatedRiddles = await getActiveRiddlesByCollectionId(supabase, collection.id);
  }

  // ================================================================================================
  // Getting move sequence ids for riddles. Move sequence table holds e1e2 like moves
  // ================================================================================================
  const riddleSequenceIds = [...new Set(paginatedRiddles.map((r) => r.moveSequence.id))];

  // ================================================================================================
  // Attempts: accuracyPercent only (volt-score is favourites-only).
  // Games: optional FK for board context. Themes: primary theme per riddle.
  // ================================================================================================
  const gameIds = [...new Set(paginatedRiddles.map((r) => r.gameId).filter((id): id is string => id != null))];
  const [riddleAttempts, games, primaryThemesByRiddleId] = await Promise.all([
    user && riddleSequenceIds.length > 0
      ? attemptService.getAttemptsByUserAndSequenceIds(supabase, user.id, riddleSequenceIds)
      : Promise.resolve([]),
    gameIds.length > 0 ? getGamesByIds(supabase, gameIds) : Promise.resolve([]),
    getPrimaryThemesByRiddleIds(
      supabase,
      paginatedRiddles.map((riddle) => riddle.id),
    ),
  ]);
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const mapAttemptStatsBySequenceId = buildMapAttemptStatsBySequenceId(
    getLatestAttemptStatsFromAttempts(riddleAttempts),
  );

  const items: CollectionRiddleDisplayItem[] = paginatedRiddles
    .map((riddle) => {
      const game = riddle.gameId ? gameMap[riddle.gameId] : null;
      if (!game && !riddle.moveSequence.displayFen) return null;
      return { riddle, game };
    })
    .filter((x): x is NonNullable<typeof x> => x != null) // Skip unrenderable riddles: if there’s no game and no displayFen, return null.
    .map(({ riddle, game }) => {
      const attemptStats = toSequenceAttemptStats(mapAttemptStatsBySequenceId[riddle.moveSequence.id]);

      return {
        riddle,
        game,
        href: buildRiddlePath(riddle.id, { collectionSlug: collection.slug }),
        displayFen: riddle.moveSequence.displayFen,
        accuracyPercent: attemptStats.accuracyPercent,
        primaryTheme: primaryThemesByRiddleId.get(riddle.id) ?? null,
      };
    });

  return {
    collection,
    items,
    pagination: paginationResult,
  };
}
