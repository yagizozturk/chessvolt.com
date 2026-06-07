import type { CollectionThemeWithTheme } from "@/features/collection-theme/types/collection-theme";
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";
import type { CollectionType } from "@/features/collection/types/collection-type";

export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  difficulty: CollectionDifficulty;
  collectionType: CollectionType;
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
