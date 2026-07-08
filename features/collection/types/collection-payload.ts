// TODO: Refactor
import type { CollectionDifficulty } from "@/features/collection/types/collection-difficulty";
import type { CollectionType } from "@/features/collection/types/collection-type";

// ============================================================================
// Payload for creating an admin collection. Omits server-generated fields (id, timestamps)
// and fields that receive defaults in the repository (slug, difficulty, etc.).
// ============================================================================
export type CreateCollectionPayload = {
  title: string;
  slug?: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  difficulty?: CollectionDifficulty;
  collectionType?: CollectionType;
  sortOrder?: number;
  isActive?: boolean;
  createdBy?: string | null;
};

// ============================================================================
// Payload for creating a user-owned custom collection.
// ============================================================================
export type CreateCustomCollectionForUserPayload = {
  title: string;
  description?: string;
  slug?: string;
  createdBy: string;
  coverImageUrl: string;
  coverImageColor: string;
};

// ============================================================================
// Partial payload for updating an existing admin collection.
// ============================================================================
export type UpdateCollectionPayload = {
  title?: string;
  slug?: string;
  description?: string;
  coverImageUrl?: string;
  coverImageColor?: string;
  difficulty?: CollectionDifficulty;
  collectionType?: CollectionType;
  sortOrder?: number;
  isActive?: boolean;
};

// ============================================================================
// Payload for updating a user-owned custom collection.
// ============================================================================
export type UpdateCustomCollectionForUserPayload = {
  id: string;
  userId: string;
  title: string;
  description?: string;
};

// ============================================================================
// Payload for deleting a user-owned custom collection.
// ============================================================================
export type DeleteCustomCollectionForUserPayload = {
  id: string;
  userId: string;
};
