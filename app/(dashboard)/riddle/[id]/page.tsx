import { notFound } from "next/navigation";

import { buildVoltScore } from "@/components/calculator/volt-calculator/build-volt-score";
import { getRiddleRatingForScoring } from "@/features/riddle/types/riddle-rating";
import { getCollectionById, getMyCustomCollections } from "@/features/collection/services/collection.service";
import RiddleController from "@/features/riddle/components/riddle-controller";
import { getRiddleCollectionsForRiddle } from "@/features/riddle-collection/services/riddle-collection.service";
import { getRiddleById, getRiddlesByCollectionId } from "@/features/riddle/services/riddle.service";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { getPublicUser } from "@/lib/supabase/auth";

function getSequenceMoveCount(moves: string): number {
  return moves
    .trim()
    .split(/\s+/)
    .filter((move) => move.length > 0).length;
}

type Params = {
  params: Promise<{ id: string }>;
};

export default async function RiddlePage({ params }: Params) {
  const { user, supabase } = await getPublicUser();
  const { id } = await params;
  const riddle = await getRiddleById(supabase, id);

  if (!riddle || !riddle.isActive) {
    notFound();
  }

  const riddleCollections = await getRiddleCollectionsForRiddle(supabase, riddle.id);
  const primaryCollectionId = riddleCollections[0]?.collectionId ?? null;
  const primaryCollection = primaryCollectionId
    ? await getCollectionById(supabase, primaryCollectionId)
    : null;

  const riddles = primaryCollectionId
    ? await getRiddlesByCollectionId(supabase, primaryCollectionId, { activeOnly: true })
    : [];

  const currentIndex = riddles.findIndex((r) => r.id === riddle.id);
  const nextRiddle =
    currentIndex >= 0 && currentIndex < riddles.length - 1 ? riddles[currentIndex + 1] : null;

  const parentCollectionUrl = primaryCollection ? `/collection/${primaryCollection.slug}` : "/collection";

  const myCollections = user ? await getMyCustomCollections(supabase, user.id) : [];
  const myCollectionIds = new Set(myCollections.map((collection) => collection.id));
  const savedMyCollectionIds = riddleCollections
    .map((link) => link.collectionId)
    .filter((collectionId) => myCollectionIds.has(collectionId));

  const voltScore = user
    ? buildVoltScore({
        attempts: await attemptService.getAttemptsByUserAndSequence(
          supabase,
          user.id,
          riddle.moveSequence.id,
        ),
        totalMoveCount: getSequenceMoveCount(riddle.moveSequence.moves),
        rating: getRiddleRatingForScoring(riddle.rating),
      })
    : null;

  return (
    <RiddleController
      riddle={riddle}
      voltScore={voltScore}
      nextRiddleId={nextRiddle?.id ?? null}
      parentCollectionUrl={parentCollectionUrl}
      canSaveToMyCollections={Boolean(user)}
      myCollections={myCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
      }))}
      savedMyCollectionIds={savedMyCollectionIds}
    />
  );
}
