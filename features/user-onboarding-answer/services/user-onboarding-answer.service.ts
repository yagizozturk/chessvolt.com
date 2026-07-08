// TODO: Refactor
/**
 * User Onboarding Answer Service
 *
 * Responsibility: Business logic for user_onboarding_answers rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as userOnboardingAnswerRepo from "@/features/user-onboarding-answer/repository/user-onboarding-answer.repository";
import type {
  ReplaceUserOnboardingAnswersInput,
  SaveUserOnboardingAnswerInput,
  UpdateUserOnboardingAnswerInput,
  UserOnboardingAnswer,
  UserOnboardingAnswerWithDetails,
} from "@/features/user-onboarding-answer/types/user-onboarding-answer";

export async function getUserOnboardingAnswerByIdWithDetails(
  supabase: SupabaseClient,
  id: string,
): Promise<UserOnboardingAnswerWithDetails | null> {
  return userOnboardingAnswerRepo.findByIdWithDetails(supabase, id);
}

export async function getAllUserOnboardingAnswersWithDetails(
  supabase: SupabaseClient,
): Promise<UserOnboardingAnswerWithDetails[]> {
  return userOnboardingAnswerRepo.findAllWithDetails(supabase);
}

export async function saveUserOnboardingAnswer(
  supabase: SupabaseClient,
  input: SaveUserOnboardingAnswerInput,
): Promise<UserOnboardingAnswer | null> {
  return userOnboardingAnswerRepo.upsert(supabase, input);
}

export async function replaceUserOnboardingAnswersForQuestion(
  supabase: SupabaseClient,
  input: ReplaceUserOnboardingAnswersInput,
): Promise<UserOnboardingAnswer[] | null> {
  return userOnboardingAnswerRepo.replaceForQuestion(supabase, input.userId, input.questionId, input.optionIds);
}

export async function updateUserOnboardingAnswer(
  supabase: SupabaseClient,
  id: string,
  input: UpdateUserOnboardingAnswerInput,
): Promise<UserOnboardingAnswer | null> {
  return userOnboardingAnswerRepo.update(supabase, id, input);
}

export async function deleteUserOnboardingAnswer(supabase: SupabaseClient, id: string): Promise<boolean> {
  return userOnboardingAnswerRepo.remove(supabase, id);
}
