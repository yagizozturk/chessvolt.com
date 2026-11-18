import type { SupabaseClient } from "@supabase/supabase-js";

import { addPuzzleToStudy } from "@/features/study-puzzles/services/study-puzzles.service";
import { syncPuzzleThemesFromSlugs } from "@/features/puzzle-theme/services/puzzle-theme.service";
import type { CreatePuzzleInput, UpdatePuzzleInput } from "@/features/puzzle/repository/puzzle.repository";
import { createPuzzle, updatePuzzle } from "@/features/puzzle/services/puzzle.service";

export type PersistPuzzleInput = CreatePuzzleInput & {
  themeSlugs?: string[];
  studyId?: string | null;
};

export type PersistPuzzleResult = { ok: true; puzzleId: string } | { ok: false; error: string; code?: string };

export async function persistNewPuzzle(
  supabase: SupabaseClient,
  input: PersistPuzzleInput,
): Promise<PersistPuzzleResult> {
  const { themeSlugs, studyId, ...createInput } = input;

  const puzzle = await createPuzzle(supabase, createInput);
  if (!puzzle) {
    return { ok: false, error: "Could not create the puzzle. Please try again.", code: "create_failed" };
  }

  if (themeSlugs && themeSlugs.length > 0) {
    const themesSynced = await syncPuzzleThemesFromSlugs(supabase, puzzle.id, themeSlugs);
    if (!themesSynced) {
      return {
        ok: false,
        error: "Puzzle was saved but theme links could not be updated.",
        code: "themes_sync_failed",
      };
    }
  }

  if (studyId) {
    const link = await addPuzzleToStudy(supabase, {
      studyId,
      puzzleId: puzzle.id,
      sortOrder: 0,
    });
    if (!link) {
      return {
        ok: false,
        error: "Puzzle was saved but could not be linked to the study.",
        code: "study_link_failed",
      };
    }
  }

  return { ok: true, puzzleId: puzzle.id };
}

export type UpdatePersistInput = {
  id: string;
  puzzleInput: UpdatePuzzleInput;
  themeSlugs?: string[];
  studyId?: string | null;
};

export async function persistPuzzleUpdate(
  supabase: SupabaseClient,
  input: UpdatePersistInput,
): Promise<PersistPuzzleResult> {
  const puzzle = await updatePuzzle(supabase, input.id, input.puzzleInput);
  if (!puzzle) {
    return { ok: false, error: "Could not save changes. Please try again.", code: "update_failed" };
  }

  if (input.themeSlugs !== undefined) {
    const themesSynced = await syncPuzzleThemesFromSlugs(supabase, input.id, input.themeSlugs);
    if (!themesSynced) {
      return {
        ok: false,
        error: "Puzzle was saved but theme links could not be updated.",
        code: "themes_sync_failed",
      };
    }
  }

  if (input.studyId) {
    const link = await addPuzzleToStudy(supabase, {
      studyId: input.studyId,
      puzzleId: input.id,
      sortOrder: 0,
    });
    if (!link) {
      return {
        ok: false,
        error: "Puzzle was saved but could not be linked to the study.",
        code: "study_link_failed",
      };
    }
  }

  return { ok: true, puzzleId: input.id };
}
