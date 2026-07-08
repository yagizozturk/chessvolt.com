// TODO: Refactor
import type { SupabaseClient } from "@supabase/supabase-js";

import * as onboardingQuestionRepo from "@/features/onboarding-question/repository/onboarding-question.repository";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

// ======================================================================
// General Note:
// | null is used like <OnboardingQuestion | null> because findById, uses .maybeSingle():
// a lookup by Id can find nothing
// null means either no row or DB error.
// ======================================================================

// ======================================================================
// Gets all onboarding questions
// ======================================================================
export async function getAllOnboardingQuestions(supabase: SupabaseClient): Promise<OnboardingQuestion[]> {
  return onboardingQuestionRepo.findAll(supabase);
}

// ======================================================================
// Gets the active onboarding questions
// ======================================================================
export async function getActiveOnboardingQuestions(supabase: SupabaseClient): Promise<OnboardingQuestion[]> {
  return onboardingQuestionRepo.findAllActive(supabase);
}

// ======================================================================
// Gets an onboarding question by its ID
// ======================================================================
export async function getOnboardingQuestionById(
  supabase: SupabaseClient,
  id: string,
): Promise<OnboardingQuestion | null> {
  return onboardingQuestionRepo.findById(supabase, id);
}

export async function createOnboardingQuestion(
  supabase: SupabaseClient,
  input: onboardingQuestionRepo.CreateOnboardingQuestionInput,
): Promise<OnboardingQuestion | null> {
  return onboardingQuestionRepo.create(supabase, input);
}

export async function updateOnboardingQuestion(
  supabase: SupabaseClient,
  id: string,
  input: onboardingQuestionRepo.UpdateOnboardingQuestionInput,
): Promise<OnboardingQuestion | null> {
  return onboardingQuestionRepo.update(supabase, id, input);
}

export async function deleteOnboardingQuestion(supabase: SupabaseClient, id: string): Promise<boolean> {
  return onboardingQuestionRepo.remove(supabase, id);
}
