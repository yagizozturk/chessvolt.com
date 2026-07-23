// TODO: Refactor
/**
 * Collection Riddle Repository
 *
 * Responsibility: CRUD access to the collection_riddles join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { toCollectionRiddle } from "@/features/collection-riddles/mapper/collection-riddle.mapper";
import type { CollectionRiddle } from "@/features/collection-riddles/types/collection-riddle";
import { type DbRiddle, toRiddle } from "@/features/riddle/mapper/riddle.mapper";
import type { Riddle } from "@/features/riddle/types/riddle";

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

type DbCollectionRiddleJoinRow = {
  sort_order: number;
  created_at: string;
  riddles: DbRiddle | DbRiddle[] | null;
};

export type FindActiveByCollectionIdInput = {
  offset?: number;
  limit?: number;
};

function mapCollectionRiddleJoinRows(rows: DbCollectionRiddleJoinRow[]): Riddle[] {
  return rows
    .map((joinRow) => {
      const riddleRow = Array.isArray(joinRow.riddles) ? joinRow.riddles[0] : joinRow.riddles;
      if (!riddleRow) return null;
      if (!riddleRow.is_active) return null;
      return toRiddle(riddleRow);
    })
    .filter((riddle): riddle is Riddle => riddle != null);
}

export async function countActiveByCollectionId(supabase: SupabaseClient, collectionId: string): Promise<number> {
  const { count, error } = await supabase
    .from("collection_riddles")
    .select("riddles!inner(id)", { count: "exact", head: true })
    .eq("collection_id", collectionId)
    .eq("riddles.is_active", true);

  if (error) {
    console.error("collection-riddle.repository.countActiveByCollectionId error:", error);
    return 0;
  }

  return count ?? 0;
}

export async function findActiveByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
  input: FindActiveByCollectionIdInput = {},
): Promise<Riddle[]> {
  let query = supabase
    .from("collection_riddles")
    .select("sort_order, created_at, riddles (*, move_sequences (*))")
    .eq("collection_id", collectionId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (input.offset != null && input.limit != null) {
    query = query.range(input.offset, input.offset + input.limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error("collection-riddle.repository.findActiveByCollectionId error:", error);
    return [];
  }

  return mapCollectionRiddleJoinRows((data ?? []) as DbCollectionRiddleJoinRow[]);
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
