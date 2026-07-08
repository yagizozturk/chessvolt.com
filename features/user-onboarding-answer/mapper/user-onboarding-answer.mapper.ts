// TODO: Refactor
import type {
  UserOnboardingAnswer,
  UserOnboardingAnswerWithDetails,
} from "@/features/user-onboarding-answer/types/user-onboarding-answer";
import {
  toOnboardingOption,
  type DbOnboardingOption,
} from "@/features/onboarding-option/mapper/onboarding-option.mapper";
import {
  toOnboardingQuestion,
  type DbOnboardingQuestion,
} from "@/features/onboarding-question/mapper/onboarding-question.mapper";

export type DbUserOnboardingAnswer = {
  id: string;
  user_id: string;
  question_id: string;
  option_id: string;
  created_at: string;
};

export type DbUserOnboardingAnswerWithDetails = DbUserOnboardingAnswer & {
  onboarding_questions: DbOnboardingQuestion | null;
  onboarding_options: DbOnboardingOption | null;
};

export function toUserOnboardingAnswer(db: DbUserOnboardingAnswer): UserOnboardingAnswer {
  return {
    id: db.id,
    userId: db.user_id,
    questionId: db.question_id,
    optionId: db.option_id,
    createdAt: db.created_at,
  };
}

export function toUserOnboardingAnswers(rows: DbUserOnboardingAnswer[]): UserOnboardingAnswer[] {
  return rows.map(toUserOnboardingAnswer);
}

export function toUserOnboardingAnswerWithDetails(
  db: DbUserOnboardingAnswerWithDetails,
): UserOnboardingAnswerWithDetails | null {
  const answer = toUserOnboardingAnswer(db);
  if (!db.onboarding_questions || !db.onboarding_options) return null;

  const question = toOnboardingQuestion(db.onboarding_questions);
  const option = toOnboardingOption(db.onboarding_options);
  if (!option) return null;

  return { ...answer, question, option };
}

export function toUserOnboardingAnswersWithDetails(
  rows: DbUserOnboardingAnswerWithDetails[],
): UserOnboardingAnswerWithDetails[] {
  const items: UserOnboardingAnswerWithDetails[] = [];
  for (const row of rows) {
    const item = toUserOnboardingAnswerWithDetails(row);
    if (item) items.push(item);
  }
  return items;
}
