import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";

export type CreateCollectionPayload = {
  title: string;
  slug?: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  difficulty?: CollectionDifficulty;
  sortOrder?: number;
  isActive?: boolean;
  createdBy?: string | null;
};

export type UpdateCollectionPayload = {
  title?: string;
  slug?: string;
  description?: string;
  coverImageUrl?: string;
  coverImageColor?: string;
  difficulty?: CollectionDifficulty;
  sortOrder?: number;
  isActive?: boolean;
};
