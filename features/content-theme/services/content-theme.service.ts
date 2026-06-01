/**
 * Content Theme Service
 *
 * Responsibility: Business logic for content_themes join rows.
 * - Uses repository (does not touch Supabase directly)
 */

import * as contentThemeRepo from "@/features/content-theme/repository/content-theme.repository";
import type { ContentTheme, ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";
import type { ContentType } from "@/features/content-theme/types/content-type";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getContentThemeById(
  supabase: SupabaseClient,
  id: string,
): Promise<ContentTheme | null> {
  return contentThemeRepo.findById(supabase, id);
}

export async function getContentThemeByIdWithTheme(
  supabase: SupabaseClient,
  id: string,
): Promise<ContentThemeWithTheme | null> {
  return contentThemeRepo.findByIdWithTheme(supabase, id);
}

export async function getAllContentThemes(supabase: SupabaseClient): Promise<ContentTheme[]> {
  return contentThemeRepo.findAll(supabase);
}

export async function getAllContentThemesWithTheme(
  supabase: SupabaseClient,
): Promise<ContentThemeWithTheme[]> {
  return contentThemeRepo.findAllWithTheme(supabase);
}

export async function getContentThemesForContent(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
): Promise<ContentTheme[]> {
  return contentThemeRepo.findByContent(supabase, contentType, contentId);
}

export async function getContentThemesForContentWithTheme(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
): Promise<ContentThemeWithTheme[]> {
  return contentThemeRepo.findByContentWithTheme(supabase, contentType, contentId);
}

export async function getContentThemesForTheme(
  supabase: SupabaseClient,
  themeId: string,
): Promise<ContentTheme[]> {
  return contentThemeRepo.findByThemeId(supabase, themeId);
}

export async function getContentThemeByTriple(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
  themeId: string,
): Promise<ContentTheme | null> {
  return contentThemeRepo.findByTriple(supabase, contentType, contentId, themeId);
}

export async function addContentTheme(
  supabase: SupabaseClient,
  input: contentThemeRepo.CreateContentThemeInput,
): Promise<ContentTheme | null> {
  return contentThemeRepo.create(supabase, input);
}

export async function addContentThemes(
  supabase: SupabaseClient,
  inputs: contentThemeRepo.CreateContentThemeInput[],
): Promise<ContentTheme[]> {
  return contentThemeRepo.createMany(supabase, inputs);
}

export async function updateContentTheme(
  supabase: SupabaseClient,
  id: string,
  input: contentThemeRepo.UpdateContentThemeInput,
): Promise<ContentTheme | null> {
  return contentThemeRepo.update(supabase, id, input);
}

export async function setContentThemesForContent(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
  inputs: contentThemeRepo.CreateContentThemeInput[],
): Promise<ContentTheme[]> {
  return contentThemeRepo.replaceForContent(supabase, contentType, contentId, inputs);
}

export async function deleteContentTheme(supabase: SupabaseClient, id: string): Promise<boolean> {
  return contentThemeRepo.remove(supabase, id);
}

export async function deleteContentThemesForContent(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
): Promise<boolean> {
  return contentThemeRepo.removeByContent(supabase, contentType, contentId);
}

export async function removeContentThemeLink(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
  themeId: string,
): Promise<boolean> {
  return contentThemeRepo.removeByTriple(supabase, contentType, contentId, themeId);
}
