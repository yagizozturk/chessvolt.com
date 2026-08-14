import { notFound } from "next/navigation";

import { getActivePuzzlesByThemeId } from "@/features/puzzle-theme/services/puzzle-theme.service";
import { getPuzzleById } from "@/features/puzzle/services/puzzle.service";
import type { PuzzleLoaderPageProps, PuzzlePageData } from "@/features/puzzle/types/puzzle-loader-page-props";
import { buildThemePuzzleUrl, getParentThemeUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import { getNextPuzzleUrl } from "@/features/puzzle/utilities/get-next-puzzle-url";
import { getThemeBySlug } from "@/features/theme/services/theme.service";
import { getFavoriteByPuzzleId } from "@/features/user-favorites/services/user-favorite.service";

export async function loadThemePuzzlePage(props: PuzzleLoaderPageProps): Promise<PuzzlePageData> {
  const { supabase, user, slug, puzzleId } = props;

  const theme = await getThemeBySlug(supabase, slug);
  if (!theme || !theme.isActive) {
    notFound();
  }

  const puzzle = await getPuzzleById(supabase, puzzleId);
  if (!puzzle || !puzzle.isActive) {
    notFound();
  }

  const puzzles = await getActivePuzzlesByThemeId(supabase, theme.id);
  if (!puzzles.some((item) => item.id === puzzle.id)) {
    notFound();
  }

  const nextPuzzleUrl = getNextPuzzleUrl(puzzles, puzzle.id, (id) =>
    buildThemePuzzleUrl(id, { themeSlug: slug }),
  );

  const favoriteRow = user ? await getFavoriteByPuzzleId(supabase, user.id, puzzle.id) : null;

  return {
    puzzle,
    nextPuzzleUrl,
    backUrl: getParentThemeUrl(slug),
    isUserLoggedIn: Boolean(user),
    isFavorited: Boolean(favoriteRow),
    theme: { title: theme.title, slug: theme.slug },
  };
}
