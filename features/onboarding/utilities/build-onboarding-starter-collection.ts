import type { SupabaseClient } from "@supabase/supabase-js";

import { createUserCustomCollection } from "@/features/collection/services/collection.service";
import type { Collection } from "@/features/collection/types/collection";
import { getOnboardingOptionThemesByOptionIds } from "@/features/onboarding-option-theme/services/onboarding-option-theme.service";
import {
  ONBOARDING_STARTER_COLLECTION_COVER_COLOR,
  ONBOARDING_STARTER_COLLECTION_COVER_IMAGE,
  ONBOARDING_STARTER_COLLECTION_SLUG,
  ONBOARDING_STARTER_COLLECTION_TITLE,
} from "@/features/onboarding/constants/onboarding-starter-collection.config";
import type { CreateOnboardingStarterCollectionData } from "@/features/onboarding/types/create-onboarding-starter-collection-data";
import { resolveOnboardingThemeSlugs } from "@/features/onboarding/utilities/resolve-onboarding-theme-slugs";
import { selectOnboardingStarterRiddles } from "@/features/onboarding/utilities/select-onboarding-starter-riddles";
import { addRiddlesToCollection } from "@/features/riddle-collection/services/riddle-collection.service";

// ============================================================================
// Loads Q2 themes, selects matching riddles, creates the onboarding-starter
// collection, and assigns riddles to it.
// ============================================================================
export async function buildOnboardingStarterCollection(
  supabase: SupabaseClient,
  data: Pick<CreateOnboardingStarterCollectionData, "userId" | "userRating" | "improvementGoalOptionIds">,
): Promise<{ ok: true; collection: Collection } | { ok: false; reason: "failed" }> {
  // ============================================================================
  // Getting full theme with both id and slug
  // ============================================================================
  const optionThemes = await getOnboardingOptionThemesByOptionIds(supabase, data.improvementGoalOptionIds);

  // ============================================================================
  // Drops inactive themes and extracts slug strings for riddle queries.
  //   themeSlugs (result of resolveOnboardingThemeSlugs):
  //   ["forks", "pawn-endgames"]
  // ============================================================================
  const themeSlugs = resolveOnboardingThemeSlugs(optionThemes);

  const riddles = await selectOnboardingStarterRiddles(supabase, {
    themeSlugs,
    userRating: data.userRating,
  });

  const collection = await createUserCustomCollection(supabase, {
    title: ONBOARDING_STARTER_COLLECTION_TITLE,
    description: "Your personalized starter collection based on your onboarding answers.",
    slug: ONBOARDING_STARTER_COLLECTION_SLUG,
    createdBy: data.userId,
    coverImageUrl: ONBOARDING_STARTER_COLLECTION_COVER_IMAGE,
    coverImageColor: ONBOARDING_STARTER_COLLECTION_COVER_COLOR,
  });

  if (!collection) {
    console.error("buildOnboardingStarterCollection: could not create collection", {
      userId: data.userId,
    });
    return { ok: false, reason: "failed" };
  }

  if (riddles.length > 0) {
    const links = riddles.map((riddle, index) => ({
      riddleId: riddle.id,
      collectionId: collection.id,
      sortOrder: index,
    }));

    const inserted = await addRiddlesToCollection(supabase, links);
    if (inserted.length !== links.length) {
      console.error("buildOnboardingStarterCollection: partial riddle assignment", {
        userId: data.userId,
        collectionId: collection.id,
        expected: links.length,
        inserted: inserted.length,
      });
    }
  }

  return { ok: true, collection };
}
