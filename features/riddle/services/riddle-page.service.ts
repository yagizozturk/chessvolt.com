import type { SupabaseClient, User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import {
  getCollectionRiddleByRiddleIdAndCollectionId,
  getCollectionRiddlesByRiddleId,
} from "@/features/collection-riddles/services/collection-riddles.service";
import {
  getCollectionBySlugAndType,
  getUserCollections,
  getUserCustomCollectionBySlug,
} from "@/features/collection/services/collection.service";
import type { Collection } from "@/features/collection/types/collection";
import type { CollectionType } from "@/features/collection/types/collection-type";
import {
  getActiveRiddlesByCollectionId,
  getAllActiveRiddles,
  getRiddleById,
} from "@/features/riddle/services/riddle.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { buildRiddlePath, buildStandaloneRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import { getParentCollectionUrl } from "@/features/riddle/utilities/get-parent-collection-url";

export type RiddlePageData = {
  riddle: Riddle;
  nextRiddleUrl: string | null;
  parentCollectionUrl: string;
  isUserLoggedIn: boolean;
  userCollections: { id: string; title: string }[];
  userCollectionIdsHasCurrentRiddle: string[];
};

type LoadCollectionRiddlePageInput = {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  riddleId: string;
  collectionType: CollectionType;
};

type LoadStandaloneRiddlePageInput = {
  supabase: SupabaseClient;
  user: User | null;
  riddleId: string;
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

function getNextRiddleUrl(
  riddles: Riddle[],
  currentRiddleId: string,
  buildPath: (riddleId: string) => string,
): string | null {
  const currentIndex = riddles.findIndex((item) => item.id === currentRiddleId);
  const nextRiddle = currentIndex >= 0 && currentIndex < riddles.length - 1 ? riddles[currentIndex + 1] : null;
  return nextRiddle ? buildPath(nextRiddle.id) : null;
}

async function loadUserRiddlePickerData(
  supabase: SupabaseClient,
  user: User | null,
  riddleId: string,
): Promise<Pick<RiddlePageData, "isUserLoggedIn" | "userCollections" | "userCollectionIdsHasCurrentRiddle">> {
  const [userCollections, collectionRiddles] = await Promise.all([
    user ? getUserCollections(supabase, user.id) : Promise.resolve([]),
    user ? getCollectionRiddlesByRiddleId(supabase, riddleId) : Promise.resolve([]),
  ]);

  const userCollectionIds = new Set(userCollections.map((item) => item.id));
  const userCollectionIdsHasCurrentRiddle = collectionRiddles
    .map((collectionRiddle) => collectionRiddle.collectionId)
    .filter((collectionId) => userCollectionIds.has(collectionId));

  return {
    isUserLoggedIn: Boolean(user),
    userCollections: userCollections.map((item) => ({
      id: item.id,
      title: item.title,
    })),
    userCollectionIdsHasCurrentRiddle,
  };
}

export async function loadCollectionRiddlePage(
  input: LoadCollectionRiddlePageInput,
): Promise<RiddlePageData> {
  const { supabase, user, slug, riddleId, collectionType } = input;

  const collection = await resolveCollection(supabase, user, slug, collectionType);
  if (!collection || !collection.isActive) {
    notFound();
  }

  const riddle = await getRiddleById(supabase, riddleId);
  if (!riddle || !riddle.isActive) {
    notFound();
  }

  const link = await getCollectionRiddleByRiddleIdAndCollectionId(supabase, riddle.id, collection.id);
  if (!link) {
    notFound();
  }

  const riddles = await getActiveRiddlesByCollectionId(supabase, collection.id);
  const nextRiddleUrl = getNextRiddleUrl(riddles, riddle.id, (id) =>
    buildRiddlePath(id, { collectionSlug: slug, collectionType }),
  );
  const userData = await loadUserRiddlePickerData(supabase, user, riddle.id);

  return {
    riddle,
    nextRiddleUrl,
    parentCollectionUrl: getParentCollectionUrl(collection),
    ...userData,
  };
}

export async function loadStandaloneRiddlePage(
  input: LoadStandaloneRiddlePageInput,
): Promise<RiddlePageData> {
  const { supabase, user, riddleId } = input;

  const riddle = await getRiddleById(supabase, riddleId);
  if (!riddle || !riddle.isActive) {
    notFound();
  }

  const riddles = await getAllActiveRiddles(supabase);
  const nextRiddleUrl = getNextRiddleUrl(riddles, riddle.id, buildStandaloneRiddlePath);
  const userData = await loadUserRiddlePickerData(supabase, user, riddle.id);

  return {
    riddle,
    nextRiddleUrl,
    parentCollectionUrl: "/riddles",
    ...userData,
  };
}
