/**
 * User Onboarding Answer Service
 *
 * Responsibility: Business logic for user_onboarding_answers rows.
 * - Uses repository (does not touch Supabase directly)
 */

import * as userOnboardingAnswerRepo from "@/features/user-onboarding-answer/repository/user-onboarding-answer.repository";
import type {
  SaveUserOnboardingAnswerInput,
  UpdateUserOnboardingAnswerInput,
  UserOnboardingAnswer,
  UserOnboardingAnswerWithDetails,
} from "@/features/user-onboarding-answer/types/user-onboarding-answer";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getUserOnboardingAnswerById(
  supabase: SupabaseClient,
  id: string,
): Promise<UserOnboardingAnswer | null> {
  return userOnboardingAnswerRepo.findById(supabase, id);
}

export async function getUserOnboardingAnswerByIdWithDetails(
  supabase: SupabaseClient,
  id: string,
): Promise<UserOnboardingAnswerWithDetails | null> {
  return userOnboardingAnswerRepo.findByIdWithDetails(supabase, id);
}

export async function getAllUserOnboardingAnswers(supabase: SupabaseClient): Promise<UserOnboardingAnswer[]> {
  return userOnboardingAnswerRepo.findAll(supabase);
}

export async function getAllUserOnboardingAnswersWithDetails(
  supabase: SupabaseClient,
): Promise<UserOnboardingAnswerWithDetails[]> {
  return userOnboardingAnswerRepo.findAllWithDetails(supabase);
}

export async function getUserOnboardingAnswersForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserOnboardingAnswer[]> {
  return userOnboardingAnswerRepo.findByUserId(supabase, userId);
}

export async function getUserOnboardingAnswersForUserWithDetails(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserOnboardingAnswerWithDetails[]> {
  return userOnboardingAnswerRepo.findByUserIdWithDetails(supabase, userId);
}

export async function getUserOnboardingAnswerByUserAndQuestion(
  supabase: SupabaseClient,
  userId: string,
  questionId: string,
): Promise<UserOnboardingAnswer | null> {
  return userOnboardingAnswerRepo.findByUserAndQuestionId(supabase, userId, questionId);
}

export async function getUserOnboardingAnswersByQuestionId(
  supabase: SupabaseClient,
  userId: string,
): Promise<Record<string, UserOnboardingAnswer>> {
  const answers = await userOnboardingAnswerRepo.findByUserId(supabase, userId);
  const byQuestionId: Record<string, UserOnboardingAnswer> = {};
  for (const answer of answers) {
    byQuestionId[answer.questionId] = answer;
  }
  return byQuestionId;
}

export async function saveUserOnboardingAnswer(
  supabase: SupabaseClient,
  input: SaveUserOnboardingAnswerInput,
): Promise<UserOnboardingAnswer | null> {
  return userOnboardingAnswerRepo.upsert(supabase, input);
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

export async function deleteUserOnboardingAnswersForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  return userOnboardingAnswerRepo.removeByUserId(supabase, userId);
}

export function hasCompletedOnboarding(
  answers: UserOnboardingAnswer[],
  activeQuestionCount: number,
): boolean {
  if (activeQuestionCount <= 0) return false;
  const answeredQuestionIds = new Set(answers.map((a) => a.questionId));
  return answeredQuestionIds.size >= activeQuestionCount;
}
