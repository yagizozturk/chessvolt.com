// TODO: Refactor
import type { SupabaseClient } from "@supabase/supabase-js";

import * as collectionRepo from "@/features/collection/repository/collection.repository";
import type {
  Collection,
  CollectionWithRiddleCount,
  CollectionWithRiddleCountAndThemes,
} from "@/features/collection/types/collection";
import type {
  CreateCollectionPayload,
  UpdateCollectionPayload,
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

