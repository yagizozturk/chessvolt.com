/**
 * Opening Variant Repository
 *
 * Responsibility: CRUD access to the opening_variants table.
 */
import { toOpeningVariant } from "@/features/openings/mapper/opening-variant.mapper";
import type {
  MoveGoal,
  OpeningIdeas,
  OpeningVariant,
} from "@/features/openings/types/opening-variant";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function findAll(
  supabase: SupabaseClient,
): Promise<OpeningVariant[]> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("*")
    .order("sort_key", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("opening-variant.repository.findAll error:", error);
    return [];
  }

  return (data ?? []).map(toOpeningVariant);
}

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<OpeningVariant | null> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("opening-variant.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toOpeningVariant(data);
}

export async function getVariantCountsByOpeningIds(
  supabase: SupabaseClient,
  openingIds: string[],
): Promise<Record<string, number>> {
  if (openingIds.length === 0) return {};
  const { data, error } = await supabase
    .from("opening_variants")
    .select("opening_id")
    .in("opening_id", openingIds);

  if (error) {
    console.error(
      "opening-variant.repository.getVariantCountsByOpeningIds error:",
      error,
    );
    return {};
  }

  const counts: Record<string, number> = {};
  for (const id of openingIds) counts[id] = 0;
  for (const row of data ?? []) {
    const oid = (row as { opening_id: string }).opening_id;
    if (oid) counts[oid] = (counts[oid] ?? 0) + 1;
  }
  return counts;
}

export async function findByOpeningId(
  supabase: SupabaseClient,
  openingId: string,
): Promise<OpeningVariant[]> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("*")
    .eq("opening_id", openingId)
    .order("sort_key", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("opening-variant.repository.findByOpeningId error:", error);
    return [];
  }

  return (data ?? []).map(toOpeningVariant);
}

export type CreateOpeningVariantInput = {
  openingId: string;
  sortKey: number;
  group: string;
  title?: string | null;
  description?: string | null;
  ply: number;
  moves: string;
  pgn: string;
  initialFen?: string | null;
  displayFen?: string | null;
  goals?: MoveGoal[] | null;
  ideas?: OpeningIdeas | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOpeningVariantInput,
): Promise<OpeningVariant | null> {
  const { data, error } = await supabase
    .from("opening_variants")
    .insert({
      opening_id: input.openingId,
      sort_key: input.sortKey,
      group: input.group,
      title: input.title ?? null,
      description: input.description ?? null,
      ply: input.ply,
      moves: input.moves,
      pgn: input.pgn,
      initial_fen: input.initialFen ?? null,
      display_fen: input.displayFen ?? null,
      goals: input.goals ?? null,
      ideas: input.ideas ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("opening-variant.repository.create error:", error);
    return null;
  }

  return toOpeningVariant(data);
}

export type UpdateOpeningVariantInput = {
  sortKey?: number;
  group?: string;
  title?: string | null;
  description?: string | null;
  ply?: number;
  moves?: string;
  pgn?: string;
  initialFen?: string | null;
  displayFen?: string | null;
  goals?: MoveGoal[] | null;
  ideas?: OpeningIdeas | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOpeningVariantInput,
): Promise<OpeningVariant | null> {
  const updates: Record<string, unknown> = {};
  if (input.sortKey !== undefined) updates.sort_key = input.sortKey;
  if (input.group !== undefined) updates.group = input.group;
  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.ply !== undefined) updates.ply = input.ply;
  if (input.moves !== undefined) updates.moves = input.moves;
  if (input.pgn !== undefined) updates.pgn = input.pgn;
  if (input.initialFen !== undefined) updates.initial_fen = input.initialFen;
  if (input.displayFen !== undefined) updates.display_fen = input.displayFen;
  if (input.goals !== undefined) updates.goals = input.goals;
  if (input.ideas !== undefined) updates.ideas = input.ideas;

  const { data, error } = await supabase
    .from("opening_variants")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("opening-variant.repository.update error:", error);
    return null;
  }

  return toOpeningVariant(data);
}

export async function remove(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("opening_variants")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("opening-variant.repository.remove error:", error);
    return false;
  }

  if (!data?.length) {
    console.error(
      "opening-variant.repository.remove: no row deleted (missing or RLS)",
      { id },
    );
    return false;
  }

  return true;
}
