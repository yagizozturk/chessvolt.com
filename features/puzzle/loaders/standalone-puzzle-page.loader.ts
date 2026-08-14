import { notFound } from "next/navigation";

import { getAllActivePuzzles, getPuzzleById } from "@/features/puzzle/services/puzzle.service";
import type { PuzzlePageData, StandalonePuzzleLoaderPageProps } from "@/features/puzzle/types/puzzle-loader-page-props";
import { buildStandalonePuzzleUrl, getStandalonePuzzleBackUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import { getNextPuzzleUrl } from "@/features/puzzle/utilities/get-next-puzzle-url";
import { getFavoriteByPuzzleId } from "@/features/user-favorites/services/user-favorite.service";

// ==================================================================
// Orchestrates standalone puzzle pages (favorites / direct /puzzles/[id]).
// Theme play uses loadThemePuzzlePage instead.
// ==================================================================
export async function loadStandalonePuzzlePage(props: StandalonePuzzleLoaderPageProps): Promise<PuzzlePageData> {
  const { supabase, user, puzzleId, from } = props;

  const puzzle = await getPuzzleById(supabase, puzzleId);
  if (!puzzle || !puzzle.isActive) {
    notFound();
  }

  const nextPuzzleUrl = getNextPuzzleUrl(await getAllActivePuzzles(supabase), puzzle.id, (id) =>
    buildStandalonePuzzleUrl(id, from ? { from } : undefined),
  );

  const favoriteRow = user ? await getFavoriteByPuzzleId(supabase, user.id, puzzle.id) : null;

  return {
    puzzle,
    nextPuzzleUrl,
    backUrl: getStandalonePuzzleBackUrl(from),
    isUserLoggedIn: Boolean(user),
    isFavorited: Boolean(favoriteRow),
  };
}
