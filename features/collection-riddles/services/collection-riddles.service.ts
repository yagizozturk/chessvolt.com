/**
 * Collection Riddles Service
 *
 * Responsibility: Business logic for collection_riddles join rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as collectionRiddleRepo from "@/features/collection-riddles/repository/collection-riddle.repository";
import type { CollectionRiddle } from "@/features/collection-riddles/types/collection-riddle";

export async function getCollectionRiddlesForCollection(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<CollectionRiddle[]> {
  return collectionRiddleRepo.findByCollectionId(supabase, collectionId);
}

export async function getCollectionRiddlesByRiddleId(
  supabase: SupabaseClient,
  riddleId: string,
): Promise<CollectionRiddle[]> {
  return collectionRiddleRepo.findByRiddleId(supabase, riddleId);
}

export async function getCollectionRiddleByPair(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string,
): Promise<CollectionRiddle | null> {
  return collectionRiddleRepo.findByPair(supabase, riddleId, collectionId);
}

export async function addRiddleToCollection(
  supabase: SupabaseClient,
  input: collectionRiddleRepo.CreateCollectionRiddleInput,
): Promise<CollectionRiddle | null> {
  return collectionRiddleRepo.create(supabase, input);
}

export async function addRiddlesToCollection(
  supabase: SupabaseClient,
  inputs: collectionRiddleRepo.CreateCollectionRiddleInput[],
): Promise<CollectionRiddle[]> {
  return collectionRiddleRepo.createMany(supabase, inputs);
}

export async function deleteCollectionRiddlesForRiddle(supabase: SupabaseClient, riddleId: string): Promise<boolean> {
  return collectionRiddleRepo.removeByRiddleId(supabase, riddleId);
}
