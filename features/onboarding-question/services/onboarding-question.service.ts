/**
 * Onboarding Question Service
 *
 * Responsibility: Onboarding question business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */

import * as onboardingQuestionRepo from "@/features/onboarding-question/repository/onboarding-question.repository";
import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAllOnboardingQuestions(supabase: SupabaseClient): Promise<OnboardingQuestion[]> {
  return onboardingQuestionRepo.findAll(supabase);
}

export async function getActiveOnboardingQuestions(supabase: SupabaseClient): Promise<OnboardingQuestion[]> {
  return onboardingQuestionRepo.findAllActive(supabase);
}

export async function getOnboardingQuestionById(
  supabase: SupabaseClient,
  id: string,
): Promise<OnboardingQuestion | null> {
  return onboardingQuestionRepo.findById(supabase, id);
}

export async function getOnboardingQuestionBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<OnboardingQuestion | null> {
  return onboardingQuestionRepo.findBySlug(supabase, slug);
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
