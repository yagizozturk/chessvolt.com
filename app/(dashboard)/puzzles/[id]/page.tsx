import PuzzleController from "@/features/puzzle/components/puzzle-controller";
import { loadPuzzlePage } from "@/features/puzzle/loaders/puzzle-page.loader";
import { parseStandalonePuzzleSource } from "@/features/puzzle/utilities/build-puzzle-url";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function PuzzlePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { from: fromParam } = await searchParams;
  const { user, supabase } = await getPublicUser();

  const pageData = await loadPuzzlePage({
    supabase,
    user,
    puzzleId: id,
    from: parseStandalonePuzzleSource(fromParam),
  });

  return <PuzzleController {...pageData} />;
}
