"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateThemeInput, UpdateThemeInput } from "@/features/theme/repository/theme.repository";
import { createTheme, deleteTheme, updateTheme } from "@/features/theme/services/theme.service";
import { parseThemeCategory, type ThemeCategory } from "@/features/theme/types/theme-category";
import { getAdminUser } from "@/lib/supabase/auth";

function parseSortOrder(raw: FormDataEntryValue | null): number {
  const value = parseInt(String(raw ?? ""), 10);
  return Number.isFinite(value) ? value : 0;
}

function parseIsActive(formData: FormData): boolean {
  return formData.get("isActive") === "on";
}

function parseCategoryFromForm(formData: FormData): ThemeCategory | null {
  return parseThemeCategory(formData.get("category"));
}

function parseDescription(formData: FormData): string | null {
  const raw = (formData.get("description") as string | null)?.trim() ?? "";
  return raw || null;
}

export async function createThemeAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || "").trim() || undefined;
  const description = parseDescription(formData);
  const category = parseCategoryFromForm(formData);
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);

  if (!title || !category) {
    redirect("/admin/themes/create?error=missing_fields");
  }

  const input: CreateThemeInput = {
    title,
    slug,
    description,
    category,
    sortOrder,
    isActive,
  };

  const theme = await createTheme(supabase, input);
  if (!theme) {
    redirect("/admin/themes/create?error=create_failed");
  }

  revalidatePath("/admin/themes");
  redirect("/admin/themes");
}

export type UpdateThemeFormState = {
  error: string | null;
};

export async function updateThemeAction(
  _prevState: UpdateThemeFormState,
  formData: FormData,
): Promise<UpdateThemeFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("themeId") as string)?.trim();
  if (!id) {
    return { error: "Missing theme id. Refresh the page and try again." };
  }

  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || "").trim() || undefined;
  const description = parseDescription(formData);
  const category = parseCategoryFromForm(formData);
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);

  if (!title || !category) {
    return { error: "Title and category are required." };
  }

  const input: UpdateThemeInput = {
    title,
    slug,
    description,
    category,
    sortOrder,
    isActive,
  };

  const theme = await updateTheme(supabase, id, input);
  if (!theme) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/themes");
  redirect("/admin/themes");
}

export async function deleteThemeAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteTheme(supabase, id);
  if (!ok) {
    redirect("/admin/themes?error=delete_failed");
  }

  revalidatePath("/admin/themes");
  redirect("/admin/themes");
}
