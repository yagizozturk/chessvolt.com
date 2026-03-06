/**
 * Puzzle Repository
 *
 * Responsibility: CRUD access to the puzzles table.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Puzzle } from "@/lib/model/puzzle";
import { toPuzzle } from "@/lib/mappers/puzzle";

export async function findAll(
  supabase: SupabaseClient
): Promise<Puzzle[]> {
  const { data: puzzles, error } = await supabase
    .from("puzzles")
    .select("*");

  if (error) {
    console.error("puzzle.repository.findAll error:", error);
    return [];
  }

  return (puzzles ?? []).map(toPuzzle);
}

export async function findById(
  supabase: SupabaseClient,
  id: string
): Promise<Puzzle | null> {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("puzzle.repository.findById error:", error);
    }
    return null;
  }

  if (!data) return null;

  return toPuzzle(data);
}

export async function findByIds(
  supabase: SupabaseClient,
  ids: string[]
): Promise<Puzzle[]> {
  if (ids.length === 0) return [];

  const { data: puzzles, error } = await supabase
    .from("puzzles")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("puzzle.repository.findByIds error:", error);
    return [];
  }

  return (puzzles ?? []).map(toPuzzle);
}
