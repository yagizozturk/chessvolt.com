/**
 * Riddle Service
 *
 * Responsibility: Riddle business logic and orchestration.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Riddle } from "@/features/riddle/types/riddle";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";

export async function getAllRiddles(supabase: SupabaseClient): Promise<Riddle[]> {
  return riddleRepo.findAll(supabase);
}

export async function getActiveRiddles(supabase: SupabaseClient): Promise<Riddle[]> {
  return riddleRepo.findAllActive(supabase);
}

export async function getRiddleById(
  supabase: SupabaseClient,
  id: string,
): Promise<Riddle | null> {
  return riddleRepo.findById(supabase, id);
}

export async function getRiddlesByGameId(
  supabase: SupabaseClient,
  gameId: string,
): Promise<Riddle[]> {
  return riddleRepo.findByGameId(supabase, gameId);
}

export async function getRiddlesByGameType(
  supabase: SupabaseClient,
  gameType: string,
  options?: { activeOnly?: boolean },
): Promise<Riddle[]> {
  return riddleRepo.findByGameType(supabase, gameType, options);
}

export async function createRiddle(
  supabase: SupabaseClient,
  input: riddleRepo.CreateRiddleInput,
): Promise<Riddle | null> {
  return riddleRepo.create(supabase, input);
}

export async function updateRiddle(
  supabase: SupabaseClient,
  id: string,
  input: riddleRepo.UpdateRiddleInput,
): Promise<Riddle | null> {
  return riddleRepo.update(supabase, id, input);
}

export async function deleteRiddle(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  return riddleRepo.remove(supabase, id);
}
