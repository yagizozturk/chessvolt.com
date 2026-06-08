"use server";

import { revalidatePath } from "next/cache";

import { addRiddleToUserCustomCollection } from "@/features/collection-riddles/services/add-riddle-to-user-custom-collection";
import type { AddRiddleToUserCustomCollectionResult } from "@/features/collection-riddles/services/add-riddle-to-user-custom-collection";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function addRiddleToMyCollectionAction(
  riddleId: string,
  collectionId: string,
): Promise<AddRiddleToUserCustomCollectionResult> {
  const { user, supabase } = await getAuthenticatedUser();

  const result = await addRiddleToUserCustomCollection(supabase, {
    userId: user.id,
    riddleId,
    collectionId,
  });

  if (result.ok) {
    revalidatePath("/my-practices");
    revalidatePath(`/riddle/${riddleId}`);
  }

  return result;
}
