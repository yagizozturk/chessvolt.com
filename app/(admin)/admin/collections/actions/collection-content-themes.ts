"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateCollectionThemeInput } from "@/features/collection-theme/repository/collection-theme.repository";
import {
  addCollectionTheme,
  deleteCollectionTheme,
  updateCollectionTheme,
} from "@/features/collection-theme/services/collection-theme.service";
import {
  DEFAULT_THEME_LINK_WEIGHT,
  parseThemeLinkWeight,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";
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

function parseCollectionThemeId(formData: FormData): string | null {
  const raw = (formData.get("collectionThemeId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseWeightFromForm(formData: FormData): ThemeLinkWeight {
  return parseThemeLinkWeight(formData.get("weight")) ?? DEFAULT_THEME_LINK_WEIGHT;
}

export async function createCollectionContentThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const collectionId = parseCollectionId(formData);
  const themeId = parseThemeId(formData);
  const weight = parseWeightFromForm(formData);

  if (!collectionId || !themeId) {
    redirect(`/admin/collections?themes_error=missing_fields`);
  }

  const input: CreateCollectionThemeInput = {
    collectionId,
    themeId,
    weight,
  };

  const link = await addCollectionTheme(supabase, input);
  if (!link) {
    redirect(`${collectionEditPath(collectionId)}?themes_error=create_failed`);
  }

  revalidateCollectionThemePaths(collectionId);
  redirect(collectionEditPath(collectionId));
}

export async function updateCollectionContentThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const collectionId = parseCollectionId(formData);
  const collectionThemeId = parseCollectionThemeId(formData);
  const weight = parseWeightFromForm(formData);

  if (!collectionId || !collectionThemeId) {
    redirect(`/admin/collections?themes_error=missing_fields`);
  }

  const link = await updateCollectionTheme(supabase, collectionThemeId, { weight });
  if (!link) {
    redirect(`${collectionEditPath(collectionId)}?themes_error=update_failed`);
  }

  revalidateCollectionThemePaths(collectionId);
  redirect(collectionEditPath(collectionId));
}

export async function deleteCollectionContentThemeAction(
  collectionThemeId: string,
  collectionId: string,
): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteCollectionTheme(supabase, collectionThemeId);
  if (!ok) {
    redirect(`${collectionEditPath(collectionId)}?themes_error=delete_failed`);
  }

  revalidateCollectionThemePaths(collectionId);
  redirect(collectionEditPath(collectionId));
}
