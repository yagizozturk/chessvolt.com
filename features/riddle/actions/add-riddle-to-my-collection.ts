// TODO: Refactor
"use server";

import { revalidatePath } from "next/cache";

import { getCollectionById } from "@/features/collection/services/collection.service";
import { getCollectionRiddlesByRiddleId } from "@/features/collection-riddles/services/collection-riddles.service";
import { addRiddleToUserCustomCollection } from "@/features/collection-riddles/services/add-riddle-to-user-custom-collection";
import type { AddRiddleToUserCustomCollectionResult } from "@/features/collection-riddles/services/add-riddle-to-user-custom-collection";
import { buildRiddlePath } from "@/features/riddle/utilities/build-riddle-path";
import { getParentCollectionUrl } from "@/features/riddle/utilities/get-parent-collection-url";
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
    revalidatePath("/user-collection");
    revalidatePath("/collection", "layout");
    revalidatePath("/user-collection", "layout");

    const links = await getCollectionRiddlesByRiddleId(supabase, riddleId);
    const collections = await Promise.all(
      [...new Set(links.map((link) => link.collectionId))].map((id) => getCollectionById(supabase, id)),
    );

    for (const collection of collections) {
      if (!collection?.slug) continue;

      revalidatePath(getParentCollectionUrl(collection));
      revalidatePath(
        buildRiddlePath(riddleId, {
          collectionSlug: collection.slug,
          collectionType: collection.collectionType,
        }),
      );
    }
  }

  return result;
}
