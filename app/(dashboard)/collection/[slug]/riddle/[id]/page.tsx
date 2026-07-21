import RiddleController from "@/features/riddle/components/riddle-controller";
import { loadCollectionRiddlePage } from "@/features/riddle/services/riddle-page.service";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function CollectionRiddlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  const pageData = await loadCollectionRiddlePage({
    supabase,
    user,
    slug,
    riddleId: id,
  });

  return <RiddleController {...pageData} />;
}
