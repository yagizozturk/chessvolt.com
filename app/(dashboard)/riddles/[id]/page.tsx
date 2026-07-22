// TODO: Refactor
import RiddleController from "@/features/riddle/components/riddle-controller";
import { loadStandaloneRiddlePage } from "@/features/riddle/services/riddle-page.service";
import { parseStandaloneRiddleSource } from "@/features/riddle/utilities/build-riddle-path";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function RiddlePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { from: fromParam } = await searchParams;
  const { user, supabase } = await getPublicUser();

  const pageData = await loadStandaloneRiddlePage({
    supabase,
    user,
    riddleId: id,
    from: parseStandaloneRiddleSource(fromParam),
  });

  return <RiddleController {...pageData} />;
}
