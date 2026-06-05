/**
 * Collection Repository
 *
 * Responsibility: CRUD access to the collections table.
 */

import { toCollection } from "@/features/collection/mapper/collection.mapper";
import type { Collection, CollectionWithRiddleCount } from "@/features/collection/types/collection";
import {
  DEFAULT_COLLECTION_DIFFICULTY,
  type CollectionDifficulty,
} from "@/features/collection/types/collection-difficulty";
import type { CollectionType } from "@/features/collection/types/collection-type";
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

export async function findCustomByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("created_by", userId)
    .eq("collection_type", "custom")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("collection.repository.findCustomByUserId error:", error);
    return [];
  }

  return (data ?? []).map(toCollection);
}

export async function findOnboardingStarterForUser(
  supabase: SupabaseClient,
  userId: string,
  slug: string,
): Promise<Collection | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("created_by", userId)
    .eq("collection_type", "custom")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("collection.repository.findOnboardingStarterForUser error:", error);
    return null;
  }

  if (!data) return null;
  return toCollection(data);
}

export async function findCustomByUserIdWithRiddleCount(
  supabase: SupabaseClient,
  userId: string,
): Promise<CollectionWithRiddleCount[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*, riddle_collections(count)")
    .eq("created_by", userId)
    .eq("collection_type", "custom")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("collection.repository.findCustomByUserIdWithRiddleCount error:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const db = row as DbCollectionWithRiddleCount;
    const riddleCount = db.riddle_collections?.[0]?.count ?? 0;
    return { ...toCollection(db), riddleCount };
  });
}

type DbCollectionWithRiddleCount = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  cover_image_color: string;
  difficulty: CollectionDifficulty;
  collection_type: CollectionType;
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
    .eq("collection_type", "admin")
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
  difficulty?: CollectionDifficulty;
  collectionType?: CollectionType;
  sortOrder?: number;
  isActive?: boolean;
  createdBy?: string | null;
};

export type CreateCustomCollectionForUserInput = {
  title: string;
  description?: string;
  slug?: string;
  createdBy: string;
  coverImageUrl: string;
  coverImageColor: string;
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
      difficulty: input.difficulty ?? DEFAULT_COLLECTION_DIFFICULTY,
      collection_type: input.collectionType ?? "admin",
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

export async function createCustomForUser(
  supabase: SupabaseClient,
  input: CreateCustomCollectionForUserInput,
): Promise<Collection | null> {
  const description = input.description?.trim() ?? "";

  const { data, error } = await supabase
    .from("collections")
    .insert({
      title: input.title.trim(),
      slug: input.slug?.trim() || slugFromTitle(input.title),
      description,
      cover_image_url: input.coverImageUrl,
      cover_image_color: input.coverImageColor,
      difficulty: null,
      collection_type: "custom",
      is_active: true,
      created_by: input.createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error("collection.repository.createCustomForUser error:", error);
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
  difficulty?: CollectionDifficulty;
  collectionType?: CollectionType;
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
  if (input.difficulty !== undefined) updates.difficulty = input.difficulty;
  if (input.collectionType !== undefined) updates.collection_type = input.collectionType;
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

export async function updateCustomForUser(
  supabase: SupabaseClient,
  input: { id: string; userId: string; title: string; description?: string },
): Promise<Collection | null> {
  const description = input.description?.trim() ?? "";

  const { data, error } = await supabase
    .from("collections")
    .update({
      title: input.title.trim(),
      slug: slugFromTitle(input.title),
      description,
    })
    .eq("id", input.id)
    .eq("created_by", input.userId)
    .eq("collection_type", "custom")
    .select()
    .maybeSingle();

  if (error) {
    console.error("collection.repository.updateCustomForUser error:", error);
    return null;
  }

  if (!data) return null;
  return toCollection(data);
}

export async function removeCustomForUser(
  supabase: SupabaseClient,
  input: { id: string; userId: string },
): Promise<boolean> {
  const { error, count } = await supabase
    .from("collections")
    .delete({ count: "exact" })
    .eq("id", input.id)
    .eq("created_by", input.userId)
    .eq("collection_type", "custom");

  if (error) {
    console.error("collection.repository.removeCustomForUser error:", error);
    return false;
  }

  return Boolean((count ?? 0) > 0);
}
