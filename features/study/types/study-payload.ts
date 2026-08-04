import type { StudyDifficulty } from "@/features/study/types/study-difficulty";

export type CreateStudyPayload = {
  title: string;
  slug?: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  difficulty?: StudyDifficulty;
  sortOrder?: number;
  isActive?: boolean;
  createdBy?: string | null;
};

export type UpdateStudyPayload = {
  title?: string;
  slug?: string;
  description?: string;
  coverImageUrl?: string;
  coverImageColor?: string;
  difficulty?: StudyDifficulty;
  sortOrder?: number;
  isActive?: boolean;
};
