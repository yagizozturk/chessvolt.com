"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import {
  getUciMovesFromPgnAfterPly,
} from "@/lib/chess/extractMovesFromPgn";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
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
  const pgn = (formData.get("pgn") as string)?.trim();
  const ply = parseInt((formData.get("ply") as string) ?? "0", 10);
  const title = (formData.get("title") as string) || null;
  const ecoCode = (formData.get("ecoCode") as string) || null;
  const initialFen =
    (formData.get("initialFen") as string)?.trim() ||
    getFenFromPgnAtPly(pgn ?? "", ply >= 0 ? ply : 0) ||
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const displayFen = (formData.get("displayFen") as string)?.trim() || null;

  if (!openingId?.trim() || !pgn) {
    redirect("/admin/openings/new?error=eksik_alan");
  }

  const moves = getUciMovesFromPgnAfterPly(pgn, ply >= 0 ? ply : 0);
  if (!moves) {
    redirect("/admin/openings/new?error=gecersiz_pgn");
  }

  const input: CreateOpeningVariantInput = {
    openingId: openingId.trim(),
    title: title || null,
    ecoCode: ecoCode || null,
    ply: ply >= 0 ? ply : 0,
    moves,
    pgn,
    initialFen,
    displayFen,
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
  const pgn = (formData.get("pgn") as string)?.trim();
  const ply = parseInt((formData.get("ply") as string) ?? "0", 10);
  const initialFen = (formData.get("initialFen") as string)?.trim() || null;
  const displayFen = (formData.get("displayFen") as string)?.trim() || null;

  const input: UpdateOpeningVariantInput = {};
  if (title !== undefined) input.title = title;
  if (ecoCode !== undefined) input.ecoCode = ecoCode;
  if (!isNaN(ply) && ply >= 0) input.ply = ply;
  if (pgn) {
    const moves = getUciMovesFromPgnAfterPly(pgn, ply >= 0 ? ply : 0);
    if (!moves) {
      redirect(`/admin/openings/${id}?error=gecersiz_pgn`);
    }
    input.pgn = pgn;
    input.moves = moves;
  }
  if (initialFen) input.initialFen = initialFen; // only when non-empty (initial_fen is NOT NULL)
  if (displayFen !== undefined) input.displayFen = displayFen;

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
