"use server";

import { saveUserOnboardingAnswer } from "@/features/user-onboarding-answer/services/user-onboarding-answer.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export type SaveUserOnboardingAnswerResult =
  | { success: true; answerId: string }
  | { success: false; error: string };

export async function saveUserOnboardingAnswerAction(
  questionId: string,
  optionId: string,
): Promise<SaveUserOnboardingAnswerResult> {
  const trimmedQuestionId = questionId.trim();
  const trimmedOptionId = optionId.trim();

  if (!trimmedQuestionId || !trimmedOptionId) {
    return { success: false, error: "Question and option are required." };
  }

  const { user, supabase } = await getAuthenticatedUser();

  const answer = await saveUserOnboardingAnswer(supabase, {
    userId: user.id,
    questionId: trimmedQuestionId,
    optionId: trimmedOptionId,
  });

  if (!answer) {
    return {
      success: false,
      error: "Could not save your answer. The option may not belong to this question.",
    };
  }

  return { success: true, answerId: answer.id };
}
