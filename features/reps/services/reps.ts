/**
 * Reps (Repertoire) Service
 *
 * Responsibility: Repertoire business logic.
 * Currently wraps repository only.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Rep } from "@/features/reps/types/reps";
import * as repsRepo from "@/features/reps/repository/reps.repository";

export async function getAllReps(supabase: SupabaseClient): Promise<Rep[]> {
  return repsRepo.findAll(supabase);
}

export async function getRepsByOpeningType(
  supabase: SupabaseClient,
  openingType: string,
): Promise<Rep[]> {
  const all = await repsRepo.findAll(supabase);
  const normalized = openingType.trim().toLowerCase();
  return all.filter(
    (r) => r.openingType?.trim().toLowerCase() === normalized,
  );
}

export async function getRepById(
  supabase: SupabaseClient,
  id: string,
): Promise<Rep | null> {
  return repsRepo.findById(supabase, id);
}

export async function createRep(
  supabase: SupabaseClient,
  input: repsRepo.CreateRepInput,
): Promise<Rep | null> {
  return repsRepo.create(supabase, input);
}

export async function updateRep(
  supabase: SupabaseClient,
  id: string,
  input: repsRepo.UpdateRepInput,
): Promise<Rep | null> {
  return repsRepo.update(supabase, id, input);
}

export async function deleteRep(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  return repsRepo.remove(supabase, id);
}
