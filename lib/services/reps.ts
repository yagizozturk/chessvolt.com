/**
 * Reps (Repertoire) Service
 *
 * Responsibility: Repertoire business logic.
 * Currently wraps repository only.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Repartoire } from "@/lib/model/reps";
import * as repsRepo from "@/lib/repositories/reps.repository";

export async function getAllReps(
  supabase: SupabaseClient
): Promise<Repartoire[]> {
  return repsRepo.findAll(supabase);
}

export async function getRepById(
  supabase: SupabaseClient,
  id: string
): Promise<Repartoire | null> {
  return repsRepo.findById(supabase, id);
}
