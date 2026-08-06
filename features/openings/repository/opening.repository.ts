/**
 * Opening Repository
 * CRUD access to the openings table (parent of opening_variants).
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Opening } from "@/features/openings/types/opening";
import { postgrestUserMessage } from "@/lib/supabase/postgrest-user-message";
import { slugify } from "@/lib/utils/slugify";

function slugFromName(name: string): string {
  return slugify(name) || "opening";
}

type DbOpening = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  type: string | null;
  display_fen: string | null;
  cover_image_url: string | null;
  cover_image_color: string | null;
  created_at: string;
};

function toOpening(db: DbOpening): Opening {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    description: db.description,
    type: db.type ?? null,
    displayFen: db.display_fen ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    coverImageUrl: db.cover_image_url,
    coverImageColor: db.cover_image_color,
    createdAt: db.created_at,
  };
}

type DbOpeningWithVariantCount = DbOpening & {
  opening_variants: [{ count: number }];
};

function dbRowMatchesUpdates(row: DbOpening, updates: Record<string, unknown>): boolean {
  if ("name" in updates && row.name !== updates.name) return false;
  if ("slug" in updates && (row.slug ?? null) !== (updates.slug ?? null)) return false;
  if ("description" in updates && (row.description ?? null) !== (updates.description ?? null)) return false;
  if ("type" in updates && (row.type ?? null) !== (updates.type ?? null)) return false;
  if ("display_fen" in updates && (row.display_fen ?? null) !== (updates.display_fen ?? null)) return false;
  if ("cover_image_url" in updates && (row.cover_image_url ?? null) !== (updates.cover_image_url ?? null)) return false;
  if ("cover_image_color" in updates && (row.cover_image_color ?? null) !== (updates.cover_image_color ?? null))
    return false;
  return true;
}

const OPENING_COLUMNS =
  "id, name, slug, description, type, display_fen, cover_image_url, cover_image_color, created_at" as const;

export async function findAll(supabase: SupabaseClient): Promise<Opening[]> {
  const { data, error } = await supabase.from("openings").select(OPENING_COLUMNS).order("name", { ascending: true });

  if (error) {
    console.error("opening.repository.findAll error:", error);
    return [];
  }

  return (data ?? []).map(toOpening);
}

export type OpeningWithVariantCount = Opening & { variantCount: number };

export async function findAllWithVariantCount(supabase: SupabaseClient): Promise<OpeningWithVariantCount[]> {
  const { data, error } = await supabase
    .from("openings")
    .select(`${OPENING_COLUMNS}, opening_variants(count)`)
    .order("name", { ascending: true });

  if (error) {
    console.error("opening.repository.findAllWithVariantCount error:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const db = row as DbOpeningWithVariantCount;
    const variantCount = db.opening_variants?.[0]?.count ?? 0;
    return { ...toOpening(db), variantCount };
  });
}

export async function findByTypeWithVariantCount(
  supabase: SupabaseClient,
  type: string,
): Promise<OpeningWithVariantCount[]> {
  const trimmed = type.trim();
  if (!trimmed) {
    return [];
  }

  const { data, error } = await supabase
    .from("openings")
    .select(`${OPENING_COLUMNS}, opening_variants(count)`)
    .ilike("type", trimmed)
    .order("name", { ascending: true });

  if (error) {
    console.error("opening.repository.findByTypeWithVariantCount error:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const db = row as DbOpeningWithVariantCount;
    const variantCount = db.opening_variants?.[0]?.count ?? 0;
    return { ...toOpening(db), variantCount };
  });
}

export async function findById(supabase: SupabaseClient, id: string): Promise<Opening | null> {
  const { data, error } = await supabase.from("openings").select(OPENING_COLUMNS).eq("id", id).maybeSingle();

  if (error) {
    console.error("opening.repository.findById error:", error);
    return null;
  }
  if (!data) return null;
  return toOpening(data);
}

export type CreateOpeningInput = {
  name: string;
  slug?: string | null;
  description?: string | null;
  type?: string | null;
  displayFen?: string | null;
  coverImageUrl?: string | null;
  coverImageColor?: string | null;
};

export async function create(supabase: SupabaseClient, input: CreateOpeningInput): Promise<Opening | null> {
  const coverImageUrl = input.coverImageUrl?.trim() || null;
  const coverImageColor = input.coverImageColor?.trim() || null;

  const { data, error } = await supabase
    .from("openings")
    .insert({
      name: input.name.trim(),
      slug: input.slug ?? slugFromName(input.name),
      description: input.description ?? null,
      type: input.type ?? null,
      display_fen: input.displayFen ?? null,
      cover_image_url: coverImageUrl,
      cover_image_color: coverImageColor,
    })
    .select()
    .single();

  if (error) {
    console.error("opening.repository.create error:", error);
    return null;
  }

  return toOpening(data);
}

export type UpdateOpeningInput = {
  name?: string;
  slug?: string | null;
  description?: string | null;
  type?: string | null;
  displayFen?: string | null;
  coverImageUrl?: string | null;
  coverImageColor?: string | null;
};

export type UpdateOpeningResult = {
  opening: Opening | null;
  error: string | null;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdateOpeningInput,
): Promise<UpdateOpeningResult> {
  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.slug !== undefined) updates.slug = input.slug;
  if (input.description !== undefined) updates.description = input.description;
  if (input.type !== undefined) updates.type = input.type;
  if (input.displayFen !== undefined) updates.display_fen = input.displayFen;
  if (input.coverImageUrl !== undefined) {
    updates.cover_image_url = input.coverImageUrl?.trim() || null;
  }
  if (input.coverImageColor !== undefined) {
    updates.cover_image_color = input.coverImageColor?.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return { opening: null, error: "No changes to save." };
  }

  const { data, error } = await supabase
    .from("openings")
    .update(updates)
    .eq("id", id)
    .select(OPENING_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error("opening.repository.update error:", error);
    return { opening: null, error: postgrestUserMessage(error) };
  }

  if (data) {
    return { opening: toOpening(data), error: null };
  }

  const { data: row, error: readError } = await supabase
    .from("openings")
    .select(OPENING_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    console.error("opening.repository.update re-read error:", readError);
    return { opening: null, error: postgrestUserMessage(readError) };
  }

  if (!row) {
    return {
      opening: null,
      error: "This opening could not be loaded after save. It may have been removed, or you may not have access.",
    };
  }

  if (dbRowMatchesUpdates(row, updates)) {
    return { opening: toOpening(row), error: null };
  }

  return {
    opening: null,
    error: "The update did not apply. Check permissions for editing openings, or try again.",
  };
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("openings").delete().eq("id", id);

  if (error) {
    console.error("opening.repository.remove error:", error);
    return false;
  }

  return true;
}
