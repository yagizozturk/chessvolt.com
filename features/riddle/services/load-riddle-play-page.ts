import type { SupabaseClient, User } from "@supabase/supabase-js";

import { buildVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import type { VoltScoreResult } from "@/components/calculator/volt-calculator/volt.types";
import { getCollectionRiddleByPair, getCollectionRiddlesByRiddleId } from "@/features/collection-riddles/services/collection-riddles.service";
import type { Collection } from "@/features/collection/types/collection";
import { getUserCustomCollections } from "@/features/collection/services/collection.service";
import type { MyCollectionOption } from "@/features/riddle/components/add-to-my-collection-picker";
import { getRiddleById, getRiddlesByCollectionId } from "@/features/riddle/services/riddle.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

export type RiddlePlayPageData = {
  riddle: Riddle;
  nextRiddleId: string | null;
  parentCollectionUrl: string;
  collectionSlug: string | null;
  voltScore: VoltScoreResult | null;
  userCanSaveToUserCollections: boolean;
  userCollections: MyCollectionOption[];
  savedUserCollectionsIds: string[];
};

type LoadRiddlePlayPageInput = {
  supabase: SupabaseClient;
  user: User | null;
  riddleId: string;
  collection: Collection | null;
};

export async function loadRiddlePlayPage({
  supabase,
  user,
  riddleId,
  collection,
}: LoadRiddlePlayPageInput): Promise<RiddlePlayPageData | null> {
  const riddle = await getRiddleById(supabase, riddleId);

  if (!riddle || !riddle.isActive) {
    return null;
  }

  if (collection) {
    const link = await getCollectionRiddleByPair(supabase, riddle.id, collection.id);
    if (!link) {
      return null;
    }
  }

  const collectionRiddles = await getCollectionRiddlesByRiddleId(supabase, riddle.id);
  const playCollectionId = collection?.id ?? null;

  const riddles = playCollectionId
    ? await getRiddlesByCollectionId(supabase, playCollectionId, { activeOnly: true })
    : [];

  const currentIndex = riddles.findIndex((item) => item.id === riddle.id);
  const nextRiddle = currentIndex >= 0 && currentIndex < riddles.length - 1 ? riddles[currentIndex + 1] : null;

  const parentCollectionUrl = collection ? `/collection/${collection.slug}` : "/collection";
  const collectionSlug = collection?.slug ?? null;

  const userCollections = user ? await getUserCustomCollections(supabase, user.id) : [];
  const userCollectionIds = new Set(userCollections.map((item) => item.id));
  const savedUserCollectionsIds = collectionRiddles
    .map((link) => link.collectionId)
    .filter((itemCollectionId) => userCollectionIds.has(itemCollectionId));

  const isInUserCustomCollection = savedUserCollectionsIds.length > 0;

  const voltScore =
    user && isInUserCustomCollection
      ? buildVoltScore({
          attempts: await attemptService.getAttemptsByUserAndSequence(supabase, user.id, riddle.moveSequence.id),
          totalMoveCount: getSequenceMoveCount(riddle.moveSequence.moves),
          rating: getRiddleRatingForScoring(riddle.rating),
        })
      : null;

  return {
    riddle,
    nextRiddleId: nextRiddle?.id ?? null,
    parentCollectionUrl,
    collectionSlug,
    voltScore,
    userCanSaveToUserCollections: Boolean(user),
    userCollections: userCollections.map((item) => ({
      id: item.id,
      title: item.title,
    })),
    savedUserCollectionsIds,
  };
}
