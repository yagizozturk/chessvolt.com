export type UserOpeningVariant = {
  id: string;
  userId: string;
  openingVariantId: string;
  isCorrect: boolean;
  solvedAt: string;
  timeSpentSeconds: number | null;
  userMoveSan: string | null;
};

export type AttemptedOpeningVariant = {
  openingVariantId: string;
  isCorrect: boolean;
};
