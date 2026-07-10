// TODO: Refactor
/**
 * Riddle Service
 *
 * Responsibility: Riddle business logic and orchestration.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as riddleThemeService from "@/features/riddle-theme/services/riddle-theme.service";
import { RANDOM_RIDDLES_COUNT, RIDDLES_THEME_FILTER_ALL } from "@/features/riddle/constants/riddles-list.constants";
import * as riddleRepo from "@/features/riddle/repository/riddle.repository";
import type { Riddle } from "@/features/riddle/types/riddle";
import { type RiddleRatingBand, getRiddleRatingBandRange } from "@/features/riddle/types/riddle-rating";
import type { RiddleWithThemes } from "@/features/riddle/types/riddle-with-themes";
import { shuffle } from "@/lib/utils/shuffle";

export async function getAllRiddlesWithThemes(supabase: SupabaseClient): Promise<RiddleWithThemes[]> {
  const riddles = await riddleRepo.findAll(supabase);
  return riddleThemeService.attachThemeSlugsToRiddles(supabase, riddles);
}

export async function getRiddleById(supabase: SupabaseClient, id: string): Promise<Riddle | null> {
  return riddleRepo.findById(supabase, id);
}

export async function getAllActiveRiddles(supabase: SupabaseClient): Promise<Riddle[]> {
  return riddleRepo.findAllActive(supabase);
}

export async function getRiddleByIdWithThemes(supabase: SupabaseClient, id: string): Promise<RiddleWithThemes | null> {
  const riddle = await riddleRepo.findById(supabase, id);
  if (!riddle) return null;

  const slugsByRiddleId = await riddleThemeService.getThemeSlugsByRiddleIds(supabase, [id]);
  return riddleThemeService.withThemeSlugs(riddle, slugsByRiddleId.get(id) ?? []);
}

export async function getActiveRiddlesByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<Riddle[]> {
  return riddleRepo.findActiveByCollectionId(supabase, collectionId);
}

export type GetActiveRiddlesByCollectionIdPageInput = {
  page: number;
  pageSize: number;
};

export type ActiveRiddlesByCollectionIdPage = {
  riddles: Riddle[];
  totalCount: number;
};

export async function getActiveRiddlesByCollectionIdPage(
  supabase: SupabaseClient,
  collectionId: string,
  input: GetActiveRiddlesByCollectionIdPageInput,
): Promise<ActiveRiddlesByCollectionIdPage> {
  const offset = (input.page - 1) * input.pageSize;
  const [riddles, totalCount] = await Promise.all([
    riddleRepo.findActiveByCollectionId(supabase, collectionId, {
      offset,
      limit: input.pageSize,
    }),
    riddleRepo.countActiveByCollectionId(supabase, collectionId),
  ]);

  return { riddles, totalCount };
}

export async function countActiveRiddlesByCollectionId(
  supabase: SupabaseClient,
  collectionId: string,
): Promise<number> {
  return riddleRepo.countActiveByCollectionId(supabase, collectionId);
}

export async function getRandomActiveRiddles(
  supabase: SupabaseClient,
  input: { themeSlug?: string; ratingBand?: RiddleRatingBand; count?: number } = {},
): Promise<Riddle[]> {
  const count = input.count ?? RANDOM_RIDDLES_COUNT;
  const themeSlug = input.themeSlug?.trim();
  const ratingBand = input.ratingBand ?? "all";
  const ratingRange = getRiddleRatingBandRange(ratingBand);

  let riddles: Riddle[];

  if (themeSlug && themeSlug !== RIDDLES_THEME_FILTER_ALL) {
    const riddleIds = await riddleThemeService.findRiddleIdsByThemeSlugs(supabase, [themeSlug]);
    if (riddleIds.length === 0) return [];

    riddles = await riddleRepo.findActiveByIds(supabase, {
      ids: riddleIds,
      limit: riddleIds.length,
      ...(ratingRange ? { minRating: ratingRange.minRating, maxRating: ratingRange.maxRating } : {}),
    });
  } else if (ratingRange) {
    riddles = await riddleRepo.findActiveByRatingRange(supabase, {
      minRating: ratingRange.minRating,
      maxRating: ratingRange.maxRating,
      limit: 500,
    });
  } else {
    riddles = await riddleRepo.findAllActive(supabase);
  }

  return shuffle(riddles).slice(0, count);
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
