/**
 * Onboarding Option Service
 *
 * Responsibility: Business logic for onboarding_options rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as onboardingOptionRepo from "@/features/onboarding-option/repository/onboarding-option.repository";
import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";

export async function getAllOnboardingOptions(supabase: SupabaseClient): Promise<OnboardingOption[]> {
  return onboardingOptionRepo.findAll(supabase);
}

export async function getAllOnboardingOptionsWithQuestion(
  supabase: SupabaseClient,
): Promise<OnboardingOptionWithQuestion[]> {
  return onboardingOptionRepo.findAllWithQuestion(supabase);
}

export async function getActiveOnboardingOptions(supabase: SupabaseClient): Promise<OnboardingOption[]> {
  return onboardingOptionRepo.findAllActive(supabase);
}

// ======================================================================
// Gets the active onboarding options for a question
// ======================================================================
export async function getOnboardingOptionsForQuestion(
  supabase: SupabaseClient,
  questionId: string,
  options?: { activeOnly?: boolean },
): Promise<OnboardingOption[]> {
  return onboardingOptionRepo.findByQuestionId(supabase, questionId, options);
}

export async function getOnboardingOptionsByIds(supabase: SupabaseClient, ids: string[]): Promise<OnboardingOption[]> {
  return onboardingOptionRepo.findByIds(supabase, ids);
}

export async function getOnboardingOptionById(supabase: SupabaseClient, id: string): Promise<OnboardingOption | null> {
  return onboardingOptionRepo.findById(supabase, id);
}

export async function getOnboardingOptionByIdWithQuestion(
  supabase: SupabaseClient,
  id: string,
): Promise<OnboardingOptionWithQuestion | null> {
  return onboardingOptionRepo.findByIdWithQuestion(supabase, id);
}

export async function getOnboardingOptionByQuestionAndValue(
  supabase: SupabaseClient,
  questionId: string,
  value: string,
): Promise<OnboardingOption | null> {
  return onboardingOptionRepo.findByQuestionAndValue(supabase, questionId, value);
}

export async function createOnboardingOption(
  supabase: SupabaseClient,
  input: onboardingOptionRepo.CreateOnboardingOptionInput,
): Promise<OnboardingOption | null> {
  return onboardingOptionRepo.create(supabase, input);
}

export async function updateOnboardingOption(
  supabase: SupabaseClient,
  id: string,
  input: onboardingOptionRepo.UpdateOnboardingOptionInput,
): Promise<OnboardingOption | null> {
  return onboardingOptionRepo.update(supabase, id, input);
}

export async function deleteOnboardingOption(supabase: SupabaseClient, id: string): Promise<boolean> {
  return onboardingOptionRepo.remove(supabase, id);
}

export async function deleteOnboardingOptionsForQuestion(
  supabase: SupabaseClient,
  questionId: string,
): Promise<boolean> {
  return onboardingOptionRepo.removeByQuestionId(supabase, questionId);
}
