"use server";

import { redirect } from "next/navigation";

import { createMyCustomCollection } from "@/features/collection/services/collection.service";

import {
  DEFAULT_COLLECTION_COVER_COLOR,
  DEFAULT_COLLECTION_COVER_IMAGE,
  getMyCollectionsActionContext,
  revalidateMyCollectionsPage,
} from "./shared";

export async function createMyCollectionAction(formData: FormData): Promise<void> {
  const { supabase, user } = await getMyCollectionsActionContext();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) return;

  const collection = await createMyCustomCollection(supabase, {
    title,
    description,
    createdBy: user.id,
    coverImageUrl: DEFAULT_COLLECTION_COVER_IMAGE,
    coverImageColor: DEFAULT_COLLECTION_COVER_COLOR,
  });

  revalidateMyCollectionsPage();

  if (collection) {
    redirect("/my-collections");
  }
}
