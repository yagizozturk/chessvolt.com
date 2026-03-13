/**
 * Reps (Repertoire) Repository
 *
 * Responsibility: CRUD access to the reps table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Rep } from "@/features/reps/types/reps";
import { toRep } from "@/features/reps/mapper/reps.mapper";

export async function findAll(supabase: SupabaseClient): Promise<Rep[]> {
  const { data: reps, error } = await supabase.from("reps").select("*");

  if (error) {
    console.error("reps.repository.findAll error:", error);
    return [];
  }

  return (reps ?? []).map(toRep);
}

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<Rep | null> {
  const { data, error } = await supabase
    .from("reps")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("reps.repository.findById error:", error);
    }
    return null;
  }

  if (!data) return null;

  return toRep(data);
}

export type CreateRepInput = {
  moves: string;
  openingName?: string | null;
  openingType?: string | null;
  title?: string | null;
  ply?: number | null;
  pgn?: string | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateRepInput,
): Promise<Rep | null> {
  const { data, error } = await supabase
    .from("reps")
    .insert({
      moves: input.moves,
      opening_name: input.openingName ?? null,
      opening_type: input.openingType ?? null,
      title: input.title ?? "",
      ply: input.ply ?? null,
      pgn: input.pgn ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("reps.repository.create error:", error);
    return null;
  }

  return toRep(data);
}

export type UpdateRepInput = {
  moves?: string;
  openingName?: string | null;
  openingType?: string | null;
  title?: string;
  ply?: number | null;
  pgn?: string | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateRepInput,
): Promise<Rep | null> {
  const updates: Record<string, unknown> = {};
  if (input.moves !== undefined) updates.moves = input.moves;
  if (input.openingName !== undefined) updates.opening_name = input.openingName;
  if (input.openingType !== undefined) updates.opening_type = input.openingType;
  if (input.title !== undefined) updates.title = input.title;
  if (input.ply !== undefined) updates.ply = input.ply;
  if (input.pgn !== undefined) updates.pgn = input.pgn;

  const { data, error } = await supabase
    .from("reps")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("reps.repository.update error:", error);
    return null;
  }

  return toRep(data);
}

export async function remove(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from("reps").delete().eq("id", id);

  if (error) {
    console.error("reps.repository.remove error:", error);
    return false;
  }

  return true;
}
