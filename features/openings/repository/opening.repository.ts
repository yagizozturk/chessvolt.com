/**
 * Opening Repository
 * Fetches openings (parent of opening_variants).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Opening } from "@/features/openings/types/opening";

type DbOpening = {
  id: string;
  slug: string;
  name: string | null;
};

function toOpening(db: DbOpening): Opening {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
  };
}

export async function findAll(
  supabase: SupabaseClient,
): Promise<Opening[]> {
  const { data, error } = await supabase
    .from("openings")
    .select("id, slug, name")
    .order("slug", { ascending: true });

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
    .select("id, slug, name")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return toOpening(data);
}

export async function findBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<Opening | null> {
  const { data, error } = await supabase
    .from("openings")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return toOpening(data);
}
