import { notFound } from "next/navigation";

import RiddleController from "@/features/riddle/components/riddle-controller";
import { getRiddlePlayPage } from "@/features/riddle/services/get-riddle-play-page";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function UserCollectionRiddlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getAuthenticatedUser();

  const pageData = await getRiddlePlayPage({
    supabase,
    user,
    riddleId: id,
    collectionSlug: slug,
    collectionType: "custom",
  });

  if (!pageData) {
    notFound();
  }

  return <RiddleController {...pageData} />;
}
