"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateStudyPayload, UpdateStudyPayload } from "@/features/study/types/study-payload";
import {
  createStudy,
  deleteStudy,
  updateStudy,
} from "@/features/study/services/study.service";
import { DEFAULT_STUDY_DIFFICULTY } from "@/features/study/constants/study-difficulty.constants";
import type { StudyDifficulty } from "@/features/study/types/study-difficulty";
import { parseStudyDifficulty } from "@/features/study/utilities/study-difficulty.utils";
import { getAdminUser } from "@/lib/supabase/auth";

function parseSortOrder(raw: FormDataEntryValue | null): number {
  const value = parseInt(String(raw ?? ""), 10);
  return Number.isFinite(value) ? value : 0;
}

function parseIsActive(formData: FormData): boolean {
  return formData.get("isActive") === "on";
}

function parseDifficultyFromForm(formData: FormData): StudyDifficulty {
  return parseStudyDifficulty(formData.get("difficulty")) ?? DEFAULT_STUDY_DIFFICULTY;
}

export async function createStudyAction(formData: FormData) {
  const { supabase, user } = await getAdminUser();

  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || "").trim() || undefined;
  const description = (formData.get("description") as string)?.trim() ?? "";
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim();
  const coverImageColor = (formData.get("coverImageColor") as string)?.trim();
  const difficulty = parseDifficultyFromForm(formData);
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);

  if (!title || !coverImageUrl || !coverImageColor) {
    redirect("/admin/studies/create?error=missing_fields");
  }

  const payload: CreateStudyPayload = {
    title,
    slug,
    description,
    coverImageUrl,
    coverImageColor,
    difficulty,
    sortOrder,
    isActive,
    createdBy: user.id,
  };

  const study = await createStudy(supabase, payload);
  if (!study) {
    redirect("/admin/studies/create?error=create_failed");
  }

  revalidatePath("/admin/studies");
  revalidatePath("/studies");
  redirect("/admin/studies");
}

export type UpdateStudyFormState = {
  error: string | null;
};

export async function updateStudyAction(
  _prevState: UpdateStudyFormState,
  formData: FormData,
): Promise<UpdateStudyFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("studyId") as string)?.trim();
  if (!id) {
    return { error: "Missing study id. Refresh the page and try again." };
  }

  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || "").trim() || undefined;
  const description = (formData.get("description") as string)?.trim();
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim();
  const coverImageColor = (formData.get("coverImageColor") as string)?.trim();
  const difficulty = parseDifficultyFromForm(formData);
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);

  if (!title || !coverImageUrl || !coverImageColor) {
    return { error: "Title, cover image, and cover color are required." };
  }

  const payload: UpdateStudyPayload = {
    title,
    slug,
    description,
    coverImageUrl,
    coverImageColor,
    difficulty,
    sortOrder,
    isActive,
  };

  const study = await updateStudy(supabase, id, payload);
  if (!study) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/studies");
  revalidatePath("/studies");
  revalidatePath(`/studies/${study.slug}`);
  redirect("/admin/studies");
}

export async function deleteStudyAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteStudy(supabase, id);
  if (!ok) {
    redirect("/admin/studies?error=delete_failed");
  }

  revalidatePath("/admin/studies");
  revalidatePath("/studies");
  redirect("/admin/studies");
}
