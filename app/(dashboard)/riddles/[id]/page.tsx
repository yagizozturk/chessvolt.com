import RiddleController from "@/features/riddle/components/riddle-controller";
import { loadStandaloneRiddlePage } from "@/features/riddle/services/riddle-page.service";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RiddlePage({ params }: PageProps) {
  const { id } = await params;
  const { user, supabase } = await getPublicUser();

  const pageData = await loadStandaloneRiddlePage({
    supabase,
    user,
    riddleId: id,
  });

  return <RiddleController {...pageData} />;
}
