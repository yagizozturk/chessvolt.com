/**
 * Collection Riddles Service
 *
 * Responsibility: Business logic for collection_riddles join rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as collectionRiddleRepo from "@/features/collection-riddles/repository/collection-riddle.repository";
import type { CollectionRiddle } from "@/features/collection-riddles/types/collection-riddle";

export async function getCollectionRiddleById(supabase: SupabaseClient, id: string): Promise<CollectionRiddle | null> {
  return collectionRiddleRepo.findById(supabase, id);
}

export async function getCollectionRiddlesForCollection(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<CollectionRiddle[]> {
  return collectionRiddleRepo.findByCollectionId(supabase, collectionId);
}

// ================================================================================================
// Getting collection riddles by riddle id.
// Existing riddle Id is supplied to get other riddles in the MULTIPLE collections
// There is no one single collection. There can be one riddle in two collections.
// ================================================================================================
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

export async function updateCollectionRiddle(
  supabase: SupabaseClient,
  id: string,
  input: collectionRiddleRepo.UpdateCollectionRiddleInput,
): Promise<CollectionRiddle | null> {
  return collectionRiddleRepo.update(supabase, id, input);
}

export async function deleteCollectionRiddle(supabase: SupabaseClient, id: string): Promise<boolean> {
  return collectionRiddleRepo.remove(supabase, id);
}

export async function deleteCollectionRiddlesForCollection(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<boolean> {
  return collectionRiddleRepo.removeByCollectionId(supabase, collectionId);
}

export async function deleteCollectionRiddlesForRiddle(supabase: SupabaseClient, riddleId: string): Promise<boolean> {
  return collectionRiddleRepo.removeByRiddleId(supabase, riddleId);
}

export async function removeRiddleFromCollection(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string,
): Promise<boolean> {
  return collectionRiddleRepo.removeByPair(supabase, riddleId, collectionId);
}
