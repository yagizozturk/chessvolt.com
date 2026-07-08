// TODO: Refactor
"use server";

import { deleteUserCustomCollection } from "@/features/collection/services/collection.service";

import { getUserCollectionActionContext, revalidateUserCollectionPage } from "./shared";

export async function deleteMyCollectionAction(formData: FormData): Promise<void> {
  const { supabase, user } = await getUserCollectionActionContext();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await deleteUserCustomCollection(supabase, {
    id,
    userId: user.id,
  });

  revalidateUserCollectionPage();
}
