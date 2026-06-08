/**
 * Collection Riddle Repository
 *
 * Responsibility: CRUD access to the riddle_collections join table.
 */

import { toCollectionRiddle } from "@/features/collection-riddles/mapper/collection-riddle.mapper";
import type { CollectionRiddle } from "@/features/collection-riddles/types/collection-riddle";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<CollectionRiddle | null> {
  const { data, error } = await supabase
    .from("riddle_collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("collection-riddle.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toCollectionRiddle(data);
}

export async function findByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<CollectionRiddle[]> {
  const { data, error } = await supabase
    .from("riddle_collections")
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

export async function findByRiddleId(
  supabase: SupabaseClient,
  riddleId: string,
): Promise<CollectionRiddle[]> {
  const { data, error } = await supabase
    .from("riddle_collections")
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
    .from("riddle_collections")
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
    .from("riddle_collections")
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

  const { data, error } = await supabase.from("riddle_collections").insert(rows).select();

  if (error) {
    console.error("collection-riddle.repository.createMany error:", error);
    return [];
  }

  return (data ?? []).map(toCollectionRiddle);
}

export type UpdateCollectionRiddleInput = {
  sortOrder?: number;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateCollectionRiddleInput,
): Promise<CollectionRiddle | null> {
  const updates: Record<string, unknown> = {};
  if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase
    .from("riddle_collections")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("collection-riddle.repository.update error:", error);
    return null;
  }

  return toCollectionRiddle(data);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("riddle_collections").delete().eq("id", id);

  if (error) {
    console.error("collection-riddle.repository.remove error:", error);
    return false;
  }

  return true;
}

export async function removeByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("riddle_collections")
    .delete()
    .eq("collection_id", collectionId);

  if (error) {
    console.error("collection-riddle.repository.removeByCollectionId error:", error);
    return false;
  }

  return true;
}

export async function removeByRiddleId(supabase: SupabaseClient, riddleId: string): Promise<boolean> {
  const { error } = await supabase.from("riddle_collections").delete().eq("riddle_id", riddleId);

  if (error) {
    console.error("collection-riddle.repository.removeByRiddleId error:", error);
    return false;
  }

  return true;
}

export async function removeByPair(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("riddle_collections")
    .delete()
    .eq("riddle_id", riddleId)
    .eq("collection_id", collectionId);

  if (error) {
    console.error("collection-riddle.repository.removeByPair error:", error);
    return false;
  }

  return true;
}
