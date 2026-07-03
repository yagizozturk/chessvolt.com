import type { OnboardingOption } from "@/features/onboarding-option/types/onboarding-option";
import type { OnboardingOptionWithQuestion } from "@/features/onboarding-option/types/onboarding-option-with-question";
import {
  parseOnboardingInitialRating,
} from "@/features/onboarding-option/types/onboarding-rating";
import {
  toOnboardingQuestion,
  type DbOnboardingQuestion,
} from "@/features/onboarding-question/mapper/onboarding-question.mapper";

export type DbOnboardingOption = {
  id: string;
  question_id: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  initial_rating: number | null;
  created_at: string;
  updated_at: string;
};

export type DbOnboardingOptionWithQuestion = DbOnboardingOption & {
  onboarding_questions: DbOnboardingQuestion | null;
};

export function toOnboardingOption(db: DbOnboardingOption): OnboardingOption | null {
  const initialRating = parseOnboardingInitialRating(db.initial_rating);

  if (db.initial_rating != null && initialRating === null) {
    console.error("onboarding-option.mapper: invalid initial_rating", db.id, db.initial_rating);
    return null;
  }

  return {
    id: db.id,
    questionId: db.question_id,
    value: db.value,
    label: db.label,
    sortOrder: db.sort_order,
    isActive: db.is_active,
    initialRating,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function toOnboardingOptions(rows: DbOnboardingOption[]): OnboardingOption[] {
  const items: OnboardingOption[] = [];
  for (const row of rows) {
    const item = toOnboardingOption(row);
    if (item) items.push(item);
  }
  return items;
}

export function toOnboardingOptionWithQuestion(
  db: DbOnboardingOptionWithQuestion,
): OnboardingOptionWithQuestion | null {
  const option = toOnboardingOption(db);
  if (!option || !db.onboarding_questions) return null;

  const question = toOnboardingQuestion(db.onboarding_questions);
  return { ...option, question };
}

export function toOnboardingOptionsWithQuestion(
  rows: DbOnboardingOptionWithQuestion[],
): OnboardingOptionWithQuestion[] {
  const items: OnboardingOptionWithQuestion[] = [];
  for (const row of rows) {
    const item = toOnboardingOptionWithQuestion(row);
    if (item) items.push(item);
  }
  return items;
}
