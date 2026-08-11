import { notFound } from "next/navigation";

import { getAllActivePuzzles, getPuzzleById } from "@/features/puzzle/services/puzzle.service";
import type { PuzzlePageData, StandalonePuzzleLoaderPageProps } from "@/features/puzzle/types/puzzle-loader-page-props";
import {
  buildStandalonePuzzleUrl,
  buildThemePlayUrl,
  getStandalonePuzzleBackUrl,
} from "@/features/puzzle/utilities/build-puzzle-url";
import { getNextPuzzleUrl } from "@/features/puzzle/utilities/get-next-puzzle-url";
import * as themeRepo from "@/features/theme/repository/theme.repository";
import { getFavoriteByPuzzleId } from "@/features/user-favorites/services/user-favorite.service";

// ==================================================================
// This is a orchestration component. Helps to create standalone puzzle pages
// Standalone means, puzzles that user routes from /puzzles page.
// They are not in a study.
// Theme play Next reuses /puzzles/theme/[slug] (with a nonce) to pick another random puzzle.
// ==================================================================
export async function loadStandalonePuzzlePage(props: StandalonePuzzleLoaderPageProps): Promise<PuzzlePageData> {
  const { supabase, user, puzzleId, from, themeSlug } = props;

  const puzzle = await getPuzzleById(supabase, puzzleId);
  if (!puzzle || !puzzle.isActive) {
    notFound();
  }

  const theme = themeSlug ? await themeRepo.findBySlug(supabase, themeSlug) : null;

  const nextPuzzleUrl = themeSlug
    ? buildThemePlayUrl(themeSlug, { nonce: crypto.randomUUID() })
    : getNextPuzzleUrl(await getAllActivePuzzles(supabase), puzzle.id, (id) =>
        buildStandalonePuzzleUrl(id, from ? { from } : undefined),
      );

  const favoriteRow = user ? await getFavoriteByPuzzleId(supabase, user.id, puzzle.id) : null;

  return {
    puzzle,
    nextPuzzleUrl,
    backUrl: getStandalonePuzzleBackUrl(from),
    isUserLoggedIn: Boolean(user),
    isFavorited: Boolean(favoriteRow),
    theme: theme ? { title: theme.title, slug: theme.slug } : null,
  };
}
