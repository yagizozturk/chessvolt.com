// TODO: Refactor
import type { StudyThemeWithTheme } from "@/features/study-theme/types/study-theme";
import type { StudyDifficulty } from "@/features/study/types/study-difficulty";

export type Study = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  difficulty: StudyDifficulty;
  sortOrder: number;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudyWithRiddleCount = Study & { riddleCount: number };

export type StudyWithRiddleCountAndThemes = StudyWithRiddleCount & {
  themes: StudyThemeWithTheme[];
};
