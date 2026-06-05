import type { OnboardingQuestion } from "@/features/onboarding-question/types/onboarding-question";

export type DbOnboardingQuestion = {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function toOnboardingQuestion(db: DbOnboardingQuestion): OnboardingQuestion {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    sortOrder: db.sort_order,
    isActive: db.is_active,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function toOnboardingQuestions(rows: DbOnboardingQuestion[]): OnboardingQuestion[] {
  return rows.map(toOnboardingQuestion);
}
