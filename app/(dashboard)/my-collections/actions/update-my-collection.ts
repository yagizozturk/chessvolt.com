"use server";

import { updateUserCustomCollection } from "@/features/collection/services/collection.service";

import { getMyCollectionsActionContext, revalidateMyCollectionsPage } from "./shared";

export async function updateMyCollectionAction(formData: FormData): Promise<void> {
  const { supabase, user } = await getMyCollectionsActionContext();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!id || !title) return;

  await updateUserCustomCollection(supabase, {
    id,
    userId: user.id,
    title,
    description,
  });

  revalidateMyCollectionsPage();
}
