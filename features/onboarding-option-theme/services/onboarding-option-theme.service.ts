/**
 * Onboarding Option Theme Service
 *
 * Responsibility: Business logic for onboarding_option_themes join rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as onboardingOptionThemeRepo from "@/features/onboarding-option-theme/repository/onboarding-option-theme.repository";
import type {
  OnboardingOptionTheme,
  OnboardingOptionThemeWithDetails,
  OnboardingOptionThemeWithTheme,
} from "@/features/onboarding-option-theme/types/onboarding-option-theme";

// ============================================================================
// Gets onboarding option themes for the given option IDs (nested theme included).
// ============================================================================
export async function getOnboardingOptionThemesByOptionIds(
  supabase: SupabaseClient,
  optionIds: string[],
): Promise<OnboardingOptionThemeWithTheme[]> {
  return onboardingOptionThemeRepo.findByOptionIds(supabase, optionIds);
}

export async function getOnboardingOptionThemeByIdWithDetails(
  supabase: SupabaseClient,
  id: string,
): Promise<OnboardingOptionThemeWithDetails | null> {
  return onboardingOptionThemeRepo.findByIdWithDetails(supabase, id);
}

export async function getAllOnboardingOptionThemesWithDetails(
  supabase: SupabaseClient,
): Promise<OnboardingOptionThemeWithDetails[]> {
  return onboardingOptionThemeRepo.findAllWithDetails(supabase);
}

export async function addOnboardingOptionTheme(
  supabase: SupabaseClient,
  input: onboardingOptionThemeRepo.CreateOnboardingOptionThemeInput,
): Promise<OnboardingOptionTheme | null> {
  return onboardingOptionThemeRepo.create(supabase, input);
}

export async function updateOnboardingOptionTheme(
  supabase: SupabaseClient,
  id: string,
  input: onboardingOptionThemeRepo.UpdateOnboardingOptionThemeInput,
): Promise<OnboardingOptionTheme | null> {
  return onboardingOptionThemeRepo.update(supabase, id, input);
}

export async function deleteOnboardingOptionTheme(supabase: SupabaseClient, id: string): Promise<boolean> {
  return onboardingOptionThemeRepo.remove(supabase, id);
}
