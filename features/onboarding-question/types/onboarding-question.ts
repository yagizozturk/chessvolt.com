export type OnboardingQuestion = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
