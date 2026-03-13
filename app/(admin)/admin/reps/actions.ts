"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import { createRep, updateRep, deleteRep } from "@/features/reps/services/reps";
import type {
  CreateRepInput,
  UpdateRepInput,
} from "@/features/reps/repository/reps.repository";

export async function createRepAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const moves = formData.get("moves") as string;
  const openingName = (formData.get("openingName") as string) || null;
  const openingType = (formData.get("openingType") as string) || null;
  const title = (formData.get("title") as string) || "";
  const plyStr = formData.get("ply") as string;
  const ply = plyStr ? parseInt(plyStr, 10) : null;
  const pgn = (formData.get("pgn") as string) || null;
  const displayFen = (formData.get("displayFen") as string) || null;

  if (!moves?.trim()) {
    redirect("/admin/reps/new?error=eksik_alan");
  }

  const input: CreateRepInput = {
    moves: moves.trim(),
    openingName,
    openingType,
    title: title || null,
    ply: isNaN(ply as number) ? null : ply,
    pgn,
    displayFen,
  };

  const rep = await createRep(supabase, input);
  if (!rep) {
    redirect("/admin/reps/new?error=olusturulamadi");
  }

  revalidatePath("/admin/reps");
  redirect(`/admin/reps/${rep.id}`);
}

export async function updateRepAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const moves = formData.get("moves") as string;
  const openingName = (formData.get("openingName") as string) || null;
  const openingType = (formData.get("openingType") as string) || null;
  const title = formData.get("title") as string;
  const plyStr = formData.get("ply") as string;
  const ply = plyStr ? parseInt(plyStr, 10) : null;
  const pgn = (formData.get("pgn") as string) || null;
  const displayFen = (formData.get("displayFen") as string) || null;

  const input: UpdateRepInput = {};
  if (moves !== undefined) input.moves = moves;
  if (openingName !== undefined) input.openingName = openingName;
  if (openingType !== undefined) input.openingType = openingType;
  if (title !== undefined) input.title = title;
  if (plyStr !== undefined) input.ply = isNaN(ply as number) ? null : ply;
  if (pgn !== undefined) input.pgn = pgn;
  if (displayFen !== undefined) input.displayFen = displayFen;

  const rep = await updateRep(supabase, id, input);
  if (!rep) {
    redirect(`/admin/reps/${id}?error=guncellenemedi`);
  }

  revalidatePath("/admin/reps");
  revalidatePath(`/admin/reps/${id}`);
  redirect(`/admin/reps/${id}`);
}

export async function deleteRepAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteRep(supabase, id);
  if (!ok) {
    redirect("/admin/reps?error=delete_failed");
  }

  revalidatePath("/admin/reps");
  redirect("/admin/reps");
}
