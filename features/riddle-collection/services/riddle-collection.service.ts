/**
 * Riddle Collection Service
 *
 * Responsibility: Business logic for riddle_collections join rows.
 * - Uses repository (does not touch Supabase directly)
 */

import * as riddleCollectionRepo from "@/features/riddle-collection/repository/riddle-collection.repository";
import type { RiddleCollection } from "@/features/riddle-collection/types/riddle-collection";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getRiddleCollectionById(
  supabase: SupabaseClient,
  id: string,
): Promise<RiddleCollection | null> {
  return riddleCollectionRepo.findById(supabase, id);
}

export async function getRiddleCollectionsForCollection(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<RiddleCollection[]> {
  return riddleCollectionRepo.findByCollectionId(supabase, collectionId);
}

export async function getRiddleCollectionsForRiddle(
  supabase: SupabaseClient,
  riddleId: string,
): Promise<RiddleCollection[]> {
  return riddleCollectionRepo.findByRiddleId(supabase, riddleId);
}

export async function getRiddleCollectionByPair(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string,
): Promise<RiddleCollection | null> {
  return riddleCollectionRepo.findByPair(supabase, riddleId, collectionId);
}

export async function addRiddleToCollection(
  supabase: SupabaseClient,
  input: riddleCollectionRepo.CreateRiddleCollectionInput,
): Promise<RiddleCollection | null> {
  return riddleCollectionRepo.create(supabase, input);
}

export async function addRiddlesToCollection(
  supabase: SupabaseClient,
  inputs: riddleCollectionRepo.CreateRiddleCollectionInput[],
): Promise<RiddleCollection[]> {
  return riddleCollectionRepo.createMany(supabase, inputs);
}

export async function updateRiddleCollection(
  supabase: SupabaseClient,
  id: string,
  input: riddleCollectionRepo.UpdateRiddleCollectionInput,
): Promise<RiddleCollection | null> {
  return riddleCollectionRepo.update(supabase, id, input);
}

export async function deleteRiddleCollection(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  return riddleCollectionRepo.remove(supabase, id);
}

export async function deleteRiddleCollectionsForCollection(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<boolean> {
  return riddleCollectionRepo.removeByCollectionId(supabase, collectionId);
}

export async function deleteRiddleCollectionsForRiddle(
  supabase: SupabaseClient,
  riddleId: string,
): Promise<boolean> {
  return riddleCollectionRepo.removeByRiddleId(supabase, riddleId);
}

export async function removeRiddleFromCollection(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string,
): Promise<boolean> {
  return riddleCollectionRepo.removeByPair(supabase, riddleId, collectionId);
}
