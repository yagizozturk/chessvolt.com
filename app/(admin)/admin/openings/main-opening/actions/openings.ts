"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateOpeningInput, UpdateOpeningInput } from "@/features/openings/repository/opening.repository";
import type { OpeningArrow, OpeningArrowGroup } from "@/features/openings/types/opening";
import { createOpening, deleteOpening, updateOpening } from "@/features/openings/services/openings.service";
import { getAdminUser } from "@/lib/supabase/auth";

function isOpeningArrow(value: unknown): value is OpeningArrow {
  if (!value || typeof value !== "object") return false;
  const arrow = value as { orig?: unknown; dest?: unknown };
  return typeof arrow.orig === "string" && typeof arrow.dest === "string";
}

function isOpeningArrowGroup(value: unknown): value is OpeningArrowGroup {
  if (!value || typeof value !== "object") return false;
  const group = value as {
    id?: unknown;
    title?: unknown;
    description?: unknown;
    arrows?: unknown;
  };
  return (
    typeof group.id === "string" &&
    typeof group.title === "string" &&
    typeof group.description === "string" &&
    Array.isArray(group.arrows) &&
    group.arrows.every(isOpeningArrow)
  );
}

function parseArrowsInput(rawValue: FormDataEntryValue | null): OpeningArrowGroup[] | null | undefined {
  if (rawValue === null) return undefined;
  const raw = String(rawValue).trim();
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    if (!parsed.every(isOpeningArrowGroup)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function createOpeningAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string) || null;
  const description = (formData.get("description") as string) || null;
  const openingType = ((formData.get("openingType") as string) || "").trim() || null;
  const displayFen = (formData.get("displayFen") as string) || null;
  const arrows = parseArrowsInput(formData.get("arrows"));

  if (!name) {
    redirect("/admin/openings?error=missing_fields");
  }

  const input: CreateOpeningInput = {
    name,
    slug: slug || null,
    description: description || null,
    type: openingType,
    arrows,
    displayFen: displayFen || null,
  };

  const opening = await createOpening(supabase, input);
  if (!opening) {
    redirect("/admin/openings?error=create_failed");
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}

export type UpdateOpeningFormState = {
  error: string | null;
};

export async function updateOpeningAction(
  _prevState: UpdateOpeningFormState,
  formData: FormData,
): Promise<UpdateOpeningFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("openingId") as string)?.trim();
  if (!id) {
    return { error: "Missing opening id. Refresh the page and try again." };
  }

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string) || null;
  const description = (formData.get("description") as string) || null;
  const openingType = ((formData.get("openingType") as string) || "").trim() || null;
  const displayFen = (formData.get("displayFen") as string) || null;
  const arrows = parseArrowsInput(formData.get("arrows"));

  if (!name) {
    return { error: "Name is required." };
  }

  const input: UpdateOpeningInput = {
    name,
    slug: slug || null,
    description,
    type: openingType,
    arrows,
    displayFen: displayFen || null,
  };

  const { opening, error } = await updateOpening(supabase, id, input);
  if (error || !opening) {
    return { error: error ?? "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/openings");
  revalidatePath(`/admin/openings/main-opening/edit/${id}`);
  redirect("/admin/openings");
}

export async function deleteOpeningAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteOpening(supabase, id);
  if (!ok) {
    redirect("/admin/openings?error=delete_failed");
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}
