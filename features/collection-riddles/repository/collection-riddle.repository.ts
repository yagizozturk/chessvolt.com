/**
 * Collection Riddle Repository
 *
 * Responsibility: CRUD access to the collection_riddles join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { toCollectionRiddle } from "@/features/collection-riddles/mapper/collection-riddle.mapper";
import type { CollectionRiddle } from "@/features/collection-riddles/types/collection-riddle";

export async function findByCollectionId(supabase: SupabaseClient, collectionId: string): Promise<CollectionRiddle[]> {
  const { data, error } = await supabase
    .from("collection_riddles")
    .select("*")
    .eq("collection_id", collectionId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("collection-riddle.repository.findByCollectionId error:", error);
    return [];
  }

  return (data ?? []).map(toCollectionRiddle);
}

export async function findByRiddleId(supabase: SupabaseClient, riddleId: string): Promise<CollectionRiddle[]> {
  const { data, error } = await supabase
    .from("collection_riddles")
    .select("*")
    .eq("riddle_id", riddleId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("collection-riddle.repository.findByRiddleId error:", error);
    return [];
  }

  return (data ?? []).map(toCollectionRiddle);
}

export async function findByPair(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string,
): Promise<CollectionRiddle | null> {
  const { data, error } = await supabase
    .from("collection_riddles")
    .select("*")
    .eq("riddle_id", riddleId)
    .eq("collection_id", collectionId)
    .maybeSingle();

  if (error) {
    console.error("collection-riddle.repository.findByPair error:", error);
    return null;
  }

  if (!data) return null;

  return toCollectionRiddle(data);
}

export type CreateCollectionRiddleInput = {
  riddleId: string;
  collectionId: string;
  sortOrder?: number;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateCollectionRiddleInput,
): Promise<CollectionRiddle | null> {
  const { data, error } = await supabase
    .from("collection_riddles")
    .insert({
      riddle_id: input.riddleId,
      collection_id: input.collectionId,
      sort_order: input.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error("collection-riddle.repository.create error:", error);
    return null;
  }

  return toCollectionRiddle(data);
}

export async function createMany(
  supabase: SupabaseClient,
  inputs: CreateCollectionRiddleInput[],
): Promise<CollectionRiddle[]> {
  if (inputs.length === 0) return [];

  const rows = inputs.map((input) => ({
    riddle_id: input.riddleId,
    collection_id: input.collectionId,
    sort_order: input.sortOrder ?? 0,
  }));

  const { data, error } = await supabase.from("collection_riddles").insert(rows).select();

  if (error) {
    console.error("collection-riddle.repository.createMany error:", error);
    return [];
  }

  return (data ?? []).map(toCollectionRiddle);
}

export async function removeByRiddleId(supabase: SupabaseClient, riddleId: string): Promise<boolean> {
  const { error } = await supabase.from("collection_riddles").delete().eq("riddle_id", riddleId);

  if (error) {
    console.error("collection-riddle.repository.removeByRiddleId error:", error);
    return false;
  }

  return true;
}
