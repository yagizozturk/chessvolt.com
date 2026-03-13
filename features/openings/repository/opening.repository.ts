/**
 * Opening Repository
 * CRUD access to the openings table (parent of opening_variants).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Opening } from "@/features/openings/types/opening";

type DbOpening = {
  id: string;
  name: string;
  eco_code: string | null;
  description: string | null;
  created_at: string;
  created_by: string | null;
};

function toOpening(db: DbOpening): Opening {
  return {
    id: db.id,
    name: db.name,
    ecoCode: db.eco_code,
    description: db.description,
    createdAt: db.created_at,
    createdBy: db.created_by,
  };
}

export async function findAll(
  supabase: SupabaseClient,
): Promise<Opening[]> {
  const { data, error } = await supabase
    .from("openings")
    .select("id, name, eco_code, description, created_at, created_by")
    .order("name", { ascending: true });

  if (error) {
    console.error("opening.repository.findAll error:", error);
    return [];
  }

  return (data ?? []).map(toOpening);
}

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<Opening | null> {
  const { data, error } = await supabase
    .from("openings")
    .select("id, name, eco_code, description, created_at, created_by")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return toOpening(data);
}

export type CreateOpeningInput = {
  name: string;
  ecoCode?: string | null;
  description?: string | null;
  createdBy?: string | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOpeningInput,
): Promise<Opening | null> {
  const { data, error } = await supabase
    .from("openings")
    .insert({
      name: input.name.trim(),
      eco_code: input.ecoCode ?? null,
      description: input.description ?? null,
      created_by: input.createdBy ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("opening.repository.create error:", error);
    return null;
  }

  return toOpening(data);
}

export type UpdateOpeningInput = {
  name?: string;
  ecoCode?: string | null;
  description?: string | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOpeningInput,
): Promise<Opening | null> {
  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.ecoCode !== undefined) updates.eco_code = input.ecoCode;
  if (input.description !== undefined) updates.description = input.description;

  const { data, error } = await supabase
    .from("openings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("opening.repository.update error:", error);
    return null;
  }

  return toOpening(data);
}

export async function remove(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from("openings").delete().eq("id", id);

  if (error) {
    console.error("opening.repository.remove error:", error);
    return false;
  }

  return true;
}
