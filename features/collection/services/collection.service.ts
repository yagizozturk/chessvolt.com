/**
 * Collection Service
 *
 * Responsibility: Collection business logic and orchestration.
 * - Uses repository (does not touch Supabase directly)
 */

import * as collectionRepo from "@/features/collection/repository/collection.repository";
import type { Collection, CollectionWithRiddleCount } from "@/features/collection/types/collection";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAllCollections(supabase: SupabaseClient): Promise<Collection[]> {
  return collectionRepo.findAll(supabase);
}

export async function getActiveCollections(supabase: SupabaseClient): Promise<Collection[]> {
  return collectionRepo.findAllActive(supabase);
}

export async function getMyCustomCollections(
  supabase: SupabaseClient,
  userId: string,
): Promise<Collection[]> {
  return collectionRepo.findCustomByUserId(supabase, userId);
}

export async function getActiveCollectionsWithRiddleCount(
  supabase: SupabaseClient,
): Promise<CollectionWithRiddleCount[]> {
  return collectionRepo.findAllActiveWithRiddleCount(supabase);
}

export async function getAllCollectionsWithRiddleCount(
  supabase: SupabaseClient,
): Promise<CollectionWithRiddleCount[]> {
  return collectionRepo.findAllWithRiddleCount(supabase);
}

export async function getCollectionById(
  supabase: SupabaseClient,
  id: string,
): Promise<Collection | null> {
  return collectionRepo.findById(supabase, id);
}

export async function getCollectionBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<Collection | null> {
  return collectionRepo.findBySlug(supabase, slug);
}

export async function createCollection(
  supabase: SupabaseClient,
  input: collectionRepo.CreateCollectionInput,
): Promise<Collection | null> {
  return collectionRepo.create(supabase, input);
}

export async function updateCollection(
  supabase: SupabaseClient,
  id: string,
  input: collectionRepo.UpdateCollectionInput,
): Promise<Collection | null> {
  return collectionRepo.update(supabase, id, input);
}

export async function deleteCollection(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  return collectionRepo.remove(supabase, id);
}

export async function createMyCustomCollection(
  supabase: SupabaseClient,
  input: collectionRepo.CreateCustomCollectionForUserInput,
): Promise<Collection | null> {
  return collectionRepo.createCustomForUser(supabase, input);
}

export async function updateMyCustomCollection(
  supabase: SupabaseClient,
  input: { id: string; userId: string; title: string; description?: string },
): Promise<Collection | null> {
  return collectionRepo.updateCustomForUser(supabase, input);
}

export async function deleteMyCustomCollection(
  supabase: SupabaseClient,
  input: { id: string; userId: string },
): Promise<boolean> {
  return collectionRepo.removeCustomForUser(supabase, input);
}
