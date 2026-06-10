import { notFound } from "next/navigation";

import { calculateVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import { getSequenceMoveCount } from "@/components/calculator/volt-calculator/get-sequence-move-count";
import {
  getCollectionRiddleByRiddleIdAndCollectionId,
  getCollectionRiddlesByRiddleId,
} from "@/features/collection-riddles/services/collection-riddles.service";
import { getUserCollections, getUserCustomCollectionBySlug } from "@/features/collection/services/collection.service";
import RiddleController from "@/features/riddle/components/riddle-controller";
import { getActiveRiddlesByCollectionId, getRiddleById } from "@/features/riddle/services/riddle.service";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { buildRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import { getParentCollectionUrl } from "@/features/riddle/utilities/get-parent-collection-url";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function UserCollectionRiddlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getAuthenticatedUser();

  // =============================================================================
  // Getting collection information by its slug and type
  // =============================================================================
  const collection = await getUserCustomCollectionBySlug(supabase, user.id, slug);
  if (!collection || !collection.isActive) {
    notFound();
  }

  // =============================================================================
  // Getting riddle information by its id
  // =============================================================================
  const riddle = await getRiddleById(supabase, id);
  if (!riddle || !riddle.isActive) {
    notFound();
  }

  // =============================================================================
  // Getting collection other riddles information by current riddle id and collection id
  // This checks that this riddle is linked to this collection in the collection_riddles table.
  // If there’s no join row for that riddle.id + collection.id, the page returns 404 so you
  // can’t play a riddle under a collection slug it doesn’t belong to.
  // =============================================================================
  const link = await getCollectionRiddleByRiddleIdAndCollectionId(supabase, riddle.id, collection.id);
  if (!link) {
    notFound();
  }

  // =============================================================================
  // Getting all active riddles for this collection
  // =============================================================================
  const riddles = await getActiveRiddlesByCollectionId(supabase, collection.id);
  const currentIndex = riddles.findIndex((item) => item.id === riddle.id);
  const nextRiddle = currentIndex >= 0 && currentIndex < riddles.length - 1 ? riddles[currentIndex + 1] : null;
  const nextRiddleUrl = nextRiddle
    ? buildRiddlePath(nextRiddle.id, { collectionSlug: slug, collectionType: "custom" })
    : null;

  // =============================================================================
  // Getting user collections and collection riddles by riddle id

  const [userCollections, collectionRiddles, attempts] = await Promise.all([
    getUserCollections(supabase, user.id),
    getCollectionRiddlesByRiddleId(supabase, riddle.id),
    attemptService.getAttemptsByUserAndSequence(supabase, user.id, riddle.moveSequence.id),
  ]);

  // =============================================================================
  // That tells the picker which of the user’s collections already contain this
  // riddle (including the one they’re playing from).
  // It’s the list of your custom collection IDs that already contain this riddle
  // =============================================================================
  const userCollectionIds = new Set(userCollections.map((item) => item.id));
  const userCollectionIdsHasCurrentRiddle = collectionRiddles
    .map((collectionRiddle) => collectionRiddle.collectionId)
    .filter((collectionId) => userCollectionIds.has(collectionId));

  // =============================================================================
  // Building volt score for the riddle
  // =============================================================================
  const voltScore = calculateVoltScore({
    attempts,
    totalMoveCount: getSequenceMoveCount(riddle.moveSequence.moves),
    rating: getRiddleRatingForScoring(riddle.rating),
  });

  return (
    <RiddleController
      riddle={riddle}
      nextRiddleUrl={nextRiddleUrl}
      parentCollectionUrl={getParentCollectionUrl(collection)}
      isUserLoggedIn={Boolean(user)}
      userCollections={userCollections.map((item) => ({
        id: item.id,
        title: item.title,
      }))}
      userCollectionIdsHasCurrentRiddle={userCollectionIdsHasCurrentRiddle}
      voltScore={voltScore}
    />
  );
}
