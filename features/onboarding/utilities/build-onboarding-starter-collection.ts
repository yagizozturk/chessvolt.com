import type { SupabaseClient } from "@supabase/supabase-js";

import { createUserCustomCollection } from "@/features/collection/services/collection.service";
import type { Collection } from "@/features/collection/types/collection";
import { getOnboardingOptionThemesByOptionIds } from "@/features/onboarding-option-theme/services/onboarding-option-theme.service";
import {
  ONBOARDING_STARTER_COLLECTION_2_SLUG,
  ONBOARDING_STARTER_COLLECTION_2_TITLE,
  ONBOARDING_STARTER_COLLECTION_COVER_COLOR,
  ONBOARDING_STARTER_COLLECTION_COVER_IMAGE,
  ONBOARDING_STARTER_COLLECTION_SLUG,
  ONBOARDING_STARTER_COLLECTION_TITLE,
} from "@/features/onboarding/constants/onboarding-starter-collection.config";
import type { CreateOnboardingStarterCollectionData } from "@/features/onboarding/types/create-onboarding-starter-collection-data";
import { resolveOnboardingThemeSlugs } from "@/features/onboarding/utilities/resolve-onboarding-theme-slugs";
import { selectOnboardingStarterRiddles } from "@/features/onboarding/utilities/select-onboarding-starter-riddles";
import { addRiddlesToCollection } from "@/features/collection-riddles/services/collection-riddles.service";
import type { Riddle } from "@/features/riddle/types/riddle";

type StarterCollectionSpec = {
  title: string;
  slug: string;
  description: string;
};

const STARTER_COLLECTION_SPECS: StarterCollectionSpec[] = [
  {
    title: ONBOARDING_STARTER_COLLECTION_TITLE,
    slug: ONBOARDING_STARTER_COLLECTION_SLUG,
    description: "Your personalized starter collection based on your onboarding answers.",
  },
  {
    title: ONBOARDING_STARTER_COLLECTION_2_TITLE,
    slug: ONBOARDING_STARTER_COLLECTION_2_SLUG,
    description: "Your second personalized starter collection based on your onboarding answers.",
  },
];

// ============================================================================
// Creates one starter collection and assigns riddles to it.
// ============================================================================
async function createStarterCollectionWithRiddles(
  supabase: SupabaseClient,
  data: { userId: string; spec: StarterCollectionSpec; riddles: Riddle[] },
): Promise<Collection | null> {
  const collection = await createUserCustomCollection(supabase, {
    title: data.spec.title,
    description: data.spec.description,
    slug: data.spec.slug,
    createdBy: data.userId,
    coverImageUrl: ONBOARDING_STARTER_COLLECTION_COVER_IMAGE,
    coverImageColor: ONBOARDING_STARTER_COLLECTION_COVER_COLOR,
  });

  if (!collection) {
    console.error("buildOnboardingStarterCollection: could not create collection", {
      userId: data.userId,
      slug: data.spec.slug,
    });
    return null;
  }

  if (data.riddles.length === 0) {
    return collection;
  }

  const links = data.riddles.map((riddle, index) => ({
    riddleId: riddle.id,
    collectionId: collection.id,
    sortOrder: index,
  }));

  const inserted = await addRiddlesToCollection(supabase, links);
  if (inserted.length !== links.length) {
    console.error("buildOnboardingStarterCollection: partial riddle assignment", {
      userId: data.userId,
      collectionId: collection.id,
      slug: data.spec.slug,
      expected: links.length,
      inserted: inserted.length,
    });
  }

  return collection;
}

// ============================================================================
// Loads Q2 themes, selects matching riddles, creates two onboarding starter
// collections with no duplicate riddles between them.
// ============================================================================
export async function buildOnboardingStarterCollection(
  supabase: SupabaseClient,
  data: Pick<CreateOnboardingStarterCollectionData, "userId" | "userRating" | "improvementGoalOptionIds">,
): Promise<{ ok: true; collections: Collection[] } | { ok: false; reason: "failed" }> {
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

  // ============================================================================
  // Select riddles for starter collection 1
  // ============================================================================
  const riddles1 = await selectOnboardingStarterRiddles(supabase, {
    themeSlugs,
    userRating: data.userRating,
  });

  // ============================================================================
  // Create starter collection 1 and assign riddles
  // ============================================================================
  const collection1 = await createStarterCollectionWithRiddles(supabase, {
    userId: data.userId,
    spec: STARTER_COLLECTION_SPECS[0],
    riddles: riddles1,
  });

  if (!collection1) {
    return { ok: false, reason: "failed" };
  }

  // ============================================================================
  // Select riddles for starter collection 2 (no overlap with collection 1)
  // ============================================================================
  const riddles2 = await selectOnboardingStarterRiddles(supabase, {
    themeSlugs,
    userRating: data.userRating,
    excludeRiddleIds: riddles1.map((riddle) => riddle.id),
  });

  // ============================================================================
  // Create starter collection 2 and assign riddles
  // ============================================================================
  const collection2 = await createStarterCollectionWithRiddles(supabase, {
    userId: data.userId,
    spec: STARTER_COLLECTION_SPECS[1],
    riddles: riddles2,
  });

  if (!collection2) {
    return { ok: false, reason: "failed" };
  }

  return { ok: true, collections: [collection1, collection2] };
}
