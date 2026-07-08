// TODO: Refactor
"use server";

import { redirect } from "next/navigation";

import { createUserCustomCollection } from "@/features/collection/services/collection.service";

import {
  DEFAULT_COLLECTION_COVER_COLOR,
  DEFAULT_COLLECTION_COVER_IMAGE,
  getUserCollectionActionContext,
  revalidateUserCollectionPage,
} from "./shared";

export async function createMyCollectionAction(formData: FormData): Promise<void> {
  const { supabase, user } = await getUserCollectionActionContext();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) return;

  const collection = await createUserCustomCollection(supabase, {
    title,
    description,
    createdBy: user.id,
    coverImageUrl: DEFAULT_COLLECTION_COVER_IMAGE,
    coverImageColor: DEFAULT_COLLECTION_COVER_COLOR,
  });

  revalidateUserCollectionPage();

  if (collection) {
    redirect("/user-collection");
  }
}
