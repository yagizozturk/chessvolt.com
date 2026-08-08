import { redirect } from "next/navigation";

import * as profileRepo from "@/features/profile/repository/profile.repository";
import { DEFAULT_PUZZLE_RATING } from "@/features/puzzle/constants/puzzle-rating.constants";
import { getFirstRandomPuzzleForTheme } from "@/features/puzzle/services/random-puzzle-by-theme.service";
import { buildStandalonePuzzleUrl } from "@/features/puzzle/utilities/build-puzzle-url";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ n?: string }>;
};

// ==================================================================
// Theme play entry. Picks a rating-matched unsolved puzzle, then
// redirects to the stable /puzzles/[id]?theme=… URL so refreshes
// (e.g. after favouriting) cannot re-roll the board.
// Next puzzle navigates here again with a nonce to pick another.
// ==================================================================
export default async function ThemePuzzlePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  await searchParams;
  const { user, supabase } = await getPublicUser();

  const targetRating = user
    ? ((await profileRepo.getProfileCurrentRating(supabase, user.id)) ?? DEFAULT_PUZZLE_RATING)
    : DEFAULT_PUZZLE_RATING;

  const puzzle = await getFirstRandomPuzzleForTheme(supabase, {
    themeSlug: slug,
    userId: user?.id,
    targetRating,
  });

  if (!puzzle) {
    redirect("/puzzles");
  }

  redirect(buildStandalonePuzzleUrl(puzzle.id, { theme: slug }));
}
