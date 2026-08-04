import type { SupabaseClient } from "@supabase/supabase-js";

import { addRiddleToStudy } from "@/features/study-riddles/services/study-riddles.service";
import { syncRiddleThemesFromSlugs } from "@/features/riddle-theme/services/riddle-theme.service";
import type { CreateRiddleInput, UpdateRiddleInput } from "@/features/riddle/repository/riddle.repository";
import { createRiddle, updateRiddle } from "@/features/riddle/services/riddle.service";

export type PersistRiddleInput = CreateRiddleInput & {
  themeSlugs?: string[];
  studyId?: string | null;
};

export type PersistRiddleResult = { ok: true; riddleId: string } | { ok: false; error: string; code?: string };

export async function persistNewRiddle(
  supabase: SupabaseClient,
  input: PersistRiddleInput,
): Promise<PersistRiddleResult> {
  const { themeSlugs, studyId, ...createInput } = input;

  const riddle = await createRiddle(supabase, createInput);
  if (!riddle) {
    return { ok: false, error: "Could not create the riddle. Please try again.", code: "create_failed" };
  }

  if (themeSlugs && themeSlugs.length > 0) {
    const themesSynced = await syncRiddleThemesFromSlugs(supabase, riddle.id, themeSlugs);
    if (!themesSynced) {
      return {
        ok: false,
        error: "Riddle was saved but theme links could not be updated.",
        code: "themes_sync_failed",
      };
    }
  }

  if (studyId) {
    const link = await addRiddleToStudy(supabase, {
      studyId,
      riddleId: riddle.id,
      sortOrder: 0,
    });
    if (!link) {
      return {
        ok: false,
        error: "Riddle was saved but could not be linked to the study.",
        code: "study_link_failed",
      };
    }
  }

  return { ok: true, riddleId: riddle.id };
}

export type UpdatePersistInput = {
  id: string;
  riddleInput: UpdateRiddleInput;
  themeSlugs?: string[];
  studyId?: string | null;
};

export async function persistRiddleUpdate(
  supabase: SupabaseClient,
  input: UpdatePersistInput,
): Promise<PersistRiddleResult> {
  const riddle = await updateRiddle(supabase, input.id, input.riddleInput);
  if (!riddle) {
    return { ok: false, error: "Could not save changes. Please try again.", code: "update_failed" };
  }

  if (input.themeSlugs !== undefined) {
    const themesSynced = await syncRiddleThemesFromSlugs(supabase, input.id, input.themeSlugs);
    if (!themesSynced) {
      return {
        ok: false,
        error: "Riddle was saved but theme links could not be updated.",
        code: "themes_sync_failed",
      };
    }
  }

  if (input.studyId) {
    const link = await addRiddleToStudy(supabase, {
      studyId: input.studyId,
      riddleId: input.id,
      sortOrder: 0,
    });
    if (!link) {
      return {
        ok: false,
        error: "Riddle was saved but could not be linked to the study.",
        code: "study_link_failed",
      };
    }
  }

  return { ok: true, riddleId: input.id };
}
