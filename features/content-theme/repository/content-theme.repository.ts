/**
 * Content Theme Repository
 *
 * Responsibility: CRUD access to the content_themes join table.
 */

import {
  toContentTheme,
  toContentThemes,
  toContentThemesWithTheme,
  toContentThemeWithTheme,
  type DbContentTheme,
  type DbContentThemeWithTheme,
} from "@/features/content-theme/mapper/content-theme.mapper";
import type { ContentTheme, ContentThemeWithTheme } from "@/features/content-theme/types/content-theme";
import type { ContentType } from "@/features/content-theme/types/content-type";
import {
  DEFAULT_CONTENT_THEME_WEIGHT,
  type ContentThemeWeight,
} from "@/features/content-theme/types/content-theme-weight";
import type { SupabaseClient } from "@supabase/supabase-js";

const CONTENT_THEME_SELECT = "*";
const CONTENT_THEME_WITH_THEME_SELECT = "*, themes (*)";

export async function findById(supabase: SupabaseClient, id: string): Promise<ContentTheme | null> {
  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("content-theme.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toContentTheme(data as DbContentTheme);
}

export async function findByIdWithTheme(
  supabase: SupabaseClient,
  id: string,
): Promise<ContentThemeWithTheme | null> {
  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_WITH_THEME_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("content-theme.repository.findByIdWithTheme error:", error);
    return null;
  }

  if (!data) return null;

  return toContentThemeWithTheme(data as DbContentThemeWithTheme);
}

export async function findAll(supabase: SupabaseClient): Promise<ContentTheme[]> {
  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("content-theme.repository.findAll error:", error);
    return [];
  }

  return toContentThemes((data ?? []) as DbContentTheme[]);
}

export async function findAllWithTheme(supabase: SupabaseClient): Promise<ContentThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_WITH_THEME_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("content-theme.repository.findAllWithTheme error:", error);
    return [];
  }

  return toContentThemesWithTheme((data ?? []) as DbContentThemeWithTheme[]);
}

export async function findByContent(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
): Promise<ContentTheme[]> {
  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_SELECT)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("content-theme.repository.findByContent error:", error);
    return [];
  }

  return toContentThemes((data ?? []) as DbContentTheme[]);
}

export async function findByContentWithTheme(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
): Promise<ContentThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_WITH_THEME_SELECT)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("content-theme.repository.findByContentWithTheme error:", error);
    return [];
  }

  return toContentThemesWithTheme((data ?? []) as DbContentThemeWithTheme[]);
}

export async function findByContentTypeForContentIds(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentIds: string[],
): Promise<ContentThemeWithTheme[]> {
  const uniqueIds = [...new Set(contentIds.map((id) => id.trim()).filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_WITH_THEME_SELECT)
    .eq("content_type", contentType)
    .in("content_id", uniqueIds)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("content-theme.repository.findByContentTypeForContentIds error:", error);
    return [];
  }

  return toContentThemesWithTheme((data ?? []) as DbContentThemeWithTheme[]);
}

export async function findByThemeId(supabase: SupabaseClient, themeId: string): Promise<ContentTheme[]> {
  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_SELECT)
    .eq("theme_id", themeId)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("content-theme.repository.findByThemeId error:", error);
    return [];
  }

  return toContentThemes((data ?? []) as DbContentTheme[]);
}

export async function findByTriple(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
  themeId: string,
): Promise<ContentTheme | null> {
  const { data, error } = await supabase
    .from("content_themes")
    .select(CONTENT_THEME_SELECT)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .eq("theme_id", themeId)
    .maybeSingle();

  if (error) {
    console.error("content-theme.repository.findByTriple error:", error);
    return null;
  }

  if (!data) return null;

  return toContentTheme(data as DbContentTheme);
}

export type CreateContentThemeInput = {
  contentType: ContentType;
  contentId: string;
  themeId: string;
  weight?: ContentThemeWeight;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateContentThemeInput,
): Promise<ContentTheme | null> {
  const { data, error } = await supabase
    .from("content_themes")
    .insert({
      content_type: input.contentType,
      content_id: input.contentId,
      theme_id: input.themeId,
      weight: input.weight ?? DEFAULT_CONTENT_THEME_WEIGHT,
    })
    .select()
    .single();

  if (error) {
    console.error("content-theme.repository.create error:", error);
    return null;
  }

  return toContentTheme(data as DbContentTheme);
}

export async function createMany(
  supabase: SupabaseClient,
  inputs: CreateContentThemeInput[],
): Promise<ContentTheme[]> {
  if (inputs.length === 0) return [];

  const rows = inputs.map((input) => ({
    content_type: input.contentType,
    content_id: input.contentId,
    theme_id: input.themeId,
    weight: input.weight ?? DEFAULT_CONTENT_THEME_WEIGHT,
  }));

  const { data, error } = await supabase.from("content_themes").insert(rows).select();

  if (error) {
    console.error("content-theme.repository.createMany error:", error);
    return [];
  }

  return toContentThemes((data ?? []) as DbContentTheme[]);
}

export type UpdateContentThemeInput = {
  weight?: ContentThemeWeight;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateContentThemeInput,
): Promise<ContentTheme | null> {
  const updates: Record<string, unknown> = {};
  if (input.weight !== undefined) updates.weight = input.weight;

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase
    .from("content_themes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("content-theme.repository.update error:", error);
    return null;
  }

  return toContentTheme(data as DbContentTheme);
}

export async function replaceForContent(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
  inputs: CreateContentThemeInput[],
): Promise<ContentTheme[]> {
  const { error: deleteError } = await supabase
    .from("content_themes")
    .delete()
    .eq("content_type", contentType)
    .eq("content_id", contentId);

  if (deleteError) {
    console.error("content-theme.repository.replaceForContent delete error:", deleteError);
    return [];
  }

  return createMany(supabase, inputs);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("content_themes").delete().eq("id", id);

  if (error) {
    console.error("content-theme.repository.remove error:", error);
    return false;
  }

  return true;
}

export async function removeByContent(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("content_themes")
    .delete()
    .eq("content_type", contentType)
    .eq("content_id", contentId);

  if (error) {
    console.error("content-theme.repository.removeByContent error:", error);
    return false;
  }

  return true;
}

export async function removeByTriple(
  supabase: SupabaseClient,
  contentType: ContentType,
  contentId: string,
  themeId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("content_themes")
    .delete()
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .eq("theme_id", themeId);

  if (error) {
    console.error("content-theme.repository.removeByTriple error:", error);
    return false;
  }

  return true;
}
