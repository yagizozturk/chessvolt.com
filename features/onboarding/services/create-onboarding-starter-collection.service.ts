import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateOnboardingStarterCollectionData } from "@/features/onboarding/types/create-onboarding-starter-collection-data";
import type { CreateOnboardingStarterCollectionResult } from "@/features/onboarding/types/create-onboarding-starter-collection-result";
import { buildOnboardingStarterCollection } from "@/features/onboarding/utilities/build-onboarding-starter-collection";
import { resolveStarterCollectionEligibility } from "@/features/onboarding/utilities/resolve-starter-collection-eligibility";

// ============================================================================
// Create Onboarding Starter Collection
//
// Orchestrates starter collection creation after onboarding:
//   1. resolveStarterCollectionEligibility — should we create one?
//   2. buildOnboardingStarterCollection — themes, riddles, collection, assignment
// ============================================================================
export async function createOnboardingStarterCollection(
  supabase: SupabaseClient,
  data: CreateOnboardingStarterCollectionData,
): Promise<CreateOnboardingStarterCollectionResult> {
  // ============================================================================
  // Resolve starter collection eligibility
  // ============================================================================
  const eligibility = await resolveStarterCollectionEligibility(supabase, data);
  if (!eligibility.ok) {
    return { created: false, reason: eligibility.reason };
  }

  // ============================================================================
  // Build starter collection
  // ============================================================================
  const built = await buildOnboardingStarterCollection(supabase, data);
  if (!built.ok) {
    return { created: false, reason: built.reason };
  }

  // ============================================================================
  // Return the created starter collection
  // ============================================================================
  return { created: true, collections: built.collections };
}
