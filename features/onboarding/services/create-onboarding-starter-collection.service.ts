/**
 * Create Onboarding Starter Collection Service
 *
 * After onboarding, creates a personalized custom collection from the Q3 answer
 * and fills it with riddles matching Q2 themes and the user's onboarding rating.
 */

import {
  ONBOARDING_STARTER_COLLECTION_COVER_COLOR,
  ONBOARDING_STARTER_COLLECTION_COVER_IMAGE,
  ONBOARDING_STARTER_COLLECTION_SLUG,
} from "@/features/onboarding/constants/onboarding-starter-collection.config";
import { ONBOARDING_QUESTION_SLUG } from "@/features/onboarding/constants/onboarding-questions";
import { selectOnboardingStarterRiddles } from "@/features/onboarding/lib/select-onboarding-starter-riddles";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import {
  createMyCustomCollection,
  getOnboardingStarterCollectionForUser,
} from "@/features/collection/services/collection.service";
import type { Collection } from "@/features/collection/types/collection";
import { getOnboardingOptionThemesForOptionsWithTheme } from "@/features/onboarding-option-theme/services/onboarding-option-theme.service";
import { addRiddlesToCollection } from "@/features/riddle-collection/services/riddle-collection.service";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CreateOnboardingStarterCollectionInput = {
  userId: string;
  userRating: number;
  activeQuestions: OnboardingQuestion[];
  improvementGoalOptionIds: string[];
  starterCollectionOption: OnboardingOption | null;
};

export type CreateOnboardingStarterCollectionResult =
  | { created: true; collection: Collection }
  | { created: false; reason: "skipped" | "already_exists" | "no_starter_question" | "failed" };

function resolveThemeSlugs(
  links: Awaited<ReturnType<typeof getOnboardingOptionThemesForOptionsWithTheme>>,
): string[] {
  const slugs = new Set<string>();

  for (const link of links) {
    if (link.theme.isActive) {
      slugs.add(link.theme.slug);
    }
  }

  return [...slugs];
}

export async function createOnboardingStarterCollection(
  supabase: SupabaseClient,
  input: CreateOnboardingStarterCollectionInput,
): Promise<CreateOnboardingStarterCollectionResult> {
  const starterQuestion = input.activeQuestions.find(
    (question) => question.slug === ONBOARDING_QUESTION_SLUG.starterCollection,
  );

  if (!starterQuestion) {
    return { created: false, reason: "no_starter_question" };
  }

  if (!input.starterCollectionOption) {
    return { created: false, reason: "skipped" };
  }

  const existing = await getOnboardingStarterCollectionForUser(
    supabase,
    input.userId,
    ONBOARDING_STARTER_COLLECTION_SLUG,
  );

  if (existing) {
    return { created: false, reason: "already_exists" };
  }

  const themeLinks = await getOnboardingOptionThemesForOptionsWithTheme(
    supabase,
    input.improvementGoalOptionIds,
  );
  const themeSlugs = resolveThemeSlugs(themeLinks);

  const riddles = await selectOnboardingStarterRiddles(supabase, {
    themeSlugs,
    userRating: input.userRating,
  });

  const title = input.starterCollectionOption.label.trim();
  const description =
    input.starterCollectionOption.description?.trim() ||
    "Your personalized starter collection based on your onboarding answers.";

  const collection = await createMyCustomCollection(supabase, {
    title,
    description,
    slug: ONBOARDING_STARTER_COLLECTION_SLUG,
    createdBy: input.userId,
    coverImageUrl: ONBOARDING_STARTER_COLLECTION_COVER_IMAGE,
    coverImageColor: ONBOARDING_STARTER_COLLECTION_COVER_COLOR,
  });

  if (!collection) {
    console.error("createOnboardingStarterCollection: could not create collection", {
      userId: input.userId,
    });
    return { created: false, reason: "failed" };
  }

  if (riddles.length > 0) {
    const links = riddles.map((riddle, index) => ({
      riddleId: riddle.id,
      collectionId: collection.id,
      sortOrder: index,
    }));

    const inserted = await addRiddlesToCollection(supabase, links);
    if (inserted.length !== links.length) {
      console.error("createOnboardingStarterCollection: partial riddle assignment", {
        userId: input.userId,
        collectionId: collection.id,
        expected: links.length,
        inserted: inserted.length,
      });
    }
  }

  return { created: true, collection };
}
