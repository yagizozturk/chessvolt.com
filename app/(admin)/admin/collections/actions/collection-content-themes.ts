"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateContentThemeInput } from "@/features/content-theme/repository/content-theme.repository";
import {
  addContentTheme,
  deleteContentTheme,
  updateContentTheme,
} from "@/features/content-theme/services/content-theme.service";
import {
  DEFAULT_CONTENT_THEME_WEIGHT,
  parseContentThemeWeight,
  type ContentThemeWeight,
} from "@/features/content-theme/types/content-theme-weight";
import { getAdminUser } from "@/lib/supabase/auth";

function collectionEditPath(collectionId: string) {
  return `/admin/collections/edit/${collectionId}`;
}

function revalidateCollectionThemePaths(collectionId: string) {
  revalidatePath(collectionEditPath(collectionId));
  revalidatePath("/admin/collections");
  revalidatePath("/collection");
  revalidatePath("/my-collections");
}

function parseCollectionId(formData: FormData): string | null {
  const raw = (formData.get("collectionId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseThemeId(formData: FormData): string | null {
  const raw = (formData.get("themeId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseContentThemeId(formData: FormData): string | null {
  const raw = (formData.get("contentThemeId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseWeightFromForm(formData: FormData): ContentThemeWeight {
  return parseContentThemeWeight(formData.get("weight")) ?? DEFAULT_CONTENT_THEME_WEIGHT;
}

export async function createCollectionContentThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const collectionId = parseCollectionId(formData);
  const themeId = parseThemeId(formData);
  const weight = parseWeightFromForm(formData);

  if (!collectionId || !themeId) {
    redirect(`/admin/collections?themes_error=missing_fields`);
  }

  const input: CreateContentThemeInput = {
    contentType: "collection",
    contentId: collectionId,
    themeId,
    weight,
  };

  const link = await addContentTheme(supabase, input);
  if (!link) {
    redirect(`${collectionEditPath(collectionId)}?themes_error=create_failed`);
  }

  revalidateCollectionThemePaths(collectionId);
  redirect(collectionEditPath(collectionId));
}

export async function updateCollectionContentThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const collectionId = parseCollectionId(formData);
  const contentThemeId = parseContentThemeId(formData);
  const weight = parseWeightFromForm(formData);

  if (!collectionId || !contentThemeId) {
    redirect(`/admin/collections?themes_error=missing_fields`);
  }

  const link = await updateContentTheme(supabase, contentThemeId, { weight });
  if (!link) {
    redirect(`${collectionEditPath(collectionId)}?themes_error=update_failed`);
  }

  revalidateCollectionThemePaths(collectionId);
  redirect(collectionEditPath(collectionId));
}

export async function deleteCollectionContentThemeAction(
  contentThemeId: string,
  collectionId: string,
): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteContentTheme(supabase, contentThemeId);
  if (!ok) {
    redirect(`${collectionEditPath(collectionId)}?themes_error=delete_failed`);
  }

  revalidateCollectionThemePaths(collectionId);
  redirect(collectionEditPath(collectionId));
}
