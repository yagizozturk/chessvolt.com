"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { deleteRiddle } from "@/features/riddle/services/riddle.service";
import { getAdminUser } from "@/lib/supabase/auth";

export async function deleteRiddleAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteRiddle(supabase, id);
  if (!ok) {
    redirect("/admin/riddles?error=delete_failed");
  }

  revalidatePath("/admin/riddles");
  revalidatePath("/collection");
  redirect("/admin/riddles");
}
