// TODO: Refactor
/**
 * Collection Riddles Service
 *
 * Responsibility: Business logic for collection_riddles join rows.
 * - Uses repository (does not touch Supabase directly)
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as collectionRiddleRepo from "@/features/collection-riddles/repository/collection-riddle.repository";
import type { CollectionRiddle } from "@/features/collection-riddles/types/collection-riddle";
import type { Riddle } from "@/features/riddle/types/riddle";

export async function getCollectionRiddlesByRiddleId(
  supabase: SupabaseClient,
  riddleId: string,
): Promise<CollectionRiddle[]> {
  return collectionRiddleRepo.findByRiddleId(supabase, riddleId);
}

export async function getCollectionRiddleByRiddleIdAndCollectionId(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string,
): Promise<CollectionRiddle | null> {
  return collectionRiddleRepo.findByRiddleIdAndCollectionId(supabase, riddleId, collectionId);
}

export async function getActiveRiddlesByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
  input: collectionRiddleRepo.FindActiveByCollectionIdInput = {},
): Promise<Riddle[]> {
  return collectionRiddleRepo.findActiveByCollectionId(supabase, collectionId, input);
}

export async function getActiveRiddlesCountByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<number> {
  return collectionRiddleRepo.countActiveByCollectionId(supabase, collectionId);
}

export async function addRiddleToCollection(
  supabase: SupabaseClient,
  input: collectionRiddleRepo.CreateCollectionRiddleInput,
): Promise<CollectionRiddle | null> {
  return collectionRiddleRepo.create(supabase, input);
}
