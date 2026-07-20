// TODO: Refactor
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import { getVoltScoresBySequenceId } from "@/components/calculator/volt-calculator/build-volt-scores-by-sequence-id";
import { getPlayerMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { getCollectionBySlugAndType,
  getUserCustomCollectionBySlug,
} from "@/features/collection/services/collection.service";
import { COLLECTION_RIDDLES_PAGE_SIZE } from "@/features/collection/constants/collection-riddles-pagination.constants";
import type { Collection } from "@/features/collection/types/collection";
import type { CollectionType } from "@/features/collection/types/collection-type";
import {
  clampCollectionRiddlesPage,
  getCollectionRiddlesTotalPages,
} from "@/features/collection/utilities/collection-riddles-pagination.utils";
import { getGamesByIds } from "@/features/game/services/game.service";
import type { Game } from "@/features/game/types/game";
import { getPrimaryThemesByRiddleIds } from "@/features/riddle-theme/services/riddle-theme.service";
import type { PrimaryRiddleTheme } from "@/features/riddle-theme/services/riddle-theme.service";
import { getActiveRiddlesByCollectionId, countActiveRiddlesByCollectionId } from "@/features/riddle/services/riddle.service";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import type { Riddle } from "@/features/riddle/types/riddle";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { buildRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getLatestAttemptStatsFromAttempts } from "@/features/user-sequence-attempt/utilities/get-latest-attempt-stats-from-attempts";
import { mapAttemptStatsBySequenceId as buildMapAttemptStatsBySequenceId } from "@/features/user-sequence-attempt/utilities/map-attempt-stats-by-sequence-id";
import { toSequenceAttemptStats } from "@/features/user-sequence-attempt/utilities/to-sequence-attempt-stats";

export type CollectionRiddleDisplayItem = {
  riddle: Riddle;
  game: Game | null;
  href: string;
  displayFen: string | null;
  accuracyPercent: number | null;
  voltScore: VoltScoreResult | null;
  primaryTheme: PrimaryRiddleTheme | null;
};

export type CollectionRiddlesPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type CollectionRiddlesDisplayData = {
  collection: Collection;
  riddles: Riddle[];
  items: CollectionRiddleDisplayItem[];
  pagination?: CollectionRiddlesPagination;
};

type LoadCollectionRiddlesForDisplayInput = {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  collectionType: CollectionType;
  page?: number;
};

async function resolveCollection(
  supabase: SupabaseClient,
  user: User | null,
  slug: string,
  collectionType: CollectionType,
): Promise<Collection | null> {
  if (collectionType === "custom") {
    if (!user) return null;
    return getUserCustomCollectionBySlug(supabase, user.id, slug);
  }

  return getCollectionBySlugAndType(supabase, slug, collectionType);
}

export async function loadCollectionRiddlesForDisplay(
  input: LoadCollectionRiddlesForDisplayInput,
): Promise<CollectionRiddlesDisplayData> {
  const { supabase, user, slug, collectionType, page } = input;
  // Volt is only for user-owned (custom) collections — not catalog /collection pages.
  const includeVoltScore = collectionType === "custom";

  // ================================================================================================
  // Getting collection informatin by its slug(params)
  // ================================================================================================
  const collection = await resolveCollection(supabase, user, slug, collectionType);
  if (!collection || !collection.isActive) {
    notFound();
  }

  // ================================================================================================
  // Getting riddles in this collection by id (paginated when page is provided)
  // ================================================================================================
  const paginate = page != null;
  const requestedPage = page ?? 1;
  let paginatedRiddles: Riddle[];
  let pagination: CollectionRiddlesPagination | undefined;

  if (paginate) {
    const totalCount = await countActiveRiddlesByCollectionId(supabase, collection.id);
    const totalPages = getCollectionRiddlesTotalPages(totalCount);
    const currentPage = clampCollectionRiddlesPage(requestedPage, totalPages);
    paginatedRiddles = await riddleRepo.findActiveByCollectionId(supabase, collection.id, {
      offset: (currentPage - 1) * COLLECTION_RIDDLES_PAGE_SIZE,
      limit: COLLECTION_RIDDLES_PAGE_SIZE,
    });
    pagination = {
      page: currentPage,
      pageSize: COLLECTION_RIDDLES_PAGE_SIZE,
      totalCount,
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
  // Getting latest attempt stats by user for a single riddle for multiple SequenceIds
  // ================================================================================================
  // Building volt scores by sequence id only for user collections when logged in
  // ================================================================================================
  // The collection may have a riddle that is based on a real GAME.
  // Riddle table has a FK of gameId.
  // If there is a game. gameIds set is created. and used for selecting from DB and creating a map.
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

  // ================================================================================================
  // Mapping attempt stats by sequence id
  // example data of mapAttemptStatsBySequenceId:
  //  "seq-aaa-111": {
  //   sequenceId: "seq-aaa-111",
  //   status: "completed",
  //   isCompleted: true,
  //   correctMoveCount: 8,
  //   wrongMoveCount: 1,
  //   hintCount: 0,
  //   maxCorrectStreak: 5,
  //   durationMs: 42000,
  // },
  // "seq-bbb-222": {
  //   sequenceId: "seq-bbb-222",
  //   status: "failed",
  //   isCompleted: false,
  //   correctMoveCount: 3,
  //   wrongMoveCount: 2,
  //   hintCount: 1,
  //   maxCorrectStreak: 2,
  //   durationMs: 18000,
  // },
  // ================================================================================================
  const mapAttemptStatsBySequenceId = buildMapAttemptStatsBySequenceId(
    getLatestAttemptStatsFromAttempts(riddleAttempts),
  );

  const voltScoresBySequenceId =
    includeVoltScore && user && riddleSequenceIds.length > 0
      ? getVoltScoresBySequenceId(
          riddleAttempts,
          paginatedRiddles.map((riddle) => ({
            sequenceId: riddle.moveSequence.id,
            totalMoveCount: getPlayerMoveCount(riddle.moveSequence.moves),
            rating: getRiddleRatingForScoring(riddle.rating),
          })),
        )
      : {};

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
        href: buildRiddlePath(riddle.id, { collectionSlug: collection.slug, collectionType }),
        displayFen: riddle.moveSequence.displayFen,
        accuracyPercent: attemptStats.accuracyPercent,
        voltScore: includeVoltScore ? (voltScoresBySequenceId[riddle.moveSequence.id] ?? null) : null,
        primaryTheme: primaryThemesByRiddleId.get(riddle.id) ?? null,
      };
    });

  return {
    collection,
    riddles: paginatedRiddles,
    items,
    pagination,
  };
}
