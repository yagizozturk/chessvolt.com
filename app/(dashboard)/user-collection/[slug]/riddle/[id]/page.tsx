import RiddleController from "@/features/riddle/components/riddle-controller";
import { loadCollectionRiddlePage } from "@/features/riddle/services/riddle-page.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function UserCollectionRiddlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getAuthenticatedUser();

  const pageData = await loadCollectionRiddlePage({
    supabase,
    user,
    slug,
    riddleId: id,
    collectionType: "custom",
  });

  return <RiddleController {...pageData} />;
}
