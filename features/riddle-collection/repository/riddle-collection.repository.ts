/**
 * Riddle Collection Repository
 *
 * Responsibility: CRUD access to the riddle_collections join table.
 */

import { toRiddleCollection } from "@/features/riddle-collection/mapper/riddle-collection.mapper";
import type { RiddleCollection } from "@/features/riddle-collection/types/riddle-collection";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<RiddleCollection | null> {
  const { data, error } = await supabase
    .from("riddle_collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("riddle-collection.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toRiddleCollection(data);
}

export async function findByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<RiddleCollection[]> {
  const { data, error } = await supabase
    .from("riddle_collections")
    .select("*")
    .eq("collection_id", collectionId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("riddle-collection.repository.findByCollectionId error:", error);
    return [];
  }

  return (data ?? []).map(toRiddleCollection);
}

export async function findByRiddleId(
  supabase: SupabaseClient,
  riddleId: string,
): Promise<RiddleCollection[]> {
  const { data, error } = await supabase
    .from("riddle_collections")
    .select("*")
    .eq("riddle_id", riddleId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("riddle-collection.repository.findByRiddleId error:", error);
    return [];
  }

  return (data ?? []).map(toRiddleCollection);
}

export async function findByPair(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string,
): Promise<RiddleCollection | null> {
  const { data, error } = await supabase
    .from("riddle_collections")
    .select("*")
    .eq("riddle_id", riddleId)
    .eq("collection_id", collectionId)
    .maybeSingle();

  if (error) {
    console.error("riddle-collection.repository.findByPair error:", error);
    return null;
  }

  if (!data) return null;

  return toRiddleCollection(data);
}

export type CreateRiddleCollectionInput = {
  riddleId: string;
  collectionId: string;
  sortOrder?: number;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateRiddleCollectionInput,
): Promise<RiddleCollection | null> {
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
    console.error("riddle-collection.repository.create error:", error);
    return null;
  }

  return toRiddleCollection(data);
}

export async function createMany(
  supabase: SupabaseClient,
  inputs: CreateRiddleCollectionInput[],
): Promise<RiddleCollection[]> {
  if (inputs.length === 0) return [];

  const rows = inputs.map((input) => ({
    riddle_id: input.riddleId,
    collection_id: input.collectionId,
    sort_order: input.sortOrder ?? 0,
  }));

  const { data, error } = await supabase.from("riddle_collections").insert(rows).select();

  if (error) {
    console.error("riddle-collection.repository.createMany error:", error);
    return [];
  }

  return (data ?? []).map(toRiddleCollection);
}

export type UpdateRiddleCollectionInput = {
  sortOrder?: number;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateRiddleCollectionInput,
): Promise<RiddleCollection | null> {
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
    console.error("riddle-collection.repository.update error:", error);
    return null;
  }

  return toRiddleCollection(data);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("riddle_collections").delete().eq("id", id);

  if (error) {
    console.error("riddle-collection.repository.remove error:", error);
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
    console.error("riddle-collection.repository.removeByCollectionId error:", error);
    return false;
  }

  return true;
}

export async function removeByRiddleId(supabase: SupabaseClient, riddleId: string): Promise<boolean> {
  const { error } = await supabase.from("riddle_collections").delete().eq("riddle_id", riddleId);

  if (error) {
    console.error("riddle-collection.repository.removeByRiddleId error:", error);
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
    console.error("riddle-collection.repository.removeByPair error:", error);
    return false;
  }

  return true;
}
