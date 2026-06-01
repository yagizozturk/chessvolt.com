/**
 * Onboarding Option Theme Service
 *
 * Responsibility: Business logic for onboarding_option_themes join rows.
 * - Uses repository (does not touch Supabase directly)
 */

import * as onboardingOptionThemeRepo from "@/features/onboarding-option-theme/repository/onboarding-option-theme.repository";
import type {
  OnboardingOptionTheme,
  OnboardingOptionThemeWithDetails,
  OnboardingOptionThemeWithTheme,
} from "@/features/onboarding-option-theme/types/onboarding-option-theme";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getOnboardingOptionThemeById(
  supabase: SupabaseClient,
  id: string,
): Promise<OnboardingOptionTheme | null> {
  return onboardingOptionThemeRepo.findById(supabase, id);
}

export async function getOnboardingOptionThemeByIdWithDetails(
  supabase: SupabaseClient,
  id: string,
): Promise<OnboardingOptionThemeWithDetails | null> {
  return onboardingOptionThemeRepo.findByIdWithDetails(supabase, id);
}

export async function getAllOnboardingOptionThemes(supabase: SupabaseClient): Promise<OnboardingOptionTheme[]> {
  return onboardingOptionThemeRepo.findAll(supabase);
}

export async function getAllOnboardingOptionThemesWithDetails(
  supabase: SupabaseClient,
): Promise<OnboardingOptionThemeWithDetails[]> {
  return onboardingOptionThemeRepo.findAllWithDetails(supabase);
}

export async function getOnboardingOptionThemesForOption(
  supabase: SupabaseClient,
  optionId: string,
): Promise<OnboardingOptionTheme[]> {
  return onboardingOptionThemeRepo.findByOptionId(supabase, optionId);
}

export async function getOnboardingOptionThemesForOptionWithTheme(
  supabase: SupabaseClient,
  optionId: string,
): Promise<OnboardingOptionThemeWithTheme[]> {
  return onboardingOptionThemeRepo.findByOptionIdWithTheme(supabase, optionId);
}

export async function getOnboardingOptionThemesForTheme(
  supabase: SupabaseClient,
  themeId: string,
): Promise<OnboardingOptionTheme[]> {
  return onboardingOptionThemeRepo.findByThemeId(supabase, themeId);
}

export async function getOnboardingOptionThemeByPair(
  supabase: SupabaseClient,
  optionId: string,
  themeId: string,
): Promise<OnboardingOptionTheme | null> {
  return onboardingOptionThemeRepo.findByPair(supabase, optionId, themeId);
}

export async function addOnboardingOptionTheme(
  supabase: SupabaseClient,
  input: onboardingOptionThemeRepo.CreateOnboardingOptionThemeInput,
): Promise<OnboardingOptionTheme | null> {
  return onboardingOptionThemeRepo.create(supabase, input);
}

export async function addOnboardingOptionThemes(
  supabase: SupabaseClient,
  inputs: onboardingOptionThemeRepo.CreateOnboardingOptionThemeInput[],
): Promise<OnboardingOptionTheme[]> {
  return onboardingOptionThemeRepo.createMany(supabase, inputs);
}

export async function updateOnboardingOptionTheme(
  supabase: SupabaseClient,
  id: string,
  input: onboardingOptionThemeRepo.UpdateOnboardingOptionThemeInput,
): Promise<OnboardingOptionTheme | null> {
  return onboardingOptionThemeRepo.update(supabase, id, input);
}

export async function setOnboardingOptionThemesForOption(
  supabase: SupabaseClient,
  optionId: string,
  themeIds: string[],
): Promise<OnboardingOptionTheme[]> {
  return onboardingOptionThemeRepo.replaceForOption(supabase, optionId, themeIds);
}

export async function deleteOnboardingOptionTheme(supabase: SupabaseClient, id: string): Promise<boolean> {
  return onboardingOptionThemeRepo.remove(supabase, id);
}

export async function deleteOnboardingOptionThemesForOption(
  supabase: SupabaseClient,
  optionId: string,
): Promise<boolean> {
  return onboardingOptionThemeRepo.removeByOptionId(supabase, optionId);
}

export async function removeOnboardingOptionThemeLink(
  supabase: SupabaseClient,
  optionId: string,
  themeId: string,
): Promise<boolean> {
  return onboardingOptionThemeRepo.removeByPair(supabase, optionId, themeId);
}
