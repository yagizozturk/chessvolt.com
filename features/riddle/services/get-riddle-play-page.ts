import type { SupabaseClient, User } from "@supabase/supabase-js";

import { calculateVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import {
  getCollectionRiddleByRiddleIdAndCollectionId,
  getCollectionRiddlesByRiddleId,
} from "@/features/collection-riddles/services/collection-riddles.service";
import {
  getCollectionBySlug,
  getUserCustomCollectionBySlug,
  getUserCustomCollections,
} from "@/features/collection/services/collection.service";
import type { Collection } from "@/features/collection/types/collection";
import type { CollectionType } from "@/features/collection/types/collection-type";
import type { MyCollectionOption } from "@/features/riddle/components/add-to-my-collection-picker";
import { getRiddleById, getActiveRiddlesByCollectionId } from "@/features/riddle/services/riddle.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { getParentCollectionUrl } from "@/features/riddle/utilities/get-parent-collection-url";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

export type RiddlePlayPageData = {
  riddle: Riddle;
  nextRiddleId: string | null;
  parentCollectionUrl: string;
  collectionSlug: string | null;
  collectionType: CollectionType | null;
  voltScore: VoltScoreResult | null;
  userCanSaveToUserCollections: boolean;
  userCollections: MyCollectionOption[];
  savedUserCollectionsIds: string[];
};

export type GetRiddlePlayPageInput = {
  supabase: SupabaseClient;
  user: User | null;
  riddleId: string;
  collectionSlug?: string;
  collectionType?: CollectionType;
};

async function resolvePlayCollection({
  supabase,
  user,
  collectionSlug,
  collectionType,
}: {
  supabase: SupabaseClient;
  user: User | null;
  collectionSlug: string;
  collectionType: CollectionType;
}): Promise<Collection | null> {
  if (collectionType === "custom") {
    if (!user) {
      return null;
    }

    return getUserCustomCollectionBySlug(supabase, user.id, collectionSlug);
  }

  const collection = await getCollectionBySlug(supabase, collectionSlug);
  if (!collection || !collection.isActive) {
    return null;
  }

  return collection;
}

export async function getRiddlePlayPage({
  supabase,
  user,
  riddleId,
  collectionSlug,
  collectionType,
}: GetRiddlePlayPageInput): Promise<RiddlePlayPageData | null> {
  let collection: Collection | null = null;
  let parentCollectionUrl = "/";

  if (collectionSlug && collectionType) {
    collection = await resolvePlayCollection({ supabase, user, collectionSlug, collectionType });
    if (!collection) {
      return null;
    }

    parentCollectionUrl = getParentCollectionUrl(collection);
  }

  const riddle = await getRiddleById(supabase, riddleId);
  if (!riddle || !riddle.isActive) {
    return null;
  }

  if (collection) {
    const link = await getCollectionRiddleByRiddleIdAndCollectionId(supabase, riddle.id, collection.id);
    if (!link) {
      return null;
    }
  }

  const playCollectionId = collection?.id ?? null;

  const [riddles, collectionRiddles, userCollections, attempts] = await Promise.all([
    playCollectionId ? getActiveRiddlesByCollectionId(supabase, playCollectionId) : Promise.resolve([]),
    getCollectionRiddlesByRiddleId(supabase, riddle.id),
    user ? getUserCustomCollections(supabase, user.id) : Promise.resolve([]),
    user
      ? attemptService.getAttemptsByUserAndSequence(supabase, user.id, riddle.moveSequence.id)
      : Promise.resolve([]),
  ]);

  const currentIndex = riddles.findIndex((item) => item.id === riddle.id);
  const nextRiddle = currentIndex >= 0 && currentIndex < riddles.length - 1 ? riddles[currentIndex + 1] : null;

  const userCollectionIds = new Set(userCollections.map((item) => item.id));
  const savedUserCollectionsIds = collectionRiddles
    .map((link) => link.collectionId)
    .filter((itemCollectionId) => userCollectionIds.has(itemCollectionId));

  const voltScore = user
    ? calculateVoltScore({
        attempts,
        totalMoveCount: getSequenceMoveCount(riddle.moveSequence.moves),
        rating: getRiddleRatingForScoring(riddle.rating),
      })
    : null;

  return {
    riddle,
    nextRiddleId: nextRiddle?.id ?? null,
    parentCollectionUrl,
    collectionSlug: collection?.slug ?? null,
    collectionType: collection?.collectionType ?? null,
    voltScore,
    userCanSaveToUserCollections: Boolean(user),
    userCollections: userCollections.map((item) => ({
      id: item.id,
      title: item.title,
    })),
    savedUserCollectionsIds,
  };
}
