import { notFound } from "next/navigation";

import { getCollectionById } from "@/features/collection/services/collection.service";
import RiddleController from "@/features/riddle/components/riddle-controller";
import { getRiddleCollectionsForRiddle } from "@/features/riddle-collection/services/riddle-collection.service";
import { getRiddleById, getRiddlesByCollectionId } from "@/features/riddle/services/riddle.service";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function RiddlePage({ params }: Params) {
  const { supabase } = await getPublicUser();
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

  return (
    <RiddleController
      riddle={riddle}
      nextRiddleId={nextRiddle?.id ?? null}
      parentCollectionUrl={parentCollectionUrl}
    />
  );
}
