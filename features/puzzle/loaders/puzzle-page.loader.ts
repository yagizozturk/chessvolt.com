import { notFound } from "next/navigation";

import { getPuzzleById, getRandomActivePuzzleId } from "@/features/puzzle/services/puzzle.service";
import type { PuzzlePageData, StandalonePuzzleLoaderPageProps } from "@/features/puzzle/types/puzzle-loader-page-props";
import { buildStandalonePuzzleUrl, getStandalonePuzzleBackUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import { getNextPuzzleUrl } from "@/features/puzzle/utilities/get-next-puzzle-url";
import {
  getFavoriteByPuzzleId,
  getOrderedActiveFavoritePuzzleIds,
} from "@/features/user-favorites/services/user-favorite.service";

// ================================================================================================
// PuzzleId page.tsx de çekilip buraya yollanır props olarak. Puzzle çekilir.
// ================================================================================================
export async function loadPuzzlePage(props: StandalonePuzzleLoaderPageProps): Promise<PuzzlePageData> {
  const { supabase, user, puzzleId, from } = props;

  // ================================================================================================
  // Puzzle çekilir.
  // ================================================================================================
  const puzzle = await getPuzzleById(supabase, puzzleId);
  if (!puzzle || !puzzle.isActive) {
    notFound();
  }

  // ================================================================================================
  // Next puzzleUrl çekilir.
  // Favorilerden geliyorsa, onun sırasına göre voltTracker daki bir sonrakine gider.
  // from="puzzles" gibi senaryoda random bir tane daha yükler.
  // activePuzzleIdtoExlude: ekranda aktif olan mevcut puzzle.
  // ================================================================================================
  let nextPuzzleUrl: string | null = null;
  if (from === "favorites") {
    // Favorilen puzzle ların idsini çekilir. Pinned ler önce sonra newest. Sırayla gitmek için
    const favoritePuzzleIds = user ? await getOrderedActiveFavoritePuzzleIds(supabase, user.id) : [];
    // Mevcut index i bilip, tüm sırayaı bilip bir sonraki puzzle ın URL ini getireceğiz.
    nextPuzzleUrl = getNextPuzzleUrl(
      favoritePuzzleIds.map((id) => ({ id })),
      puzzle.id,
      (id) => buildStandalonePuzzleUrl(id, { from: "favorites" }),
    );
  } else {
    // from="puzzles" ya da direk puzzles/[id] hardcoded şekilde.
    const nextPuzzleId = await getRandomActivePuzzleId(supabase, {
      userId: user?.id,
      activePuzzleIdtoExlude: puzzle.id,
    });
    if (nextPuzzleId) {
      nextPuzzleUrl = buildStandalonePuzzleUrl(nextPuzzleId, from === "puzzles" ? { from: "puzzles" } : undefined);
    }
  }

  const isFavoritedPuzzle = user ? await getFavoriteByPuzzleId(supabase, user.id, puzzle.id) : null;

  return {
    puzzle,
    nextPuzzleUrl,
    backUrl: getStandalonePuzzleBackUrl(from),
    isUserLoggedIn: Boolean(user),
    isFavorited: Boolean(isFavoritedPuzzle),
  };
}
