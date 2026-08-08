"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { deletePuzzle } from "@/features/puzzle/services/puzzle.service";
import { getAdminUser } from "@/lib/supabase/auth";

export async function deletePuzzleAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deletePuzzle(supabase, id);
  if (!ok) {
    redirect("/admin/puzzles?error=delete_failed");
  }

  revalidatePath("/admin/puzzles");
  revalidatePath("/study");
  redirect("/admin/puzzles");
}
