/**
 * Opening Repository
 * CRUD access to the openings table (parent of opening_variants).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Opening } from "@/features/openings/types/opening";
import { slugify } from "@/lib/utilities/slugify";

function slugFromName(name: string): string {
  return slugify(name) || "opening";
}

type DbOpening = {
  id: string;
  name: string;
  slug: string | null;
  eco_code: string | null;
  description: string | null;
  display_fen: string | null;
  created_at: string;
};

function toOpening(db: DbOpening): Opening {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    ecoCode: db.eco_code,
    description: db.description,
    displayFen: db.display_fen ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    createdAt: db.created_at,
  };
}

export async function findAll(
  supabase: SupabaseClient,
): Promise<Opening[]> {
  const { data, error } = await supabase
    .from("openings")
    .select("id, name, slug, eco_code, description, display_fen, created_at")
    .order("name", { ascending: true });

  if (error) {
    console.error("opening.repository.findAll error:", error);
    return [];
  }

  return (data ?? []).map(toOpening);
}

export async function findBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<Opening | null> {
  const { data, error } = await supabase
    .from("openings")
    .select("id, name, slug, eco_code, description, display_fen, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("opening.repository.findBySlug error:", error);
    return null;
  }
  if (!data) return null;
  return toOpening(data);
}

export async function findById(
  supabase: SupabaseClient,
  id: string,
): Promise<Opening | null> {
  const { data, error } = await supabase
    .from("openings")
    .select("id, name, slug, eco_code, description, display_fen, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("opening.repository.findById error:", error);
    return null;
  }
  if (!data) return null;
  return toOpening(data);
}

export type CreateOpeningInput = {
  name: string;
  slug?: string | null;
  ecoCode?: string | null;
  description?: string | null;
  displayFen?: string | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateOpeningInput,
): Promise<Opening | null> {
  const { data, error } = await supabase
    .from("openings")
    .insert({
      name: input.name.trim(),
      slug: input.slug ?? slugFromName(input.name),
      eco_code: input.ecoCode ?? null,
      description: input.description ?? null,
      display_fen: input.displayFen ?? null,
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
  slug?: string | null;
  ecoCode?: string | null;
  description?: string | null;
  displayFen?: string | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOpeningInput,
): Promise<Opening | null> {
  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.slug !== undefined) updates.slug = input.slug;
  if (input.ecoCode !== undefined) updates.eco_code = input.ecoCode;
  if (input.description !== undefined) updates.description = input.description;
  if (input.displayFen !== undefined) updates.display_fen = input.displayFen;

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
