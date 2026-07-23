import RiddleController from "@/features/riddle/components/riddle-controller";
import { loadCollectionRiddlePage } from "@/features/riddle/loaders/riddle-page.loader";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

// ==================================================================
// Getting collection riddle details for a single riddle
// Creating collage data for RiddleController
// ==================================================================
export default async function CollectionRiddlePage({ params }: PageProps) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  // ==================================================================
  // Loader request for a single Riddle and passing data.
  // ==================================================================
  const riddleData = await loadCollectionRiddlePage({
    supabase,
    user,
    slug,
    riddleId: id,
  });

  return (
    <RiddleController
      riddle={riddleData.riddle}
      nextRiddleUrl={riddleData.nextRiddleUrl}
      backUrl={riddleData.backUrl}
      isUserLoggedIn={riddleData.isUserLoggedIn}
      isFavorited={riddleData.isFavorited}
    />
  );
}
