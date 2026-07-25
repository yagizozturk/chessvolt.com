// TODO: Refactor
import { redirect } from "next/navigation";

import * as profileRepo from "@/features/profile/repository/profile.repository";
import { DEFAULT_RIDDLE_RATING } from "@/features/riddle/constants/riddle-rating.constants";
import { getFirstRandomRiddleUrlForTheme } from "@/features/riddle/services/random-riddle-by-theme.service";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// ==================================================================
// Theme play resolver. Picks a rating-matched unsolved riddle for the
// clicked theme only, then redirects to the standalone riddle page.
// ==================================================================
export default async function RedirectThemeRiddlePage({ params }: PageProps) {
  const { slug } = await params;
  const { user, supabase } = await getPublicUser();

  const targetRating = user
    ? ((await profileRepo.getProfileCurrentRating(supabase, user.id)) ?? DEFAULT_RIDDLE_RATING)
    : DEFAULT_RIDDLE_RATING;

  const riddleUrl = await getFirstRandomRiddleUrlForTheme(supabase, {
    themeSlug: slug,
    userId: user?.id,
    targetRating,
  });

  redirect(riddleUrl ?? "/riddles");
}
