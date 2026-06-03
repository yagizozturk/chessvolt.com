import { revalidatePath } from "next/cache";

import { getAuthenticatedUser } from "@/lib/supabase/auth";

export const DEFAULT_COLLECTION_COVER_IMAGE = "from-tal-to-kasparov.png";
export const DEFAULT_COLLECTION_COVER_COLOR = "#5D37BF";

export async function getMyCollectionsActionContext() {
  return getAuthenticatedUser();
}

export function revalidateMyCollectionsPage() {
  revalidatePath("/my-collections");
  revalidatePath("/my-collections/create");
}
