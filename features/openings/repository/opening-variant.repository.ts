/**
 * Opening Variant Repository
 *
 * Responsibility: CRUD access to the opening_variants table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import { toOpeningVariant } from "@/features/openings/mapper/opening-variant.mapper";

export async function findAll(
  supabase: SupabaseClient,
): Promise<OpeningVariant[]> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("*")
    .order("ply", { ascending: true });

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
    if (error.code !== "PGRST116") {
      console.error("opening-variant.repository.findById error:", error);
    }
    return null;
  }

  if (!data) return null;

  return toOpeningVariant(data);
}

export async function findByOpeningId(
  supabase: SupabaseClient,
  openingId: string,
): Promise<OpeningVariant[]> {
  const { data, error } = await supabase
    .from("opening_variants")
    .select("*")
    .eq("opening_id", openingId)
    .order("ply", { ascending: true });

  if (error) {
    console.error("opening-variant.repository.findByOpeningId error:", error);
    return [];
  }

  return (data ?? []).map(toOpeningVariant);
}

export type CreateOpeningVariantInput = {
  openingId: string;
  parentVariantId?: string | null;
  title?: string | null;
  ecoCode?: string | null;
  moves: string;
  fen?: string | null;
  moveCount?: number | null;
  ply?: number;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOpeningVariantInput,
): Promise<OpeningVariant | null> {
  const { data, error } = await supabase
    .from("opening_variants")
    .insert({
      opening_id: input.openingId,
      parent_variant_id: input.parentVariantId ?? null,
      title: input.title ?? null,
      eco_code: input.ecoCode ?? null,
      moves: input.moves,
      fen: input.fen ?? null,
      move_count: input.moveCount ?? null,
      ply: input.ply ?? 0,
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
  parentVariantId?: string | null;
  title?: string | null;
  ecoCode?: string | null;
  moves?: string;
  fen?: string | null;
  moveCount?: number | null;
  ply?: number;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOpeningVariantInput,
): Promise<OpeningVariant | null> {
  const updates: Record<string, unknown> = {};
  if (input.parentVariantId !== undefined)
    updates.parent_variant_id = input.parentVariantId;
  if (input.title !== undefined) updates.title = input.title;
  if (input.ecoCode !== undefined) updates.eco_code = input.ecoCode;
  if (input.moves !== undefined) updates.moves = input.moves;
  if (input.fen !== undefined) updates.fen = input.fen;
  if (input.moveCount !== undefined) updates.move_count = input.moveCount;
  if (input.ply !== undefined) updates.ply = input.ply;

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
  const { error } = await supabase
    .from("opening_variants")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("opening-variant.repository.remove error:", error);
    return false;
  }

  return true;
}
