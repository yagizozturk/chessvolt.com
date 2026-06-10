import { notFound } from "next/navigation";

import { parseCollectionType } from "@/features/collection/types/collection-type";
import RiddleController from "@/features/riddle/components/riddle-controller";
import { loadRiddlePlayPage } from "@/features/riddle/services/load-riddle-play-page";
import { resolveRiddlePlayCollection } from "@/features/riddle/services/resolve-riddle-play-collection";
import { getAuthenticatedUser, getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ collection?: string; type?: string }>;
};

export default async function RiddlePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { collection: collectionSlug, type } = await searchParams;

  if (!collectionSlug?.trim()) {
    notFound();
  }

  const collectionType = parseCollectionType(type) ?? "admin";
  const { user, supabase } =
    collectionType === "custom" ? await getAuthenticatedUser() : await getPublicUser();

  const resolved = await resolveRiddlePlayCollection({
    supabase,
    user,
    collectionSlug: collectionSlug.trim(),
    collectionType,
  });

  if (!resolved) {
    notFound();
  }

  const pageData = await loadRiddlePlayPage({
    supabase,
    user,
    riddleId: id,
    collection: resolved.collection,
    parentCollectionUrl: resolved.parentCollectionUrl,
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
      collectionType={pageData.collectionType}
      userCanSaveToUserCollections={pageData.userCanSaveToUserCollections}
      userCollections={pageData.userCollections}
      savedUserCollectionsIds={pageData.savedUserCollectionsIds}
    />
  );
}
