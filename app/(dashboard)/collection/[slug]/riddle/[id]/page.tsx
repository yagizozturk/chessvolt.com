import { notFound } from "next/navigation";

import RiddleController from "@/features/riddle/components/riddle-controller";
import { getRiddlePlayPage } from "@/features/riddle/services/get-riddle-play-page";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function CollectionRiddlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  const pageData = await getRiddlePlayPage({
    supabase,
    user,
    riddleId: id,
    collectionSlug: slug,
    collectionType: "admin",
  });

  if (!pageData) {
    notFound();
  }

  return <RiddleController {...pageData} />;
}
