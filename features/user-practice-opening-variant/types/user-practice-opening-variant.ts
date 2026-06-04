import type { OpeningVariant } from "@/features/openings/types/opening-variant";

export type UserPracticeOpeningVariant = {
  id: string;
  userId: string;
  openingVariantId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
};

export type UserPracticeOpeningVariantWithDetails = UserPracticeOpeningVariant & {
  openingVariant: OpeningVariant;
};

export type SaveUserPracticeOpeningVariantInput = {
  userId: string;
  openingVariantId: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type UpdateUserPracticeOpeningVariantInput = {
  isActive?: boolean;
  sortOrder?: number;
};
