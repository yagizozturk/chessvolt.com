import type { SupabaseClient } from "@supabase/supabase-js";

import * as collectionRepo from "@/features/collection/repository/collection.repository";
import type {
  Collection,
  CollectionWithRiddleCount,
  CollectionWithRiddleCountAndThemes,
} from "@/features/collection/types/collection";
import type {
  CreateCollectionPayload,
  CreateCustomCollectionForUserPayload,
  DeleteCustomCollectionForUserPayload,
  UpdateCollectionPayload,
  UpdateCustomCollectionForUserPayload,
} from "@/features/collection/types/collection-payload";

// ============================================================================
// Getting all collections
// ============================================================================
export async function getAllCollections(supabase: SupabaseClient): Promise<Collection[]> {
  return collectionRepo.findAllCollections(supabase);
}

// ============================================================================
// Getting all collections with Riddle Count
// ============================================================================
export async function getAllCollectionsWithRiddleCount(supabase: SupabaseClient): Promise<CollectionWithRiddleCount[]> {
  return collectionRepo.findAllCollectionsWithRiddleCount(supabase);
}

// ============================================================================
// Getting collection by Id
// ============================================================================
export async function getCollectionById(supabase: SupabaseClient, id: string): Promise<Collection | null> {
  return collectionRepo.findCollectionById(supabase, id);
}

// ============================================================================
// Getting collection by Slug
// ============================================================================
export async function getCollectionBySlug(supabase: SupabaseClient, slug: string): Promise<Collection | null> {
  return collectionRepo.findCollectionBySlug(supabase, slug);
}

// ============================================================================
// Getting ACTIVE collections with Riddle Count and Themes related
// ============================================================================
export async function getActiveCollectionsWithRiddleCountAndThemes(
  supabase: SupabaseClient,
): Promise<CollectionWithRiddleCountAndThemes[]> {
  return collectionRepo.findAllActiveCollectionsWithRiddleCountAndThemes(supabase);
}

// ============================================================================
// Getting user custom collections by User Id
// ============================================================================
export async function getUserCustomCollections(supabase: SupabaseClient, userId: string): Promise<Collection[]> {
  return collectionRepo.findUserCustomCollectionByUserId(supabase, userId);
}

// ============================================================================
// Getting user custom collection by slug for a user
// ============================================================================
export async function getUserCustomCollectionBySlug(
  supabase: SupabaseClient,
  userId: string,
  slug: string,
): Promise<Collection | null> {
  return collectionRepo.findUserCustomCollectionBySlug(supabase, userId, slug);
}

// ============================================================================
// Getting user created collections by User Id with Riddle Count and Themes
// ============================================================================
export async function getUserCollectionsWithRiddleCountAndThemes(
  supabase: SupabaseClient,
  userId: string,
): Promise<CollectionWithRiddleCountAndThemes[]> {
  return collectionRepo.findUserCustomCollectionsByUserIdWithRiddleCountAndThemes(supabase, userId);
}

// ============================================================================
// Getting onboarding starter collection for user.
// It checks whether the user already has a custom collection with the onboarding
// starter slug (ONBOARDING_STARTER_COLLECTION_SLUG) before creating a new one.
// ============================================================================
export async function getUserOnboardingStarterCollection(
  supabase: SupabaseClient,
  userId: string,
  slug: string,
): Promise<Collection | null> {
  return collectionRepo.findUserOnboardingStarterCollection(supabase, userId, slug);
}

// ============================================================================
// Creating a collection
// ============================================================================
export async function createCollection(
  supabase: SupabaseClient,
  payload: CreateCollectionPayload,
): Promise<Collection | null> {
  return collectionRepo.createCollection(supabase, payload);
}

// ============================================================================
// Updating a collection
// ============================================================================
export async function updateCollection(
  supabase: SupabaseClient,
  id: string,
  payload: UpdateCollectionPayload,
): Promise<Collection | null> {
  return collectionRepo.updateCollection(supabase, id, payload);
}

// ============================================================================
// Deleting a collection
// ============================================================================
export async function deleteCollection(supabase: SupabaseClient, id: string): Promise<boolean> {
  return collectionRepo.removeCollection(supabase, id);
}

// ============================================================================
// Creating a user custom collection
// ============================================================================
export async function createUserCustomCollection(
  supabase: SupabaseClient,
  payload: CreateCustomCollectionForUserPayload,
): Promise<Collection | null> {
  return collectionRepo.createUserCustomCollection(supabase, payload);
}

// ============================================================================
// Updating a user custom collection
// ============================================================================
export async function updateUserCustomCollection(
  supabase: SupabaseClient,
  payload: UpdateCustomCollectionForUserPayload,
): Promise<Collection | null> {
  return collectionRepo.updateUserCustomCollection(supabase, payload);
}

// ============================================================================
// Deleting a user custom collection
// ============================================================================
export async function deleteUserCustomCollection(
  supabase: SupabaseClient,
  payload: DeleteCustomCollectionForUserPayload,
): Promise<boolean> {
  return collectionRepo.removeUserCustomCollection(supabase, payload);
}
