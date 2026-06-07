import type { SupabaseClient } from "@supabase/supabase-js";

import { getUserOnboardingStarterCollection } from "@/features/collection/services/collection.service";
import {
  ONBOARDING_STARTER_COLLECTION_SLUG,
  hasStarterCollection,
} from "@/features/onboarding/constants/onboarding-starter-collection.config";
import type { CreateOnboardingStarterCollectionData } from "@/features/onboarding/types/create-onboarding-starter-collection-data";
import type { ResolveStarterCollectionEligibilityResult } from "@/features/onboarding/types/resolve-starter-collection-eligibility-result";

// ============================================================================
// Checks whether a starter collection should be created for this onboarding run:
//   - declined — user picked no_i_will_choose on Q3
//   - already_exists — onboarding-starter collection already exists for the user
// ============================================================================
export async function resolveStarterCollectionEligibility(
  supabase: SupabaseClient,
  data: Pick<CreateOnboardingStarterCollectionData, "userId" | "starterCollectionOption">,
): Promise<ResolveStarterCollectionEligibilityResult> {
  // ============================================================================
  // Check if the starter collection option is accepted
  // ============================================================================
  if (!data.starterCollectionOption || !hasStarterCollection(data.starterCollectionOption)) {
    return { ok: false, reason: "declined" };
  }

  // ============================================================================
  // Check if the starter collection already exists
  // ============================================================================
  const existing = await getUserOnboardingStarterCollection(
    supabase,
    data.userId,
    ONBOARDING_STARTER_COLLECTION_SLUG,
  );

  if (existing) {
    return { ok: false, reason: "already_exists" };
  }

  return { ok: true };
}
