/**
 * Openings Service
 *
 * Responsibility: Opening variant business logic.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { OpeningVariant } from "@/features/openings/types/opening-variant";
import * as openingVariantRepo from "@/features/openings/repository/opening-variant.repository";

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
  return openingVariantRepo.remove(supabase, id);
}
