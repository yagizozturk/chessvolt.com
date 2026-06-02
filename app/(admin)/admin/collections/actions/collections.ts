"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CreateCollectionInput, UpdateCollectionInput } from "@/features/collection/repository/collection.repository";
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from "@/features/collection/services/collection.service";
import {
  DEFAULT_COLLECTION_DIFFICULTY,
  parseCollectionDifficulty,
  type CollectionDifficulty,
} from "@/features/collection/types/collection-difficulty";
import {
  parseCollectionType,
  type CollectionType,
} from "@/features/collection/types/collection-type";
import { getAdminUser } from "@/lib/supabase/auth";

function parseSortOrder(raw: FormDataEntryValue | null): number {
  const value = parseInt(String(raw ?? ""), 10);
  return Number.isFinite(value) ? value : 0;
}

function parseIsActive(formData: FormData): boolean {
  return formData.get("isActive") === "on";
}

function parseDifficultyFromForm(formData: FormData): CollectionDifficulty {
  return parseCollectionDifficulty(formData.get("difficulty")) ?? DEFAULT_COLLECTION_DIFFICULTY;
}

function parseCollectionTypeFromForm(formData: FormData): CollectionType {
  return parseCollectionType(formData.get("collectionType")) ?? "admin";
}

export async function createCollectionAction(formData: FormData) {
  const { supabase, user } = await getAdminUser();

  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || "").trim() || undefined;
  const description = (formData.get("description") as string)?.trim() ?? "";
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim();
  const coverImageColor = (formData.get("coverImageColor") as string)?.trim();
  const difficulty = parseDifficultyFromForm(formData);
  const collectionType = parseCollectionTypeFromForm(formData);
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);

  if (!title || !coverImageUrl || !coverImageColor) {
    redirect("/admin/collections/create?error=missing_fields");
  }

  const input: CreateCollectionInput = {
    title,
    slug,
    description,
    coverImageUrl,
    coverImageColor,
    difficulty,
    collectionType,
    sortOrder,
    isActive,
    createdBy: user.id,
  };

  const collection = await createCollection(supabase, input);
  if (!collection) {
    redirect("/admin/collections/create?error=create_failed");
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collection");
  redirect("/admin/collections");
}

export type UpdateCollectionFormState = {
  error: string | null;
};

export async function updateCollectionAction(
  _prevState: UpdateCollectionFormState,
  formData: FormData,
): Promise<UpdateCollectionFormState> {
  const { supabase } = await getAdminUser();

  const id = (formData.get("collectionId") as string)?.trim();
  if (!id) {
    return { error: "Missing collection id. Refresh the page and try again." };
  }

  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || "").trim() || undefined;
  const description = (formData.get("description") as string)?.trim();
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim();
  const coverImageColor = (formData.get("coverImageColor") as string)?.trim();
  const difficulty = parseDifficultyFromForm(formData);
  const collectionType = parseCollectionTypeFromForm(formData);
  const sortOrder = parseSortOrder(formData.get("sortOrder"));
  const isActive = parseIsActive(formData);

  if (!title || !coverImageUrl || !coverImageColor) {
    return { error: "Title, cover image, and cover color are required." };
  }

  const input: UpdateCollectionInput = {
    title,
    slug,
    description,
    coverImageUrl,
    coverImageColor,
    difficulty,
    collectionType,
    sortOrder,
    isActive,
  };

  const collection = await updateCollection(supabase, id, input);
  if (!collection) {
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collection");
  revalidatePath(`/collection/${collection.slug}`);
  redirect("/admin/collections");
}

export async function deleteCollectionAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteCollection(supabase, id);
  if (!ok) {
    redirect("/admin/collections?error=delete_failed");
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collection");
  redirect("/admin/collections");
}
