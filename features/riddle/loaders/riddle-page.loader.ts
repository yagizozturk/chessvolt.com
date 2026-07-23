// TODO: Refactor
import { notFound } from "next/navigation";

import { getActiveRiddlesByCollectionId } from "@/features/collection-riddles/services/collection-riddles.service";
import { getCollectionBySlug } from "@/features/collection/services/collection.service";
import { getRiddleById } from "@/features/riddle/services/riddle.service";
import type {
  RiddleLoaderPageProps,
  RiddlePageData,
} from "@/features/riddle/types/riddle-loader-page-props";
import { getNextRiddleUrl } from "@/features/riddle/utilities/get-next-riddle-url";
import { getParentCollectionUrl } from "@/features/riddle/utilities/get-parent-collection-url";
import { buildCollectionRiddleUrl } from "@/features/riddle/utilities/build-riddle-url";
import { getFavoriteByRiddleId } from "@/features/user-favorites/services/user-favorite.service";

// ==================================================================
// This is a orchestration component. Helps to create riddle pages
// by calling multiple methods of different domains
// ==================================================================
export async function loadCollectionRiddlePage(props: RiddleLoaderPageProps): Promise<RiddlePageData> {
  const { supabase, user, slug, riddleId } = props;

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

  // ==================================================================
  // Getting active riddles in collection by collection Id in order to find
  // the next ordered riddle so after game ends, a navigation button shows up.
  // Also confirms the riddle belongs to this collection.
  // ==================================================================
  const riddles = await getActiveRiddlesByCollectionId(supabase, collection.id);
  if (!riddles.some((item) => item.id === riddle.id)) {
    notFound();
  }

  // ==================================================================
  // We have the current page URL. Get the next one based on sort order in the collection
  // ==================================================================
  const nextRiddleUrl = getNextRiddleUrl(riddles, riddle.id, (id) =>
    buildCollectionRiddleUrl(id, { collectionSlug: slug }),
  );

  // ==================================================================
  // Check if the riddle is favourited by the user
  // ==================================================================
  const isFavoritedRiddle = user ? await getFavoriteByRiddleId(supabase, user.id, riddle.id) : null;

  return {
    riddle,
    nextRiddleUrl,
    backUrl: getParentCollectionUrl(collection),
    isUserLoggedIn: Boolean(user),
    isFavorited: Boolean(isFavoritedRiddle),
  };
}
