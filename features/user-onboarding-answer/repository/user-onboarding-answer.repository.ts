/**
 * User Onboarding Answer Repository
 *
 * Responsibility: CRUD access to the user_onboarding_answers table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbUserOnboardingAnswer,
  type DbUserOnboardingAnswerWithDetails,
  toUserOnboardingAnswer,
  toUserOnboardingAnswerWithDetails,
  toUserOnboardingAnswers,
  toUserOnboardingAnswersWithDetails,
} from "@/features/user-onboarding-answer/mapper/user-onboarding-answer.mapper";
import type {
  SaveUserOnboardingAnswerInput,
  UpdateUserOnboardingAnswerInput,
  UserOnboardingAnswer,
  UserOnboardingAnswerWithDetails,
} from "@/features/user-onboarding-answer/types/user-onboarding-answer";

const ANSWER_WITH_DETAILS_SELECT = "*, onboarding_questions (*), onboarding_options (*)";

export async function findByIdWithDetails(
  supabase: SupabaseClient,
  id: string,
): Promise<UserOnboardingAnswerWithDetails | null> {
  const { data, error } = await supabase
    .from("user_onboarding_answers")
    .select(ANSWER_WITH_DETAILS_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("user-onboarding-answer.repository.findByIdWithDetails error:", error);
    return null;
  }

  if (!data) return null;

  return toUserOnboardingAnswerWithDetails(data as DbUserOnboardingAnswerWithDetails);
}

export async function findAllWithDetails(supabase: SupabaseClient): Promise<UserOnboardingAnswerWithDetails[]> {
  const { data, error } = await supabase
    .from("user_onboarding_answers")
    .select(ANSWER_WITH_DETAILS_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("user-onboarding-answer.repository.findAllWithDetails error:", error);
    return [];
  }

  return toUserOnboardingAnswersWithDetails((data ?? []) as DbUserOnboardingAnswerWithDetails[]);
}

export async function upsert(
  supabase: SupabaseClient,
  input: SaveUserOnboardingAnswerInput,
): Promise<UserOnboardingAnswer | null> {
  const { error: deleteError } = await supabase
    .from("user_onboarding_answers")
    .delete()
    .eq("user_id", input.userId)
    .eq("question_id", input.questionId);

  if (deleteError) {
    console.error("user-onboarding-answer.repository.upsert delete error:", deleteError);
    return null;
  }

  const { data, error } = await supabase
    .from("user_onboarding_answers")
    .insert({
      user_id: input.userId,
      question_id: input.questionId,
      option_id: input.optionId,
    })
    .select()
    .single();

  if (error) {
    console.error("user-onboarding-answer.repository.upsert insert error:", error);
    return null;
  }

  return toUserOnboardingAnswer(data as DbUserOnboardingAnswer);
}

export async function replaceForQuestion(
  supabase: SupabaseClient,
  userId: string,
  questionId: string,
  optionIds: string[],
): Promise<UserOnboardingAnswer[] | null> {
  const { error: deleteError } = await supabase
    .from("user_onboarding_answers")
    .delete()
    .eq("user_id", userId)
    .eq("question_id", questionId);

  if (deleteError) {
    console.error("user-onboarding-answer.repository.replaceForQuestion delete error:", deleteError);
    return null;
  }

  if (optionIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_onboarding_answers")
    .insert(
      optionIds.map((optionId) => ({
        user_id: userId,
        question_id: questionId,
        option_id: optionId,
      })),
    )
    .select();

  if (error) {
    console.error("user-onboarding-answer.repository.replaceForQuestion insert error:", error);
    return null;
  }

  return toUserOnboardingAnswers((data ?? []) as DbUserOnboardingAnswer[]);
}

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateUserOnboardingAnswerInput,
): Promise<UserOnboardingAnswer | null> {
  const { data, error } = await supabase
    .from("user_onboarding_answers")
    .update({ option_id: input.optionId })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("user-onboarding-answer.repository.update error:", error);
    return null;
  }

  return toUserOnboardingAnswer(data as DbUserOnboardingAnswer);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("user_onboarding_answers").delete().eq("id", id);

  if (error) {
    console.error("user-onboarding-answer.repository.remove error:", error);
    return false;
  }

  return true;
}
