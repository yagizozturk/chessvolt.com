// TODO: Refactor
/**
 * Theme Repository
 *
 * Responsibility: CRUD access to the themes table.
 */

import { toTheme, toThemes, type DbTheme } from "@/features/theme/mapper/theme.mapper";
import type { Theme } from "@/features/theme/types/theme";
import type { ThemeCategory } from "@/features/theme/types/theme-category";
import { slugify } from "@/lib/utils/slugify";
import type { SupabaseClient } from "@supabase/supabase-js";

function slugFromTitle(title: string): string {
  return slugify(title) || "theme";
}

export async function findAll(supabase: SupabaseClient): Promise<Theme[]> {
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("theme.repository.findAll error:", error);
    return [];
  }

  return toThemes((data ?? []) as DbTheme[]);
}

export async function findById(supabase: SupabaseClient, id: string): Promise<Theme | null> {
  const { data, error } = await supabase.from("themes").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("theme.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toTheme(data as DbTheme);
}

export async function findBySlug(supabase: SupabaseClient, slug: string): Promise<Theme | null> {
  const { data, error } = await supabase.from("themes").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("theme.repository.findBySlug error:", error);
    return null;
  }

  if (!data) return null;

  return toTheme(data as DbTheme);
}

export async function findBySlugs(supabase: SupabaseClient, slugs: string[]): Promise<Theme[]> {
  const unique = [...new Set(slugs.map((slug) => slug.trim()).filter(Boolean))];
  if (unique.length === 0) return [];

  const { data, error } = await supabase.from("themes").select("*").in("slug", unique);

  if (error) {
    console.error("theme.repository.findBySlugs error:", error);
    return [];
  }

  return toThemes((data ?? []) as DbTheme[]);
}

export type CreateThemeInput = {
  title: string;
  slug?: string;
  description?: string | null;
  category: ThemeCategory;
  sortOrder?: number;
  isActive?: boolean;
};

export async function create(supabase: SupabaseClient, input: CreateThemeInput): Promise<Theme | null> {
  const description = input.description?.trim() ?? null;

  const { data, error } = await supabase
    .from("themes")
    .insert({
      title: input.title.trim(),
      slug: input.slug?.trim() || slugFromTitle(input.title),
      description: description || null,
      category: input.category,
      sort_order: input.sortOrder ?? 0,
      is_active: input.isActive ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("theme.repository.create error:", error);
    return null;
  }

  return toTheme(data as DbTheme);
}

export type UpdateThemeInput = {
  title?: string;
  slug?: string;
  description?: string | null;
  category?: ThemeCategory;
  sortOrder?: number;
  isActive?: boolean;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateThemeInput,
): Promise<Theme | null> {
  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.slug !== undefined) updates.slug = input.slug.trim();
  if (input.description !== undefined) {
    const trimmed = input.description?.trim() ?? "";
    updates.description = trimmed || null;
  }
  if (input.category !== undefined) updates.category = input.category;
  if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;
  if (input.isActive !== undefined) updates.is_active = input.isActive;

  const { data, error } = await supabase.from("themes").update(updates).eq("id", id).select().single();

  if (error) {
    console.error("theme.repository.update error:", error);
    return null;
  }

  return toTheme(data as DbTheme);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("themes").delete().eq("id", id);

  if (error) {
    console.error("theme.repository.remove error:", error);
    return false;
  }

  return true;
}
