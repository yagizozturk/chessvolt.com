"use server";

import type {
  CreateOpeningVariantInput,
  UpdateOpeningVariantInput,
} from "@/features/openings/repository/opening-variant.repository";
import type { OpeningVariantGoal } from "@/features/openings/types/opening-variant";
import { isOpeningVariantGoalsArray } from "@/features/openings/validation/opening-variant-goals";
import {
  createOpeningVariant,
  deleteOpeningVariant,
  getOpeningVariantById,
  updateOpeningVariant,
} from "@/features/openings/services/openings.service";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/extractMovesFromPgn";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getAdminUser } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type BulkVariantInput = {
  opening_id: string;
  sort_key?: number | string;
  title?: string | null;
  pgn: string;
  initial_fen?: string;
  initial_ply?: number;
  display_ply?: number;
  description?: string | null;
  goals?: unknown;
};

function parseGoalsFromForm(
  formData: FormData,
  errorRedirect: string,
): OpeningVariantGoal[] | null {
  const raw = formData.get("goals");
  if (raw === null) return null;
  const str = typeof raw === "string" ? raw.trim() : "";
  if (str === "") return null;
  try {
    const parsed = JSON.parse(str) as unknown;
    if (parsed === null) return null;
    if (!isOpeningVariantGoalsArray(parsed)) redirect(errorRedirect);
    return parsed;
  } catch {
    redirect(errorRedirect);
  }
}

function parseBulkSortKey(
  v: unknown,
): { ok: true; value: number } | { ok: false } {
  if (v === undefined || v === null) return { ok: true, value: 0 };
  if (typeof v === "number" && Number.isFinite(v))
    return { ok: true, value: Math.trunc(v) };
  if (typeof v === "string") {
    const t = v.trim();
    if (t === "") return { ok: true, value: 0 };
    const n = parseInt(t, 10);
    if (Number.isNaN(n)) return { ok: false };
    return { ok: true, value: n };
  }
  return { ok: false };
}

export async function createOpeningVariantAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const openingId = formData.get("openingId") as string;
  const pgn = (formData.get("pgn") as string)?.trim();
  const ply = parseInt((formData.get("ply") as string) ?? "0", 10);
  const title = (formData.get("title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const sortKey = parseInt(
    (formData.get("sortKey") as string)?.trim() ?? "",
    10,
  );
  const initialFen =
    (formData.get("initialFen") as string)?.trim() ||
    getFenFromPgnAtPly(pgn ?? "", ply >= 0 ? ply : 0) ||
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const displayFen = (formData.get("displayFen") as string)?.trim() || null;
  const goals = parseGoalsFromForm(
    formData,
    "/admin/openings/new?error=gecersiz_goals_json",
  );

  if (!openingId?.trim() || !pgn || Number.isNaN(sortKey)) {
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
    goals,
  };

  const variant = await createOpeningVariant(supabase, input);
  if (!variant) {
    redirect("/admin/openings/new?error=olusturulamadi");
  }

  revalidatePath("/admin/openings");
  revalidatePath(`/admin/openings/opening/${variant.openingId}`);
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
      errors.push({
        index: i,
        message: `display_ply (${displayPly}) PGN uzunluğunu aşıyor`,
      });
      continue;
    }

    const initialFen =
      item.initial_fen?.trim() ||
      getFenFromPgnAtPly(item.pgn.trim(), initialPly) ||
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const sortKeyParsed = parseBulkSortKey(item.sort_key);
    if (!sortKeyParsed.ok) {
      errors.push({ index: i, message: "Geçersiz sort_key" });
      continue;
    }

    let goals: OpeningVariantGoal[] | null | undefined;
    if ("goals" in item) {
      const g = item.goals;
      if (g === null) {
        goals = null;
      } else if (isOpeningVariantGoalsArray(g)) {
        goals = g;
      } else {
        errors.push({
          index: i,
          message:
            "goals null veya { sort_key, move, card, title, description }[] olmalıdır",
        });
        continue;
      }
    }

    const input: CreateOpeningVariantInput = {
      openingId: item.opening_id.trim(),
      sortKey: sortKeyParsed.value,
      title: item.title?.trim() || null,
      description: item.description?.trim() || null,
      ply: initialPly,
      moves,
      pgn: item.pgn.trim(),
      initialFen,
      displayFen,
      ...(goals !== undefined ? { goals } : {}),
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
  const sortKeyStr = (formData.get("sortKey") as string)?.trim();
  const pgn = (formData.get("pgn") as string)?.trim();
  const ply = parseInt((formData.get("ply") as string) ?? "0", 10);
  const initialFen = (formData.get("initialFen") as string)?.trim() || null;
  const displayFen = (formData.get("displayFen") as string)?.trim() || null;
  const goals = parseGoalsFromForm(
    formData,
    `/admin/openings/${id}?error=gecersiz_goals_json`,
  );

  const input: UpdateOpeningVariantInput = {};
  if (title !== undefined) input.title = title;
  if (description !== undefined) input.description = description;
  if (sortKeyStr !== undefined && sortKeyStr !== "") {
    const n = parseInt(sortKeyStr, 10);
    if (Number.isNaN(n)) {
      redirect(`/admin/openings/${id}?error=gecersiz_sort_key`);
    }
    input.sortKey = n;
  }
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
  input.goals = goals;

  const variant = await updateOpeningVariant(supabase, id, input);
  if (!variant) {
    redirect(`/admin/openings/${id}?error=guncellenemedi`);
  }

  revalidatePath("/admin/openings");
  revalidatePath(`/admin/openings/${id}`);
  revalidatePath(`/admin/openings/opening/${variant.openingId}`);
  redirect(`/admin/openings/${id}`);
}

export async function deleteOpeningVariantAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const existing = await getOpeningVariantById(supabase, id);
  const openingId = existing?.openingId;

  const ok = await deleteOpeningVariant(supabase, id);
  if (!ok) {
    redirect(
      openingId
        ? `/admin/openings/opening/${openingId}?error=delete_failed`
        : "/admin/openings?error=delete_failed",
    );
  }

  revalidatePath("/admin/openings");
  if (openingId) {
    revalidatePath(`/admin/openings/opening/${openingId}`);
  }
  revalidatePath(`/admin/openings/${id}`);
  redirect(
    openingId ? `/admin/openings/opening/${openingId}` : "/admin/openings",
  );
}
