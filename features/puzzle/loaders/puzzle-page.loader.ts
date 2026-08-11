import { notFound } from "next/navigation";

import { getPuzzleById } from "@/features/puzzle/services/puzzle.service";
import type { PuzzleLoaderPageProps, PuzzlePageData } from "@/features/puzzle/types/puzzle-loader-page-props";
import { buildStudyPuzzleUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import { getNextPuzzleUrl } from "@/features/puzzle/utilities/get-next-puzzle-url";
import { getParentStudyUrl } from "@/features/puzzle/utilities/get-parent-study-url";
import { getActivePuzzlesByStudyId } from "@/features/study-puzzles/services/study-puzzles.service";
import { getStudyBySlug } from "@/features/study/services/study.service";
import { getFavoriteByPuzzleId } from "@/features/user-favorites/services/user-favorite.service";

// ==================================================================
// This is a orchestration component. Helps to create puzzle pages
// by calling multiple methods of different domains
// ==================================================================
export async function loadStudyPuzzlePage(props: PuzzleLoaderPageProps): Promise<PuzzlePageData> {
  const { supabase, user, slug, puzzleId } = props;

  // ==================================================================
  // Getting basic study data by Slug
  // ==================================================================
  const study = await getStudyBySlug(supabase, slug);
  if (!study || !study.isActive) {
    notFound();
  }

  // ==================================================================
  // Getting puzzle by Id
  // ==================================================================
  const puzzle = await getPuzzleById(supabase, puzzleId);
  if (!puzzle || !puzzle.isActive) {
    notFound();
  }

  // ==================================================================
  // Getting active puzzles in study by study Id in order to find
  // the next ordered puzzle so after game ends, a navigation button shows up.
  // Also confirms the puzzle belongs to this study.
  // ==================================================================
  const puzzles = await getActivePuzzlesByStudyId(supabase, study.id);
  if (!puzzles.some((item) => item.id === puzzle.id)) {
    notFound();
  }

  // ==================================================================
  // We have the current page URL. Get the next one based on sort order in the study
  // ==================================================================
  const nextPuzzleUrl = getNextPuzzleUrl(puzzles, puzzle.id, (id) => buildStudyPuzzleUrl(id, { studySlug: slug }));

  // ==================================================================
  // Check if the puzzle is favorited by the user
  // ==================================================================
  const isFavoritedPuzzle = user ? await getFavoriteByPuzzleId(supabase, user.id, puzzle.id) : null;

  return {
    puzzle,
    nextPuzzleUrl,
    backUrl: getParentStudyUrl(study),
    isUserLoggedIn: Boolean(user),
    isFavorited: Boolean(isFavoritedPuzzle),
  };
}
