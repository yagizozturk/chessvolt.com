"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import { movesToPgn } from "@/lib/chess/movesToPgn";
import {
  createOpeningVariant,
  updateOpeningVariant,
  deleteOpeningVariant,
} from "@/features/openings/services/openings";
import type {
  CreateOpeningVariantInput,
  UpdateOpeningVariantInput,
} from "@/features/openings/repository/opening-variant.repository";

export async function createOpeningVariantAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const openingId = formData.get("openingId") as string;
  const moves = formData.get("moves") as string;
  const title = (formData.get("title") as string) || null;
  const ecoCode = (formData.get("ecoCode") as string) || null;
  const fen = (formData.get("fen") as string) || null;

  if (!openingId?.trim() || !moves?.trim()) {
    redirect("/admin/openings/new?error=eksik_alan");
  }

  const input: CreateOpeningVariantInput = {
    openingId: openingId.trim(),
    title: title || null,
    ecoCode: ecoCode || null,
    moves: moves.trim(),
    pgn: movesToPgn(moves.trim()),
    fen: fen || null,
  };

  const variant = await createOpeningVariant(supabase, input);
  if (!variant) {
    redirect("/admin/openings/new?error=olusturulamadi");
  }

  revalidatePath("/admin/openings");
  redirect(`/admin/openings/${variant.id}`);
}

export async function updateOpeningVariantAction(
  id: string,
  formData: FormData,
) {
  const { supabase } = await getAdminUser();

  const title = (formData.get("title") as string) || null;
  const ecoCode = (formData.get("ecoCode") as string) || null;
  const moves = formData.get("moves") as string;
  const fen = (formData.get("fen") as string) || null;

  const input: UpdateOpeningVariantInput = {};
  if (title !== undefined) input.title = title;
  if (ecoCode !== undefined) input.ecoCode = ecoCode;
  if (moves !== undefined) {
    input.moves = moves;
    input.pgn = movesToPgn(moves);
  }
  if (fen !== undefined) input.fen = fen;

  const variant = await updateOpeningVariant(supabase, id, input);
  if (!variant) {
    redirect(`/admin/openings/${id}?error=guncellenemedi`);
  }

  revalidatePath("/admin/openings");
  revalidatePath(`/admin/openings/${id}`);
  redirect(`/admin/openings/${id}`);
}

export async function deleteOpeningVariantAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const ok = await deleteOpeningVariant(supabase, id);
  if (!ok) {
    redirect("/admin/openings?error=delete_failed");
  }

  revalidatePath("/admin/openings");
  redirect("/admin/openings");
}
