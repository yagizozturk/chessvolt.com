// TODO: Refactor
import { notFound } from "next/navigation";

import {
  getActiveRiddlesByCollectionId,
  getCollectionRiddleByRiddleIdAndCollectionId,
} from "@/features/collection-riddles/services/collection-riddles.service";
import { getCollectionBySlug } from "@/features/collection/services/collection.service";
import { getAllActiveRiddles, getRiddleById } from "@/features/riddle/services/riddle.service";
import type { Riddle } from "@/features/riddle/types/riddle";
import type { LoadCollectionRiddlePageInput, LoadStandaloneRiddlePageInput } from "@/features/riddle/types/riddle-page";
import {
  buildRiddlePath,
  buildStandaloneRiddlePath,
  getStandaloneRiddleBackUrl,
} from "@/features/riddle/utilities/build-riddle-path";
import { getParentCollectionUrl } from "@/features/riddle/utilities/get-parent-collection-url";
import { getUserFavouriteByUserAndRiddle } from "@/features/user-favourites/services/user-favourite.service";

export type RiddlePageData = {
  riddle: Riddle;
  nextRiddleUrl: string | null;
  backUrl: string;
  isUserLoggedIn: boolean;
  isFavourited: boolean;
};

function getNextRiddleUrl(
  riddles: Riddle[],
  currentRiddleId: string,
  buildPath: (riddleId: string) => string,
): string | null {
  const currentIndex = riddles.findIndex((item) => item.id === currentRiddleId);
  const nextRiddle = currentIndex >= 0 && currentIndex < riddles.length - 1 ? riddles[currentIndex + 1] : null;
  return nextRiddle ? buildPath(nextRiddle.id) : null;
}

export async function loadCollectionRiddlePage(input: LoadCollectionRiddlePageInput): Promise<RiddlePageData> {
  const { supabase, user, slug, riddleId } = input;

  // ==================================================================
  // Getting basic collection data by Slug
  // ==================================================================
  const collection = await getCollectionBySlug(supabase, slug);
  if (!collection || !collection.isActive) {
    notFound();
  }

  // ==================================================================
  // Getting riddle by Id
  // ==================================================================
  const riddle = await getRiddleById(supabase, riddleId);
  if (!riddle || !riddle.isActive) {
    notFound();
  }

  const link = await getCollectionRiddleByRiddleIdAndCollectionId(supabase, riddle.id, collection.id);
  if (!link) {
    notFound();
  }

  // ==================================================================
  // Getting active riddles in collection by collection Id in order to find
  // the next ordered riddle so after game ends, a navigation button shows up.
  // ==================================================================
  const riddles = await getActiveRiddlesByCollectionId(supabase, collection.id);
  const nextRiddleUrl = getNextRiddleUrl(riddles, riddle.id, (id) => buildRiddlePath(id, { collectionSlug: slug }));

  const favouriteRow = user ? await getUserFavouriteByUserAndRiddle(supabase, user.id, riddle.id) : null;

  return {
    riddle,
    nextRiddleUrl,
    backUrl: getParentCollectionUrl(collection),
    isUserLoggedIn: Boolean(user),
    isFavourited: Boolean(favouriteRow),
  };
}

export async function loadStandaloneRiddlePage(input: LoadStandaloneRiddlePageInput): Promise<RiddlePageData> {
  const { supabase, user, riddleId, from } = input;

  const riddle = await getRiddleById(supabase, riddleId);
  if (!riddle || !riddle.isActive) {
    notFound();
  }

  const riddles = await getAllActiveRiddles(supabase);
  const nextRiddleUrl = getNextRiddleUrl(riddles, riddle.id, (id) =>
    buildStandaloneRiddlePath(id, from ? { from } : undefined),
  );

  const favouriteRow = user ? await getUserFavouriteByUserAndRiddle(supabase, user.id, riddle.id) : null;

  return {
    riddle,
    nextRiddleUrl,
    backUrl: getStandaloneRiddleBackUrl(from),
    isUserLoggedIn: Boolean(user),
    isFavourited: Boolean(favouriteRow),
  };
}
