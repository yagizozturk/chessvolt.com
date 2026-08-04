// TODO: Refactor
import { notFound } from "next/navigation";

import { getActiveRiddlesByStudyId } from "@/features/study-riddles/services/study-riddles.service";
import { getStudyBySlug } from "@/features/study/services/study.service";
import { getRiddleById } from "@/features/riddle/services/riddle.service";
import type {
  RiddleLoaderPageProps,
  RiddlePageData,
} from "@/features/riddle/types/riddle-loader-page-props";
import { getNextRiddleUrl } from "@/features/riddle/utilities/get-next-riddle-url";
import { getParentStudyUrl } from "@/features/riddle/utilities/get-parent-study-url";
import { buildStudyRiddleUrl } from "@/features/riddle/utilities/build-riddle-url";
import { getFavoriteByRiddleId } from "@/features/user-favorites/services/user-favorite.service";

// ==================================================================
// This is a orchestration component. Helps to create riddle pages
// by calling multiple methods of different domains
// ==================================================================
export async function loadStudyRiddlePage(props: RiddleLoaderPageProps): Promise<RiddlePageData> {
  const { supabase, user, slug, riddleId } = props;

  // ==================================================================
  // Getting basic study data by Slug
  // ==================================================================
  const study = await getStudyBySlug(supabase, slug);
  if (!study || !study.isActive) {
    notFound();
  }

  // ==================================================================
  // Getting riddle by Id
  // ==================================================================
  const riddle = await getRiddleById(supabase, riddleId);
  if (!riddle || !riddle.isActive) {
    notFound();
  }

  // ==================================================================
  // Getting active riddles in study by study Id in order to find
  // the next ordered riddle so after game ends, a navigation button shows up.
  // Also confirms the riddle belongs to this study.
  // ==================================================================
  const riddles = await getActiveRiddlesByStudyId(supabase, study.id);
  if (!riddles.some((item) => item.id === riddle.id)) {
    notFound();
  }

  // ==================================================================
  // We have the current page URL. Get the next one based on sort order in the study
  // ==================================================================
  const nextRiddleUrl = getNextRiddleUrl(riddles, riddle.id, (id) =>
    buildStudyRiddleUrl(id, { studySlug: slug }),
  );

  // ==================================================================
  // Check if the riddle is favourited by the user
  // ==================================================================
  const isFavoritedRiddle = user ? await getFavoriteByRiddleId(supabase, user.id, riddle.id) : null;

  return {
    riddle,
    nextRiddleUrl,
    backUrl: getParentStudyUrl(study),
    isUserLoggedIn: Boolean(user),
    isFavorited: Boolean(isFavoritedRiddle),
  };
}
