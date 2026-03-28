/**
 * Openings Service
 *
 * Responsibility: Opening and opening variant business logic.
 */
import * as openingVariantRepo from "@/features/openings/repository/opening-variant.repository";
import type { OpeningWithVariantCount } from "@/features/openings/repository/opening.repository";
import * as openingRepo from "@/features/openings/repository/opening.repository";
import * as userOpeningVariantRepo from "@/features/openings/repository/user-opening-variant.repository";
import type { Opening } from "@/features/openings/types/opening";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAllOpenings(
  supabase: SupabaseClient,
): Promise<Opening[]> {
  return openingRepo.findAll(supabase);
}

export async function getOpeningsWithVariantCount(
  supabase: SupabaseClient,
): Promise<OpeningWithVariantCount[]> {
  return openingRepo.findAllWithVariantCount(supabase);
}

export async function getVariantCountsByOpeningIds(
  supabase: SupabaseClient,
  openingIds: string[],
): Promise<Record<string, number>> {
  return openingVariantRepo.getVariantCountsByOpeningIds(supabase, openingIds);
}

export async function getOpeningById(
  supabase: SupabaseClient,
  id: string,
): Promise<Opening | null> {
  return openingRepo.findById(supabase, id);
}

export async function getOpeningBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<Opening | null> {
  return openingRepo.findBySlug(supabase, slug);
}

export async function createOpening(
  supabase: SupabaseClient,
  input: openingRepo.CreateOpeningInput,
): Promise<Opening | null> {
  return openingRepo.create(supabase, input);
}

export async function updateOpening(
  supabase: SupabaseClient,
  id: string,
  input: openingRepo.UpdateOpeningInput,
): Promise<Opening | null> {
  return openingRepo.update(supabase, id, input);
}

export async function deleteOpening(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  return openingRepo.remove(supabase, id);
}

export async function getAllOpeningVariants(
  supabase: SupabaseClient,
): Promise<OpeningVariant[]> {
  return openingVariantRepo.findAll(supabase);
}

export async function getOpeningVariantsByOpeningId(
  supabase: SupabaseClient,
  openingId: string,
): Promise<OpeningVariant[]> {
  return openingVariantRepo.findByOpeningId(supabase, openingId);
}

export async function getOpeningVariantById(
  supabase: SupabaseClient,
  id: string,
): Promise<OpeningVariant | null> {
  return openingVariantRepo.findById(supabase, id);
}

export async function createOpeningVariant(
  supabase: SupabaseClient,
  input: openingVariantRepo.CreateOpeningVariantInput,
): Promise<OpeningVariant | null> {
  return openingVariantRepo.create(supabase, input);
}

export async function updateOpeningVariant(
  supabase: SupabaseClient,
  id: string,
  input: openingVariantRepo.UpdateOpeningVariantInput,
): Promise<OpeningVariant | null> {
  return openingVariantRepo.update(supabase, id, input);
}

export async function deleteOpeningVariant(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  const cleared = await userOpeningVariantRepo.removeByOpeningVariantId(
    supabase,
    id,
  );
  if (!cleared) return false;
  return openingVariantRepo.remove(supabase, id);
}

export async function getCorrectlySolvedVariantIds(
  supabase: SupabaseClient,
  userId: string,
  openingVariantIds: string[],
): Promise<Set<string>> {
  return userOpeningVariantRepo.findCorrectlySolvedVariantIds(
    supabase,
    userId,
    openingVariantIds,
  );
}

export async function getOpeningVariantAttemptsForVariants(
  supabase: SupabaseClient,
  userId: string,
  openingVariantIds: string[],
) {
  const all = await userOpeningVariantRepo.findOpeningVariantAttempts(
    supabase,
    userId,
  );
  const idSet = new Set(openingVariantIds);
  return all.filter((a) => idSet.has(a.openingVariantId));
}

export async function upsertOpeningVariantAttempt(
  supabase: SupabaseClient,
  userId: string,
  openingVariantId: string,
  isCorrect: boolean,
  options?: { userMoveSan?: string | null; timeSpentSeconds?: number | null },
): Promise<void> {
  return userOpeningVariantRepo.upsert(
    supabase,
    userId,
    openingVariantId,
    isCorrect,
    options,
  );
}
