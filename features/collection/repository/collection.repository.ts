// TODO: Refactor
import type { SupabaseClient } from "@supabase/supabase-js";

import { toCollectionWithRiddleCountAndThemes } from "@/features/collection-theme/mapper/collection-theme.mapper";
import { toCollection, toCollectionWithRiddleCount } from "@/features/collection/mapper/collection.mapper";
import type {
  Collection,
  CollectionWithRiddleCount,
  CollectionWithRiddleCountAndThemes,
} from "@/features/collection/types/collection";
import { DEFAULT_COLLECTION_DIFFICULTY } from "@/features/collection/constants/collection-difficulty.constants";
import type { CollectionType } from "@/features/collection/types/collection-type";
import type {
  CreateCollectionPayload,
  CreateCustomCollectionForUserPayload,
  DeleteCustomCollectionForUserPayload,
  UpdateCollectionPayload,
  UpdateCustomCollectionForUserPayload,
} from "@/features/collection/types/collection-payload";
import { slugify } from "@/lib/utils/slugify";

function slugFromTitle(title: string): string {
  return slugify(title) || "collection";
}

// ============================================================================
// Finding all collections
// ============================================================================
export async function findAllCollections(supabase: SupabaseClient): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true }) // increasing order
    .order("title", { ascending: true });

  if (error) {
    console.error("collection.repository.findAllCollections error:", error);
    return [];
  }

  return (data ?? []).map(toCollection);
}

// ============================================================================
// Finding user collections by User Id
// ============================================================================
export async function findUserCollectionByUserId(
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
    console.error("collection.repository.findUserCollectionByUserId error:", error);
    return [];
  }

  return (data ?? []).map(toCollection);
}

// ============================================================================
// Finding user custom collection by slug for a user
// ============================================================================
export async function findUserCustomCollectionBySlug(
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
    console.error("collection.repository.findUserCustomCollectionBySlug error:", error);
    return null;
  }

  if (!data) return null;
  return toCollection(data);
}

const COLLECTION_WITH_RIDDLE_COUNT_AND_THEMES_SELECT =
  "*, collection_riddles(count), collection_themes(id, collection_id, theme_id, weight, created_at, themes(*))";

// ============================================================================
// Finding all collections with Riddle Count
// ============================================================================
export async function findAllCollectionsWithRiddleCount(
  supabase: SupabaseClient,
): Promise<CollectionWithRiddleCount[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*, collection_riddles(count)")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("collection.repository.findAllCollectionsWithRiddleCount error:", error);
    return [];
  }

  return (data ?? []).map(toCollectionWithRiddleCount);
}

// ============================================================================
// Finding all ACTIVE collections with Riddle Count and Themes
// ============================================================================
export async function findAllActiveCollectionsWithRiddleCountAndThemes(
  supabase: SupabaseClient,
): Promise<CollectionWithRiddleCountAndThemes[]> {
  const { data, error } = await supabase
    .from("collections")
    .select(COLLECTION_WITH_RIDDLE_COUNT_AND_THEMES_SELECT)
    .eq("is_active", true)
    .eq("collection_type", "admin")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("collection.repository.findAllActiveCollectionsWithRiddleCountAndThemes error:", error);
    return [];
  }

  return (data ?? []).map((row) => toCollectionWithRiddleCountAndThemes(row));
}

// ============================================================================
// Finding user custom collections by User Id with Riddle Count and Themes
// ============================================================================
export async function findUserCustomCollectionsByUserIdWithRiddleCountAndThemes(
  supabase: SupabaseClient,
  userId: string,
): Promise<CollectionWithRiddleCountAndThemes[]> {
  const { data, error } = await supabase
    .from("collections")
    .select(COLLECTION_WITH_RIDDLE_COUNT_AND_THEMES_SELECT)
    .eq("created_by", userId)
    .eq("collection_type", "custom")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("collection.repository.findUserCustomCollectionsByUserIdWithRiddleCountAndThemes error:", error);
    return [];
  }

  return (data ?? []).map((row) => toCollectionWithRiddleCountAndThemes(row));
}

// ============================================================================
// Finding collection by Id
// ============================================================================
export async function findCollectionById(supabase: SupabaseClient, id: string): Promise<Collection | null> {
  const { data, error } = await supabase.from("collections").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("collection.repository.findCollectionById error:", error);
    return null;
  }

  if (!data) return null;

  return toCollection(data);
}

