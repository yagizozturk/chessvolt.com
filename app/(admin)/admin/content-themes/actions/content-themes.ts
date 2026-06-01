"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateContentThemeInput } from "@/features/content-theme/repository/content-theme.repository";
import {
  addContentTheme,
  deleteContentTheme,
  updateContentTheme,
} from "@/features/content-theme/services/content-theme.service";
import { parseContentType, type ContentType } from "@/features/content-theme/types/content-type";
import {
  DEFAULT_CONTENT_THEME_WEIGHT,
  parseContentThemeWeight,
  type ContentThemeWeight,
} from "@/features/content-theme/types/content-theme-weight";
import { getAdminUser } from "@/lib/supabase/auth";

function parseContentId(formData: FormData): string | null {
  const raw = (formData.get("contentId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseThemeId(formData: FormData): string | null {
  const raw = (formData.get("themeId") as string | null)?.trim() ?? "";
  return raw || null;
}

function parseWeightFromForm(formData: FormData): ContentThemeWeight {
  return parseContentThemeWeight(formData.get("weight")) ?? DEFAULT_CONTENT_THEME_WEIGHT;
}

function parseContentTypeFromForm(formData: FormData): ContentType | null {
  return parseContentType(formData.get("contentType"));
}

export async function createContentThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const contentType = parseContentTypeFromForm(formData);
  const contentId = parseContentId(formData);
  const themeId = parseThemeId(formData);
  const weight = parseWeightFromForm(formData);

  if (!contentType || !contentId || !themeId) {
    redirect("/admin/content-themes/create?error=missing_fields");
  }

  const input: CreateContentThemeInput = {
    contentType,
    contentId,
    themeId,
    weight,
  };

  const link = await addContentTheme(supabase, input);
  if (!link) {
    redirect("/admin/content-themes/create?error=create_failed");
  }

  revalidatePath("/admin/content-themes");
  redirect("/admin/content-themes");
}

export type UpdateContentThemeFormState = {
  error: string | null;
};

export async function updateContentThemeAction(
  _prevState: UpdateContentThemeFormState,
  formData: FormData,
): Promise<UpdateContentThemeFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("contentThemeId") as string)?.trim();
  if (!id) {
    return { error: "Missing link id. Refresh the page and try again." };
  }

  const weight = parseWeightFromForm(formData);

  const link = await updateContentTheme(supabase, id, { weight });
  if (!link) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/content-themes");
  redirect("/admin/content-themes");
}

export async function deleteContentThemeAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteContentTheme(supabase, id);
  if (!ok) {
    redirect("/admin/content-themes?error=delete_failed");
  }

  revalidatePath("/admin/content-themes");
  redirect("/admin/content-themes");
}
