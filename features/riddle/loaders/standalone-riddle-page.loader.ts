import { notFound } from "next/navigation";

import { getAllActiveRiddles, getRiddleById } from "@/features/riddle/services/riddle.service";
import type { RiddlePageData, StandaloneRiddleLoaderPageProps } from "@/features/riddle/types/riddle-loader-page-props";
import { getNextRiddleUrl } from "@/features/riddle/utilities/get-next-riddle-url";
import { buildStandaloneRiddleUrl, getStandaloneRiddleBackUrl } from "@/features/riddle/utilities/build-riddle-url";
import { getFavoriteByRiddleId } from "@/features/user-favorites/services/user-favorite.service";

// ==================================================================
// This is a orchestration component. Helps to create standalone riddle pages
// Standalone means, riddles that user routes from /riddles page.
// They are not in a collection.
// ==================================================================
export async function loadStandaloneRiddlePage(props: StandaloneRiddleLoaderPageProps): Promise<RiddlePageData> {
  const { supabase, user, riddleId, from } = props;

  const riddle = await getRiddleById(supabase, riddleId);
  if (!riddle || !riddle.isActive) {
    notFound();
  }

  const riddles = await getAllActiveRiddles(supabase);
  const nextRiddleUrl = getNextRiddleUrl(riddles, riddle.id, (id) =>
    buildStandaloneRiddleUrl(id, from ? { from } : undefined),
  );

  const favoriteRow = user ? await getFavoriteByRiddleId(supabase, user.id, riddle.id) : null;

  return {
    riddle,
    nextRiddleUrl,
    backUrl: getStandaloneRiddleBackUrl(from),
    isUserLoggedIn: Boolean(user),
    isFavorited: Boolean(favoriteRow),
  };
}