// ============================================================================
// Finding collection by Slug and collection type
// ============================================================================
export async function findCollectionBySlugAndType(
  supabase: SupabaseClient,
  slug: string,
  collectionType: CollectionType,
): Promise<Collection | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("collection_type", collectionType)
    .maybeSingle();

  if (error) {
    console.error("collection.repository.findCollectionBySlugAndType error:", error);
    return null;
  }

  if (!data) return null;

  return toCollection(data);
}

// ============================================================================
// Creating a collection
// ============================================================================
export async function createCollection(
  supabase: SupabaseClient,
  payload: CreateCollectionPayload,
): Promise<Collection | null> {
  const { data, error } = await supabase
    .from("collections")
    .insert({
      title: payload.title.trim(),
      slug: payload.slug?.trim() || slugFromTitle(payload.title),
      description: payload.description.trim(),
      cover_image_url: payload.coverImageUrl,
      cover_image_color: payload.coverImageColor,
      difficulty: payload.difficulty ?? DEFAULT_COLLECTION_DIFFICULTY,
      collection_type: payload.collectionType ?? "admin",
      sort_order: payload.sortOrder ?? 0,
      is_active: payload.isActive ?? true,
      created_by: payload.createdBy ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("collection.repository.createCollection error:", error);
    return null;
  }

  return toCollection(data);
}

// ============================================================================
// Updating a collection
// ============================================================================
export async function updateCollection(
  supabase: SupabaseClient,
  id: string,
  payload: UpdateCollectionPayload,
): Promise<Collection | null> {
  const updates: Record<string, unknown> = {};
  if (payload.title !== undefined) updates.title = payload.title.trim();
  if (payload.slug !== undefined) updates.slug = payload.slug.trim();
  if (payload.description !== undefined) updates.description = payload.description.trim();
  if (payload.coverImageUrl !== undefined) updates.cover_image_url = payload.coverImageUrl;
  if (payload.coverImageColor !== undefined) updates.cover_image_color = payload.coverImageColor;
  if (payload.difficulty !== undefined) updates.difficulty = payload.difficulty;
  if (payload.collectionType !== undefined) updates.collection_type = payload.collectionType;
  if (payload.sortOrder !== undefined) updates.sort_order = payload.sortOrder;
  if (payload.isActive !== undefined) updates.is_active = payload.isActive;

  const { data, error } = await supabase.from("collections").update(updates).eq("id", id).select().single();

  if (error) {
    console.error("collection.repository.updateCollection error:", error);
    return null;
  }

  return toCollection(data);
}

// ============================================================================
// Deleting a collection
// ============================================================================
export async function removeCollection(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) {
    console.error("collection.repository.removeCollection error:", error);
    return false;
  }

  return true;
}

// ============================================================================
// Creating a user custom collection
// ============================================================================
export async function createUserCustomCollection(
  supabase: SupabaseClient,
  payload: CreateCustomCollectionForUserPayload,
): Promise<Collection | null> {
  const description = payload.description?.trim() ?? "";

  const { data, error } = await supabase
    .from("collections")
    .insert({
      title: payload.title.trim(),
      slug: payload.slug?.trim() || slugFromTitle(payload.title),
      description,
      cover_image_url: payload.coverImageUrl,
      cover_image_color: payload.coverImageColor,
      difficulty: null,
      collection_type: "custom",
      is_active: true,
      created_by: payload.createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error("collection.repository.createUserCustomCollection error:", error);
    return null;
  }

  return toCollection(data);
}

// ============================================================================
// Updating a user custom collection
// ============================================================================
export async function updateUserCustomCollection(
  supabase: SupabaseClient,
  payload: UpdateCustomCollectionForUserPayload,
): Promise<Collection | null> {
  const description = payload.description?.trim() ?? "";

  const { data, error } = await supabase
    .from("collections")
    .update({
      title: payload.title.trim(),
      slug: slugFromTitle(payload.title),
      description,
    })
    .eq("id", payload.id)
    .eq("created_by", payload.userId)
    .eq("collection_type", "custom")
    .select()
    .maybeSingle();

  if (error) {
    console.error("collection.repository.updateUserCustomCollection error:", error);
    return null;
  }

  if (!data) return null;
  return toCollection(data);
}

// ============================================================================
// Deleting a user custom collection
// ============================================================================
export async function removeUserCustomCollection(
  supabase: SupabaseClient,
  payload: DeleteCustomCollectionForUserPayload,
): Promise<boolean> {
  const { error, count } = await supabase
    .from("collections")
    .delete({ count: "exact" })
    .eq("id", payload.id)
    .eq("created_by", payload.userId)
    .eq("collection_type", "custom");

  if (error) {
    console.error("collection.repository.removeUserCustomCollection error:", error);
    return false;
  }

  return Boolean((count ?? 0) > 0);
}
