/**
 * Puzzle Theme Repository
 *
 * Responsibility: CRUD access to the puzzle_themes join table.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DbPuzzleTheme,
  type DbPuzzleThemeWithTheme,
  toPuzzleTheme,
  toPuzzleThemeWithTheme,
  toPuzzleThemes,
  toPuzzleThemesWithTheme,
} from "@/features/puzzle-theme/mapper/puzzle-theme.mapper";
import type { PuzzleTheme, PuzzleThemeWithTheme } from "@/features/puzzle-theme/types/puzzle-theme";
import { type DbPuzzle, toPuzzle } from "@/features/puzzle/mapper/puzzle.mapper";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import { DEFAULT_THEME_LINK_WEIGHT, type ThemeLinkWeight } from "@/features/theme-link/types/theme-link-weight";

const SELECT = "*";
const WITH_THEME_SELECT = "*, themes (*)";

export async function findById(supabase: SupabaseClient, id: string): Promise<PuzzleTheme | null> {
  const { data, error } = await supabase.from("puzzle_themes").select(SELECT).eq("id", id).maybeSingle();

  if (error) {
    console.error("puzzle-theme.repository.findById error:", error);
    return null;
  }

  if (!data) return null;

  return toPuzzleTheme(data as DbPuzzleTheme);
}

export async function findByIdWithTheme(supabase: SupabaseClient, id: string): Promise<PuzzleThemeWithTheme | null> {
  const { data, error } = await supabase.from("puzzle_themes").select(WITH_THEME_SELECT).eq("id", id).maybeSingle();

  if (error) {
    console.error("puzzle-theme.repository.findByIdWithTheme error:", error);
    return null;
  }

  if (!data) return null;

  return toPuzzleThemeWithTheme(data as DbPuzzleThemeWithTheme);
}

export async function findAllWithTheme(supabase: SupabaseClient): Promise<PuzzleThemeWithTheme[]> {
  const { data, error } = await supabase
    .from("puzzle_themes")
    .select(WITH_THEME_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("puzzle-theme.repository.findAllWithTheme error:", error);
    return [];
  }

  return toPuzzleThemesWithTheme((data ?? []) as DbPuzzleThemeWithTheme[]);
}

export async function findActivePuzzlesByThemeId(supabase: SupabaseClient, themeId: string): Promise<Puzzle[]> {
  const { data, error } = await supabase
    .from("puzzle_themes")
    .select("puzzles (*, move_sequences (*))")
    .eq("theme_id", themeId);

  if (error) {
    console.error("puzzle-theme.repository.findActivePuzzlesByThemeId error:", error);
    return [];
  }

  return mapActivePuzzleJoinRows(data ?? []);
}

const THEME_ID_IN_CHUNK_SIZE = 40;

export async function findActivePuzzlesByThemeIds(
  supabase: SupabaseClient,
  themeIds: string[],
): Promise<Map<string, Puzzle[]>> {
  const uniqueIds = [...new Set(themeIds.map((id) => id.trim()).filter(Boolean))];
  const byThemeId = new Map<string, Puzzle[]>();
  if (uniqueIds.length === 0) return byThemeId;

  for (const themeId of uniqueIds) {
    byThemeId.set(themeId, []);
  }

  for (let i = 0; i < uniqueIds.length; i += THEME_ID_IN_CHUNK_SIZE) {
    const chunk = uniqueIds.slice(i, i + THEME_ID_IN_CHUNK_SIZE);
    const { data, error } = await supabase
      .from("puzzle_themes")
      .select("theme_id, puzzles (*, move_sequences (*))")
      .in("theme_id", chunk);

    if (error) {
      console.error("puzzle-theme.repository.findActivePuzzlesByThemeIds error:", error);
      continue;
    }

    for (const row of data ?? []) {
      const themeId = (row as { theme_id?: string }).theme_id;
      if (!themeId) continue;
      const puzzle = mapActivePuzzleJoinRow(row as { puzzles?: DbPuzzle | DbPuzzle[] | null });
      if (!puzzle) continue;
      const list = byThemeId.get(themeId) ?? [];
      list.push(puzzle);
      byThemeId.set(themeId, list);
    }
  }

  return byThemeId;
}

function mapActivePuzzleJoinRow(row: { puzzles?: DbPuzzle | DbPuzzle[] | null }): Puzzle | null {
  const puzzleRow = Array.isArray(row.puzzles) ? row.puzzles[0] : row.puzzles;
  if (!puzzleRow || !puzzleRow.is_active) return null;
  try {
    return toPuzzle(puzzleRow);
  } catch (err) {
    console.error("puzzle-theme.repository mapActivePuzzleJoinRow error:", err);
    return null;
  }
}

function mapActivePuzzleJoinRows(rows: Array<{ puzzles?: DbPuzzle | DbPuzzle[] | null }>): Puzzle[] {
  return rows.map(mapActivePuzzleJoinRow).filter((puzzle): puzzle is Puzzle => puzzle != null);
}

export async function findByPuzzleIdsWithTheme(
  supabase: SupabaseClient,
  puzzleIds: string[],
): Promise<PuzzleThemeWithTheme[]> {
  const uniqueIds = [...new Set(puzzleIds.map((id) => id.trim()).filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const { data, error } = await supabase
    .from("puzzle_themes")
    .select(WITH_THEME_SELECT)
    .in("puzzle_id", uniqueIds)
    .order("weight", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("puzzle-theme.repository.findByPuzzleIdsWithTheme error:", error);
    return [];
  }

  return toPuzzleThemesWithTheme((data ?? []) as DbPuzzleThemeWithTheme[]);
}

export type CreatePuzzleThemeInput = {
  puzzleId: string;
  themeId: string;
  weight?: ThemeLinkWeight;
};

export async function create(supabase: SupabaseClient, input: CreatePuzzleThemeInput): Promise<PuzzleTheme | null> {
  const { data, error } = await supabase
    .from("puzzle_themes")
    .insert({
      puzzle_id: input.puzzleId,
      theme_id: input.themeId,
      weight: input.weight ?? DEFAULT_THEME_LINK_WEIGHT,
    })
    .select()
    .single();

  if (error) {
    console.error("puzzle-theme.repository.create error:", error);
    return null;
  }

  return toPuzzleTheme(data as DbPuzzleTheme);
}

export async function createMany(supabase: SupabaseClient, inputs: CreatePuzzleThemeInput[]): Promise<PuzzleTheme[]> {
  if (inputs.length === 0) return [];

  const rows = inputs.map((input) => ({
    puzzle_id: input.puzzleId,
    theme_id: input.themeId,
    weight: input.weight ?? DEFAULT_THEME_LINK_WEIGHT,
  }));

  const { data, error } = await supabase.from("puzzle_themes").insert(rows).select();

  if (error) {
    console.error("puzzle-theme.repository.createMany error:", error);
    return [];
  }

  return toPuzzleThemes((data ?? []) as DbPuzzleTheme[]);
}

export type UpdatePuzzleThemeInput = {
  weight?: ThemeLinkWeight;
};

export async function update(
  supabase: SupabaseClient,
  id: string,
  input: UpdatePuzzleThemeInput,
): Promise<PuzzleTheme | null> {
  const updates: Record<string, unknown> = {};
  if (input.weight !== undefined) updates.weight = input.weight;

  if (Object.keys(updates).length === 0) {
    return findById(supabase, id);
  }

  const { data, error } = await supabase.from("puzzle_themes").update(updates).eq("id", id).select().single();

  if (error) {
    console.error("puzzle-theme.repository.update error:", error);
    return null;
  }

  return toPuzzleTheme(data as DbPuzzleTheme);
}

export async function replaceForPuzzle(
  supabase: SupabaseClient,
  puzzleId: string,
  inputs: CreatePuzzleThemeInput[],
): Promise<PuzzleTheme[]> {
  const { error: deleteError } = await supabase.from("puzzle_themes").delete().eq("puzzle_id", puzzleId);

  if (deleteError) {
    console.error("puzzle-theme.repository.replaceForPuzzle delete error:", deleteError);
    return [];
  }

  return createMany(supabase, inputs);
}

export async function remove(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("puzzle_themes").delete().eq("id", id);

  if (error) {
    console.error("puzzle-theme.repository.remove error:", error);
    return false;
  }

  return true;
}

export async function removeByPuzzleId(supabase: SupabaseClient, puzzleId: string): Promise<boolean> {
  const { error } = await supabase.from("puzzle_themes").delete().eq("puzzle_id", puzzleId);

  if (error) {
    console.error("puzzle-theme.repository.removeByPuzzleId error:", error);
    return false;
  }

  return true;
}
