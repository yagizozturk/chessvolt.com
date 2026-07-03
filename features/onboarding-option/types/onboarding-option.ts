export type OnboardingOption = {
  id: string;
  questionId: string;
  value: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  initialRating: number | null;
  createdAt: string;
  updatedAt: string;
};
