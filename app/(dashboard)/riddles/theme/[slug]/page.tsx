import { redirect } from "next/navigation";

import * as profileRepo from "@/features/profile/repository/profile.repository";
import RiddleController from "@/features/riddle/components/riddle-controller";
import { DEFAULT_RIDDLE_RATING } from "@/features/riddle/constants/riddle-rating.constants";
import { getFirstRandomRiddleForTheme } from "@/features/riddle/services/random-riddle-by-theme.service";
import { buildThemePlayUrl } from "@/features/riddle/utilities/build-riddle-url";
import { getFavoriteByRiddleId } from "@/features/user-favorites/services/user-favorite.service";
import { getPublicUser } from "@/lib/supabase/auth";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ n?: string }>;
};

// ==================================================================
// Theme play page. Picks a rating-matched unsolved riddle for the
// clicked theme and renders it. Next navigates here again with a nonce.
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

  const isFavorited = user ? await getFavoriteByRiddleId(supabase, user.id, riddle.id) : null;

  return (
    <RiddleController
      key={riddle.id}
      riddle={riddle}
      nextRiddleUrl={buildThemePlayUrl(slug, { nonce: crypto.randomUUID() })}
      backUrl="/riddles"
      isUserLoggedIn={Boolean(user)}
      isFavorited={Boolean(isFavorited)}
    />
  );
}
