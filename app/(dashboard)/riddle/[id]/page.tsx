import { notFound, redirect } from "next/navigation";

import { parseCollectionType } from "@/features/collection/types/collection-type";
import RiddleController from "@/features/riddle/components/riddle-controller";
import { getRiddlePlayPage } from "@/features/riddle/services/get-riddle-play-page";
import { buildRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ collection?: string; type?: string }>;
};

export default async function RiddlePage({ params, searchParams }: PageProps) {
  const { user, supabase } = await getPublicUser();
  const { id } = await params;
  const { collection: collectionSlug, type } = await searchParams;

  if (collectionSlug?.trim()) {
    redirect(
      buildRiddlePath(id, {
        collectionSlug: collectionSlug.trim(),
        collectionType: parseCollectionType(type) ?? "admin",
      }),
    );
  }

  const pageData = await getRiddlePlayPage({
    supabase,
    user,
    riddleId: id,
  });

  if (!pageData) {
    notFound();
  }

  return <RiddleController {...pageData} />;
}
