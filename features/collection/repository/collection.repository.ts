/**
 * Collection Repository
 *
 * Responsibility: CRUD access to the collections table.
 */

import { toCollection } from "@/features/collection/mapper/collection.mapper";
import type { Collection, CollectionWithRiddleCount } from "@/features/collection/types/collection";
import { slugify } from "@/lib/utils/slugify";
import type { SupabaseClient } from "@supabase/supabase-js";

function slugFromTitle(title: string): string {
  return slugify(title) || "collection";
}

export async function findAll(supabase: SupabaseClient): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("collection.repository.findAll error:", error);
    return [];
  }

  return (data ?? []).map(toCollection);
}

export async function findAllActive(supabase: SupabaseClient): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("collection.repository.findAllActive error:", error);
    return [];
  }

  return (data ?? []).map(toCollection);
}

type DbCollectionWithRiddleCount = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  cover_image_color: string;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  riddle_collections: [{ count: number }];
};

export async function findAllWithRiddleCount(
  supabase: SupabaseClient,
): Promise<CollectionWithRiddleCount[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*, riddle_collections(count)")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("collection.repository.findAllWithRiddleCount error:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const db = row as DbCollectionWithRiddleCount;
    const riddleCount = db.riddle_collections?.[0]?.count ?? 0;
    return { ...toCollection(db), riddleCount };
  });
}

export async function findAllActiveWithRiddleCount(
  supabase: SupabaseClient,
): Promise<CollectionWithRiddleCount[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*, riddle_collections(count)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("collection.repository.findAllActiveWithRiddleCount error:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const db = row as DbCollectionWithRiddleCount;
    const riddleCount = db.riddle_collections?.[0]?.count ?? 0;
    return { ...toCollection(db), riddleCount };
  });
}

export async function findById(supabase: SupabaseClient, id: string): Promise<Collection | null> {
  const { data, error } = await supabase.from("collections").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("collection.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toCollection(data);
}

export async function findBySlug(supabase: SupabaseClient, slug: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("collection.repository.findBySlug error:", error);
    return null;
  }

  if (!data) return null;

  return toCollection(data);
}

export type CreateCollectionInput = {
  title: string;
  slug?: string;
  description: string;
  coverImageUrl: string;
  coverImageColor: string;
  sortOrder?: number;
  isActive?: boolean;
  createdBy?: string | null;
};

export async function create(
  supabase: SupabaseClient,
  input: CreateCollectionInput,
): Promise<Collection | null> {
  const { data, error } = await supabase
    .from("collections")
    .insert({
      title: input.title.trim(),
      slug: input.slug?.trim() || slugFromTitle(input.title),
      description: input.description.trim(),
      cover_image_url: input.coverImageUrl,
      cover_image_color: input.coverImageColor,
      sort_order: input.sortOrder ?? 0,
      is_active: input.isActive ?? true,
      created_by: input.createdBy ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("collection.repository.create error:", error);
    return null;
  }

  return toCollection(data);
}

export type UpdateCollectionInput = {
  title?: string;
  slug?: string;
  description?: string;
  coverImageUrl?: string;
  coverImageColor?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateCollectionInput,
): Promise<Collection | null> {
  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.slug !== undefined) updates.slug = input.slug.trim();
  if (input.description !== undefined) updates.description = input.description.trim();
  if (input.coverImageUrl !== undefined) updates.cover_image_url = input.coverImageUrl;
  if (input.coverImageColor !== undefined) updates.cover_image_color = input.coverImageColor;
  if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;
  if (input.isActive !== undefined) updates.is_active = input.isActive;

  const { data, error } = await supabase
    .from("collections")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("collection.repository.update error:", error);
    return null;
  }

  return toCollection(data);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) {
    console.error("collection.repository.remove error:", error);
    return false;
  }

  return true;
}
