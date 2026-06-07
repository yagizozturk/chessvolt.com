"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminThemeLink,
  deleteAdminThemeLink,
  updateAdminThemeLink,
} from "@/features/theme-link/services/theme-link-admin.service";
import { parseThemeLinkKind, type ThemeLinkKind } from "@/features/theme-link/types/theme-link-kind";
import {
  DEFAULT_THEME_LINK_WEIGHT,
  parseThemeLinkWeight,
  type ThemeLinkWeight,
} from "@/features/theme-link/types/theme-link-weight";
import { getAdminUser } from "@/lib/supabase/auth";

function parseParentId(formData: FormData): string | null {
  const raw = (formData.get("parentId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseThemeId(formData: FormData): string | null {
  const raw = (formData.get("themeId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseWeightFromForm(formData: FormData): ThemeLinkWeight {
  return parseThemeLinkWeight(formData.get("weight")) ?? DEFAULT_THEME_LINK_WEIGHT;
}

function parseKindFromForm(formData: FormData): ThemeLinkKind | null {
  return parseThemeLinkKind(formData.get("kind"));
}

export async function createThemeLinkAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const kind = parseKindFromForm(formData);
  const parentId = parseParentId(formData);
  const themeId = parseThemeId(formData);
  const weight = parseWeightFromForm(formData);

  if (!kind || !parentId || !themeId) {
    redirect("/admin/content-themes/create?error=missing_fields");
  }

  const link = await createAdminThemeLink(supabase, { kind, parentId, themeId, weight });
  if (!link) {
    redirect("/admin/content-themes/create?error=create_failed");
  }

  revalidatePath("/admin/content-themes");
  redirect("/admin/content-themes");
}

export type UpdateThemeLinkFormState = {
  error: string | null;
};

export async function updateThemeLinkAction(
  _prevState: UpdateThemeLinkFormState,
  formData: FormData,
): Promise<UpdateThemeLinkFormState> {
  const { supabase } = await getAdminUser();

  const kind = parseKindFromForm(formData);
  const id = (formData.get("themeLinkId") as string)?.trim();
  if (!kind || !id) {
    return { error: "Missing link details. Refresh the page and try again." };
  }

  const weight = parseWeightFromForm(formData);

  const link = await updateAdminThemeLink(supabase, kind, id, { weight });
  if (!link) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/content-themes");
  redirect("/admin/content-themes");
}

export async function deleteThemeLinkAction(kind: ThemeLinkKind, id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteAdminThemeLink(supabase, kind, id);
  if (!ok) {
    redirect("/admin/content-themes?error=delete_failed");
  }

  revalidatePath("/admin/content-themes");
  redirect("/admin/content-themes");
}
