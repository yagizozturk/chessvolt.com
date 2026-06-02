"use server";

import { deleteMyCustomCollection } from "@/features/collection/services/collection.service";

import { getMyCollectionsActionContext, revalidateMyCollectionsPage } from "./shared";

export async function deleteMyCollectionAction(formData: FormData): Promise<void> {
  const { supabase, user } = await getMyCollectionsActionContext();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await deleteMyCustomCollection(supabase, {
    id,
    userId: user.id,
  });

  revalidateMyCollectionsPage();
}
