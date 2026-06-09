import { notFound } from "next/navigation";

import { getCollectionBySlug } from "@/features/collection/services/collection.service";
import RiddleController from "@/features/riddle/components/riddle-controller";
import { loadRiddlePlayPage } from "@/features/riddle/services/load-riddle-play-page";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function CollectionRiddlePage({ params }: Params) {
  const { user, supabase } = await getPublicUser();
  const { slug, id } = await params;

  const collection = await getCollectionBySlug(supabase, slug);
  if (!collection || !collection.isActive) {
    notFound();
  }

  const pageData = await loadRiddlePlayPage({
    supabase,
    user,
    riddleId: id,
    collection,
  });

  if (!pageData) {
    notFound();
  }

  return (
    <RiddleController
      riddle={pageData.riddle}
      voltScore={pageData.voltScore}
      nextRiddleId={pageData.nextRiddleId}
      parentCollectionUrl={pageData.parentCollectionUrl}
      collectionSlug={pageData.collectionSlug}
      userCanSaveToUserCollections={pageData.userCanSaveToUserCollections}
      userCollections={pageData.userCollections}
      savedUserCollectionsIds={pageData.savedUserCollectionsIds}
    />
  );
}
