import { redirect } from "next/navigation";

import * as profileRepo from "@/features/profile/repository/profile.repository";
import { DEFAULT_RIDDLE_RATING } from "@/features/riddle/constants/riddle-rating.constants";
import { getFirstRandomRiddleForTheme } from "@/features/riddle/services/random-riddle-by-theme.service";
import { buildStandaloneRiddleUrl } from "@/features/riddle/utilities/build-riddle-url";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ n?: string }>;
};

// ==================================================================
// Theme play entry. Picks a rating-matched unsolved riddle, then
// redirects to the stable /riddles/[id]?theme=… URL so refreshes
// (e.g. after favouriting) cannot re-roll the board.
// Next riddle navigates here again with a nonce to pick another.
// ==================================================================
export default async function ThemeRiddlePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  await searchParams;
  const { user, supabase } = await getPublicUser();

  const targetRating = user
    ? ((await profileRepo.getProfileCurrentRating(supabase, user.id)) ?? DEFAULT_RIDDLE_RATING)
    : DEFAULT_RIDDLE_RATING;

  const riddle = await getFirstRandomRiddleForTheme(supabase, {
    themeSlug: slug,
    userId: user?.id,
    targetRating,
  });

  if (!riddle) {
    redirect("/riddles");
  }

  redirect(buildStandaloneRiddleUrl(riddle.id, { theme: slug }));
}
