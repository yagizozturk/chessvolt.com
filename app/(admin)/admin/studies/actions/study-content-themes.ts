"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateStudyThemeInput } from "@/features/study-theme/repository/study-theme.repository";
import {
  addStudyTheme,
  deleteStudyTheme,
  updateStudyTheme,
} from "@/features/study-theme/services/study-theme.service";
import {
  DEFAULT_THEME_LINK_WEIGHT,
  parseThemeLinkWeight,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";
import { getAdminUser } from "@/lib/supabase/auth";

function studyEditPath(studyId: string) {
  return `/admin/studies/edit/${studyId}`;
}

function revalidateStudyThemePaths(studyId: string) {
  revalidatePath(studyEditPath(studyId));
  revalidatePath("/admin/studies");
  revalidatePath("/study");
  revalidatePath("/user-study");
}

function parseStudyId(formData: FormData): string | null {
  const raw = (formData.get("studyId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseThemeId(formData: FormData): string | null {
  const raw = (formData.get("themeId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseStudyThemeId(formData: FormData): string | null {
  const raw = (formData.get("studyThemeId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseWeightFromForm(formData: FormData): ThemeLinkWeight {
  return parseThemeLinkWeight(formData.get("weight")) ?? DEFAULT_THEME_LINK_WEIGHT;
}

export async function createStudyContentThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const studyId = parseStudyId(formData);
  const themeId = parseThemeId(formData);
  const weight = parseWeightFromForm(formData);

  if (!studyId || !themeId) {
    redirect(`/admin/studies?themes_error=missing_fields`);
  }

  const input: CreateStudyThemeInput = {
    studyId,
    themeId,
    weight,
  };

  const link = await addStudyTheme(supabase, input);
  if (!link) {
    redirect(`${studyEditPath(studyId)}?themes_error=create_failed`);
  }

  revalidateStudyThemePaths(studyId);
  redirect(studyEditPath(studyId));
}

export async function updateStudyContentThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const studyId = parseStudyId(formData);
  const studyThemeId = parseStudyThemeId(formData);
  const weight = parseWeightFromForm(formData);

  if (!studyId || !studyThemeId) {
    redirect(`/admin/studies?themes_error=missing_fields`);
  }

  const link = await updateStudyTheme(supabase, studyThemeId, { weight });
  if (!link) {
    redirect(`${studyEditPath(studyId)}?themes_error=update_failed`);
  }

  revalidateStudyThemePaths(studyId);
  redirect(studyEditPath(studyId));
}

export async function deleteStudyContentThemeAction(
  studyThemeId: string,
  studyId: string,
): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteStudyTheme(supabase, studyThemeId);
  if (!ok) {
    redirect(`${studyEditPath(studyId)}?themes_error=delete_failed`);
  }

  revalidateStudyThemePaths(studyId);
  redirect(studyEditPath(studyId));
}
