import { redirect } from "next/navigation";

import PuzzleController from "@/features/puzzle/components/puzzle-controller";
import { loadStandalonePuzzlePage } from "@/features/puzzle/loaders/standalone-puzzle-page.loader";
import {
  buildThemePuzzleUrl,
  parseStandalonePuzzleSource,
  parseStandaloneThemeSlug,
} from "@/features/puzzle/utilities/build-puzzle-url";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; theme?: string }>;
};

export default async function PuzzlePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { from: fromParam, theme: themeParam } = await searchParams;
  const themeSlug = parseStandaloneThemeSlug(themeParam);
  if (themeSlug) {
    redirect(buildThemePuzzleUrl(id, { themeSlug }));
  }

  const { user, supabase } = await getPublicUser();

  const pageData = await loadStandalonePuzzlePage({
    supabase,
    user,
    puzzleId: id,
    from: parseStandalonePuzzleSource(fromParam),
  });

  return <PuzzleController {...pageData} />;
}
