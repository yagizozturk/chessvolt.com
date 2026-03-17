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

type BulkVariantInput = {
  opening_id: string;
  sort_key: string;
  title?: string | null;
  pgn: string;
  initial_fen?: string;
  initial_ply?: number;
  display_ply?: number;
  description?: string | null;
};

export async function createOpeningVariantAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const openingId = formData.get("openingId") as string;
  const pgn = (formData.get("pgn") as string)?.trim();
  const ply = parseInt((formData.get("ply") as string) ?? "0", 10);
  const title = (formData.get("title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const sortKey = (formData.get("sortKey") as string)?.trim() ?? "";
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
    sortKey,
    title: title || null,
    description: description || null,
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

export async function bulkCreateVariantsAction(jsonData: string) {
  const { supabase } = await getAdminUser();

  let items: BulkVariantInput | BulkVariantInput[];
  try {
    const parsed = JSON.parse(jsonData.trim()) as unknown;
    items = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    redirect("/admin/openings/bulk?error=gecersiz_json");
  }

  const created: string[] = [];
  const errors: { index: number; message: string }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item?.opening_id?.trim() || !item?.pgn?.trim()) {
      errors.push({ index: i, message: "opening_id ve pgn zorunludur" });
      continue;
    }

    const initialPly = Math.max(0, item.initial_ply ?? 0);
    const displayPly = item.display_ply ?? 0;

    const moves = getUciMovesFromPgnAfterPly(item.pgn.trim(), initialPly);
    if (!moves) {
      errors.push({ index: i, message: "Geçersiz PGN veya initial_ply" });
      continue;
    }

    const displayFen = getFenFromPgnAtPly(item.pgn.trim(), displayPly);
    if (!displayFen) {
      errors.push({ index: i, message: `display_ply (${displayPly}) PGN uzunluğunu aşıyor` });
      continue;
    }

    const initialFen =
      item.initial_fen?.trim() ||
      getFenFromPgnAtPly(item.pgn.trim(), initialPly) ||
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const input: CreateOpeningVariantInput = {
      openingId: item.opening_id.trim(),
      sortKey: (item.sort_key ?? "").toString().trim(),
      title: item.title?.trim() || null,
      description: item.description?.trim() || null,
      ply: initialPly,
      moves,
      pgn: item.pgn.trim(),
      initialFen,
      displayFen,
    };

    const variant = await createOpeningVariant(supabase, input);
    if (variant) {
      created.push(variant.id);
    } else {
      errors.push({ index: i, message: "Veritabanına yazılamadı" });
    }
  }

  const params = new URLSearchParams();
  if (created.length > 0) params.set("created", created.length.toString());
  if (errors.length > 0) params.set("errors", errors.length.toString());
  if (errors.length > 0) params.set("errorDetails", JSON.stringify(errors));

  revalidatePath("/admin/openings");
  redirect(`/admin/openings/bulk?${params.toString()}`);
}

export async function updateOpeningVariantAction(
  id: string,
  formData: FormData,
) {
  const { supabase } = await getAdminUser();

  const title = (formData.get("title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const sortKey = (formData.get("sortKey") as string)?.trim();
  const pgn = (formData.get("pgn") as string)?.trim();
  const ply = parseInt((formData.get("ply") as string) ?? "0", 10);
  const initialFen = (formData.get("initialFen") as string)?.trim() || null;
  const displayFen = (formData.get("displayFen") as string)?.trim() || null;

  const input: UpdateOpeningVariantInput = {};
  if (title !== undefined) input.title = title;
  if (description !== undefined) input.description = description;
  if (sortKey !== undefined) input.sortKey = sortKey;
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
