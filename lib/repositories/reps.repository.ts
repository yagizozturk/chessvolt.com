/**
 * Reps (Repertoire) Repository
 *
 * Responsibility: CRUD access to the reps table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Rep } from "@/lib/model/reps";
import { toRep } from "@/lib/mappers/reps";

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
  id: string
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
