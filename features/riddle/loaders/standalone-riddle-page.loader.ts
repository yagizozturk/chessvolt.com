import { notFound } from "next/navigation";

import { getAllActiveRiddles, getRiddleById } from "@/features/riddle/services/riddle.service";
import type { RiddlePageData, StandaloneRiddleLoaderPageProps } from "@/features/riddle/types/riddle-loader-page-props";
import {
  buildStandaloneRiddleUrl,
  buildThemePlayUrl,
  getStandaloneRiddleBackUrl,
} from "@/features/riddle/utilities/build-riddle-url";
import { getNextRiddleUrl } from "@/features/riddle/utilities/get-next-riddle-url";
import { getFavoriteByRiddleId } from "@/features/user-favorites/services/user-favorite.service";

// ==================================================================
// This is a orchestration component. Helps to create standalone riddle pages
// Standalone means, riddles that user routes from /riddles page.
// They are not in a study.
// Theme play Next reuses /riddles/theme/[slug] (with a nonce) to pick another random riddle.
// ==================================================================
export async function loadStandaloneRiddlePage(props: StandaloneRiddleLoaderPageProps): Promise<RiddlePageData> {
  const { supabase, user, riddleId, from, themeSlug } = props;

  const riddle = await getRiddleById(supabase, riddleId);
  if (!riddle || !riddle.isActive) {
    notFound();
  }

  const nextRiddleUrl = themeSlug
    ? buildThemePlayUrl(themeSlug, { nonce: crypto.randomUUID() })
    : getNextRiddleUrl(await getAllActiveRiddles(supabase), riddle.id, (id) =>
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
