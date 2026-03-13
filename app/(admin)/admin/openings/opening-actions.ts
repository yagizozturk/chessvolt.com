"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import {
  createOpening,
  updateOpening,
  deleteOpening,
} from "@/features/openings/services/openings";
import type {
  CreateOpeningInput,
  UpdateOpeningInput,
} from "@/features/openings/repository/opening.repository";

export async function createOpeningAction(formData: FormData) {
  const { supabase, user } = await getAdminUser();

  const name = (formData.get("name") as string)?.trim();
  const ecoCode = (formData.get("ecoCode") as string) || null;
  const description = (formData.get("description") as string) || null;
  const fen = (formData.get("fen") as string) || null;

  if (!name) {
    redirect("/admin/openings?error=eksik_alan");
  }

  const input: CreateOpeningInput = {
    name,
    ecoCode: ecoCode || null,
    description: description || null,
    fen: fen || null,
    createdBy: user?.id ?? null,
  };

  const opening = await createOpening(supabase, input);
  if (!opening) {
    redirect("/admin/openings?error=olusturulamadi");
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}

export async function updateOpeningAction(
  id: string,
  formData: FormData,
) {
  const { supabase } = await getAdminUser();

  const name = (formData.get("name") as string)?.trim();
  const ecoCode = (formData.get("ecoCode") as string) || null;
  const description = (formData.get("description") as string) || null;
  const fen = (formData.get("fen") as string) || null;

  const input: UpdateOpeningInput = {};
  if (name !== undefined) input.name = name;
  if (ecoCode !== undefined) input.ecoCode = ecoCode;
  if (description !== undefined) input.description = description;
  if (fen !== undefined) input.fen = fen || null;

  const opening = await updateOpening(supabase, id, input);
  if (!opening) {
    redirect(`/admin/openings?error=guncellenemedi`);
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}

export async function deleteOpeningAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteOpening(supabase, id);
  if (!ok) {
    redirect("/admin/openings?error=delete_failed");
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}
