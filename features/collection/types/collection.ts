import type { RiddleDifficulty } from "@/features/riddle/types/riddle-difficulty";

export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  difficulty: RiddleDifficulty;
  sortOrder: number;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CollectionWithRiddleCount = Collection & { riddleCount: number };
