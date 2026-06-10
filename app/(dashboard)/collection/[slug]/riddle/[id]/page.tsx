import { notFound } from "next/navigation";

import { getCollectionRiddleByRiddleIdAndCollectionId } from "@/features/collection-riddles/services/collection-riddles.service";
import { getCollectionBySlugAndType } from "@/features/collection/services/collection.service";
import RiddleController from "@/features/riddle/components/riddle-controller";
import { getActiveRiddlesByCollectionId, getRiddleById } from "@/features/riddle/services/riddle.service";
import { buildRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import { getParentCollectionUrl } from "@/features/riddle/utilities/get-parent-collection-url";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function CollectionRiddlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  // =============================================================================
  // Getting collection information by its slug and type
  // =============================================================================
  const collection = await getCollectionBySlugAndType(supabase, slug, "admin");
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
    ? buildRiddlePath(nextRiddle.id, { collectionSlug: slug, collectionType: "admin" })
    : null;

  return (
    <RiddleController
      riddle={riddle}
      nextRiddleUrl={nextRiddleUrl}
      parentCollectionUrl={getParentCollectionUrl(collection)}
      isUserLoggedIn={Boolean(user)}
    />
  );
}
