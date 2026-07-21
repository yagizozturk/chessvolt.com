// TODO: Refactor
import type { CollectionThemeWithTheme } from "@/features/collection-theme/types/collection-theme";
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";

export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  difficulty: CollectionDifficulty;
  sortOrder: number;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CollectionWithRiddleCount = Collection & { riddleCount: number };

export type CollectionWithRiddleCountAndThemes = CollectionWithRiddleCount & {
  themes: CollectionThemeWithTheme[];
};
