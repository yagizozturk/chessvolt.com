// TODO: Refactor
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import {
  getCollectionRiddleByRiddleIdAndCollectionId,
} from "@/features/collection-riddles/services/collection-riddles.service";
import {
  getCollectionBySlug,
} from "@/features/collection/services/collection.service";
import type { Collection } from "@/features/collection/types/collection";
import {
  getActiveRiddlesByCollectionId,
  getAllActiveRiddles,
  getRiddleById,
} from "@/features/riddle/services/riddle.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import { buildRiddlePath, buildStandaloneRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import { getParentCollectionUrl } from "@/features/riddle/utilities/get-parent-collection-url";
import { getUserFavouriteByUserAndRiddle } from "@/features/user-favourites/services/user-favourite.service";

export type RiddlePageData = {
  riddle: Riddle;
  nextRiddleUrl: string | null;
  parentCollectionUrl: string;
  isUserLoggedIn: boolean;
  isFavourited: boolean;
};

type LoadCollectionRiddlePageInput = {
  supabase: SupabaseClient;
  user: User | null;
  slug: string;
  riddleId: string;
};

type LoadStandaloneRiddlePageInput = {
  supabase: SupabaseClient;
  user: User | null;
  riddleId: string;
};

async function resolveCollection(
  supabase: SupabaseClient,
  slug: string,
): Promise<Collection | null> {
  return getCollectionBySlug(supabase, slug);
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

export async function loadCollectionRiddlePage(
  input: LoadCollectionRiddlePageInput,
): Promise<RiddlePageData> {
  const { supabase, user, slug, riddleId } = input;

  const collection = await resolveCollection(supabase, slug);
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
  const nextRiddleUrl = getNextRiddleUrl(riddles, riddle.id, (id) => buildRiddlePath(id, { collectionSlug: slug }));

  const favouriteRow = user
    ? await getUserFavouriteByUserAndRiddle(supabase, user.id, riddle.id)
    : null;

  return {
    riddle,
    nextRiddleUrl,
    parentCollectionUrl: getParentCollectionUrl(collection),
    isUserLoggedIn: Boolean(user),
    isFavourited: Boolean(favouriteRow),
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

  const favouriteRow = user
    ? await getUserFavouriteByUserAndRiddle(supabase, user.id, riddle.id)
    : null;

  return {
    riddle,
    nextRiddleUrl,
    parentCollectionUrl: "/riddles",
    isUserLoggedIn: Boolean(user),
    isFavourited: Boolean(favouriteRow),
  };
}
