/**
 * Riddle Service
 *
 * Responsibility: Riddle business logic and orchestration.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as riddleThemeService from "@/features/riddle-theme/services/riddle-theme.service";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import type { CollectionRiddle } from "@/features/riddle/types/collection-riddle";
import type { Riddle } from "@/features/riddle/types/riddle";
import type { RiddleWithThemes } from "@/features/riddle/types/riddle-with-themes";

export async function getAllRiddles(supabase: SupabaseClient): Promise<Riddle[]> {
  return riddleRepo.findAll(supabase);
}

export async function getAllRiddlesWithThemes(supabase: SupabaseClient): Promise<RiddleWithThemes[]> {
  const riddles = await riddleRepo.findAll(supabase);
  return riddleThemeService.attachThemeSlugsToRiddles(supabase, riddles);
}

export async function getActiveRiddles(supabase: SupabaseClient): Promise<Riddle[]> {
  return riddleRepo.findAllActive(supabase);
}

export async function getRiddleById(supabase: SupabaseClient, id: string): Promise<Riddle | null> {
  return riddleRepo.findById(supabase, id);
}

export async function getRiddleByIdWithThemes(supabase: SupabaseClient, id: string): Promise<RiddleWithThemes | null> {
  const riddle = await riddleRepo.findById(supabase, id);
  if (!riddle) return null;

  const slugsByRiddleId = await riddleThemeService.getThemeSlugsByRiddleIds(supabase, [id]);
  return riddleThemeService.withThemeSlugs(riddle, slugsByRiddleId.get(id) ?? []);
}

export async function getRiddlesByGameId(supabase: SupabaseClient, gameId: string): Promise<Riddle[]> {
  return riddleRepo.findByGameId(supabase, gameId);
}

// ================================================================================================
// Getting riddles by collection id
// ================================================================================================
export async function getRiddlesByCollectionId(supabase: SupabaseClient, collectionId: string): Promise<Riddle[]> {
  return riddleRepo.findByCollectionId(supabase, collectionId);
}

export async function getActiveRiddlesByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<Riddle[]> {
  return riddleRepo.findActiveByCollectionId(supabase, collectionId);
}

// ================================================================================================
// Getting riddles by collection ids
// ================================================================================================
export async function getRiddlesByCollectionIds(
  supabase: SupabaseClient,
  collectionIds: string[],
): Promise<CollectionRiddle[]> {
  return riddleRepo.findByCollectionIds(supabase, collectionIds);
}

export async function getActiveRiddlesByCollectionIds(
  supabase: SupabaseClient,
  collectionIds: string[],
): Promise<CollectionRiddle[]> {
  return riddleRepo.findActiveByCollectionIds(supabase, collectionIds);
}

export type FindActiveRiddlesByThemesInput = {
  themeSlugs: string[];
  limit?: number;
};

export async function findActiveRiddlesByThemes(
  supabase: SupabaseClient,
  input: FindActiveRiddlesByThemesInput,
): Promise<Riddle[]> {
  if (input.themeSlugs.length === 0) return [];

  const riddleIds = await riddleThemeService.findRiddleIdsByThemeSlugs(supabase, input.themeSlugs);
  return riddleRepo.findActiveByIds(supabase, {
    ids: riddleIds,
    limit: input.limit,
    orderBy: "created_at",
  });
}

export type FindActiveRiddlesByThemesAndRatingRangeInput = {
  themeSlugs: string[];
  minRating: number;
  maxRating: number;
  limit?: number;
};

export async function findActiveRiddlesByThemesAndRatingRange(
  supabase: SupabaseClient,
  input: FindActiveRiddlesByThemesAndRatingRangeInput,
): Promise<Riddle[]> {
  if (input.themeSlugs.length === 0) return [];

  const riddleIds = await riddleThemeService.findRiddleIdsByThemeSlugs(supabase, input.themeSlugs);
  return riddleRepo.findActiveByIds(supabase, {
    ids: riddleIds,
    limit: input.limit,
    minRating: input.minRating,
    maxRating: input.maxRating,
    orderBy: "rating",
  });
}

export async function findActiveRiddlesByRatingRange(
  supabase: SupabaseClient,
  input: riddleRepo.FindActiveRiddlesByRatingRangeInput,
): Promise<Riddle[]> {
  return riddleRepo.findActiveByRatingRange(supabase, input);
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

export async function deleteRiddle(supabase: SupabaseClient, id: string): Promise<boolean> {
  return riddleRepo.remove(supabase, id);
}
