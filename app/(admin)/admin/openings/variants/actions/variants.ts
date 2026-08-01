"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  CreateOpeningVariantInput,
  UpdateOpeningVariantInput,
} from "@/features/openings/repository/opening-variant.repository";
import {
  createOpeningVariant,
  deleteOpeningVariant,
  getMaxSortKeyByOpeningId,
  getOpeningVariantById,
  updateOpeningVariant,
} from "@/features/openings/services/openings.service";
import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import { getFenFromPgnAtPly } from "@/lib/chess/getFenFromPgnAtPly";
import { getUciMovesFromPgnAfterPly } from "@/lib/chess/getUciMovesFromPgnAfterPly";
import { buildMoveGoalsFromPgnComments, normalizeLichessPgnComments } from "@/lib/chess/parse-pgn-visual-comments";
import {
  mergeGoalsWithOverlay,
  parseGoalsOverlayJson,
} from "@/lib/move-sequence-goals/merge-goals-overlay";
import { parsePgn, splitPgnGames } from "@/lib/chess/parsePgn";
import { getAdminUser } from "@/lib/supabase/auth";

const DEFAULT_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Empty or missing → 0 (initial ply default). */
function parseAdminPly(formData: FormData, key: string): number {
  const raw = (formData.get(key) as string | null)?.trim();
  if (raw === undefined || raw === "") return 0;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 0) return 0;
  return n;
}

/** Form hata yönlendirmesi — doğru route: `variants/new`. */
function newVariantUrl(formData: FormData, error: string): string {
  const q = new URLSearchParams({ error });
  const id = (formData.get("openingId") as string)?.trim();
  if (id) q.set("openingId", id);
  return `/admin/openings/variants/new?${q.toString()}`;
}

/** Build goals from annotated PGN + optional Goals JSON overlay (`goalsJson`). */
function mergeGoalsFromForm(
  pgn: string,
  initialFen: string,
  moves: string,
  initialPly: number,
  formData: FormData,
  errorRedirect: string,
): MoveGoals {
  const goalsJson = (formData.get("goalsJson") as string | null) ?? "";
  const { overlay, error: overlayError } = parseGoalsOverlayJson(goalsJson);
  if (overlayError) {
    redirect(errorRedirect);
  }
  return mergeGoalsWithOverlay(
    buildMoveGoalsFromPgnComments(pgn, initialFen, moves, initialPly),
    overlay,
  );
}

export async function createOpeningVariantAction(formData: FormData) {
  const { supabase } = await getAdminUser();

  const openingId = formData.get("openingId") as string;
  const rawPgn = (formData.get("pgn") as string)?.trim();
  const initialPly = parseAdminPly(formData, "initialPly");
  const displayPly = parseAdminPly(formData, "displayPly");
  const title = (formData.get("title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const sortKey = parseInt((formData.get("sortKey") as string)?.trim() ?? "", 10);

  if (!openingId?.trim() || !rawPgn || Number.isNaN(sortKey)) {
    redirect(newVariantUrl(formData, "missing_fields"));
  }

  const pgn = normalizeLichessPgnComments(rawPgn);
  const moves = getUciMovesFromPgnAfterPly(pgn, initialPly);
  if (!moves) {
    redirect(newVariantUrl(formData, "invalid_pgn"));
  }

  const initialFen =
    (formData.get("initialFen") as string)?.trim() ||
    getFenFromPgnAtPly(pgn, initialPly) ||
    DEFAULT_START_FEN;
  const displayFen =
    (formData.get("displayFen") as string)?.trim() ||
    getFenFromPgnAtPly(pgn, displayPly) ||
    null;

  const goals = mergeGoalsFromForm(
    pgn,
    initialFen,
    moves,
    initialPly,
    formData,
    newVariantUrl(formData, "invalid_goals_json"),
  );

  const input: CreateOpeningVariantInput = {
    openingId: openingId.trim(),
    sortKey,
    title: title || null,
    description: description || null,
    initialPly,
    moves,
    pgn,
    initialFen,
    displayFen,
    goals,
  };

  const variant = await createOpeningVariant(supabase, input);
  if (!variant) {
    redirect(newVariantUrl(formData, "create_failed"));
  }

  revalidatePath("/admin/openings");
  revalidatePath(`/admin/openings/main-opening/${variant.openingId}`);
  redirect(`/admin/openings/variants/${variant.id}`);
}

export async function bulkCreateVariantsAction(jsonData: string) {
  const formData = new FormData();
  formData.set("pgnText", jsonData);
  return bulkImportPgnVariantsAction(formData);
}

export async function bulkImportPgnVariantsAction(formData: FormData) {
  const { supabase } = await getAdminUser();
  const openingId = ((formData.get("openingId") as string) || "").trim();
  const pgnText = ((formData.get("pgnText") as string) || "").trim();

  if (!openingId || !pgnText) {
    redirect("/admin/openings/variants/bulk?error=missing_fields");
  }

  const pgns = splitPgnGames(pgnText);
  if (pgns.length === 0) {
    redirect(`/admin/openings/variants/bulk?error=invalid_pgn&openingId=${encodeURIComponent(openingId)}`);
  }

  const created: string[] = [];
  const errors: { index: number; message: string }[] = [];
  const maxSortKey = await getMaxSortKeyByOpeningId(supabase, openingId);

  for (let i = 0; i < pgns.length; i++) {
    const pgn = pgns[i]!.trim();
    const initialPly = 0;
    const moves = getUciMovesFromPgnAfterPly(pgn, initialPly);
    if (!moves) {
      errors.push({ index: i, message: "Geçersiz PGN" });
      continue;
    }

    const initialFen = getFenFromPgnAtPly(pgn, initialPly) || DEFAULT_START_FEN;
    const displayFen = initialFen;
    const parsedGame = parsePgn(pgn);

    const input: CreateOpeningVariantInput = {
      openingId,
      sortKey: maxSortKey + i + 1,
      title: parsedGame?.description ?? null,
      description: null,
      initialPly,
      moves,
      pgn,
      initialFen,
      displayFen,
    };

    const variant = await createOpeningVariant(supabase, input);
    if (variant) {
      created.push(variant.id);
    } else {
      errors.push({
        index: i,
        message: "Could not be written to the database",
      });
    }
  }

  const params = new URLSearchParams();
  params.set("openingId", openingId);
  if (created.length > 0) params.set("created", created.length.toString());
  if (errors.length > 0) params.set("errors", errors.length.toString());
  if (errors.length > 0) params.set("errorDetails", JSON.stringify(errors));

  revalidatePath("/admin/openings");
  redirect(`/admin/openings/variants/bulk?${params.toString()}`);
}

export async function updateOpeningVariantAction(id: string, formData: FormData) {
  const { supabase } = await getAdminUser();

  const title = (formData.get("title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const sortKeyStr = (formData.get("sortKey") as string)?.trim();
  const rawPgn = (formData.get("pgn") as string)?.trim();
  const initialPly = parseAdminPly(formData, "initialPly");
  const displayPly = parseAdminPly(formData, "displayPly");
  const initialFenManual = (formData.get("initialFen") as string)?.trim() || null;
  const displayFenManual = (formData.get("displayFen") as string)?.trim() || null;
  const errorBase = `/admin/openings/variants/${id}`;

  if (!rawPgn) {
    redirect(`${errorBase}?error=missing_fields`);
  }

  const pgn = normalizeLichessPgnComments(rawPgn);
  const moves = getUciMovesFromPgnAfterPly(pgn, initialPly);
  if (!moves) {
    redirect(`${errorBase}?error=invalid_pgn`);
  }

  const initialFen = initialFenManual || getFenFromPgnAtPly(pgn, initialPly) || DEFAULT_START_FEN;
  const displayFen = displayFenManual || getFenFromPgnAtPly(pgn, displayPly) || null;

  const input: UpdateOpeningVariantInput = {
    title,
    description,
    pgn,
    moves,
    initialPly,
    initialFen,
    displayFen,
    goals: mergeGoalsFromForm(
      pgn,
      initialFen,
      moves,
      initialPly,
      formData,
      `${errorBase}?error=invalid_goals_json`,
    ),
  };

  if (sortKeyStr !== undefined && sortKeyStr !== "") {
    const n = parseInt(sortKeyStr, 10);
    if (Number.isNaN(n)) {
      redirect(`${errorBase}?error=invalid_sort_key`);
    }
    input.sortKey = n;
  }

  const variant = await updateOpeningVariant(supabase, id, input);
  if (!variant) {
    redirect(`${errorBase}?error=could_not_be_updated`);
  }

  revalidatePath("/admin/openings");
  revalidatePath(`/admin/openings/variants/${id}`);
  revalidatePath(`/admin/openings/main-opening/${variant.openingId}`);
  redirect(`/admin/openings/variants/${id}`);
}

export async function deleteOpeningVariantAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();

  const existing = await getOpeningVariantById(supabase, id);
  const openingId = existing?.openingId;

  const ok = await deleteOpeningVariant(supabase, id);
  if (!ok) {
    redirect(
      openingId
        ? `/admin/openings/main-opening/${openingId}?error=delete_failed`
        : "/admin/openings?error=delete_failed",
    );
  }

  revalidatePath("/admin/openings");
  if (openingId) {
    revalidatePath(`/admin/openings/main-opening/${openingId}`);
  }
  revalidatePath(`/admin/openings/variants/${id}`);
  redirect(openingId ? `/admin/openings/main-opening/${openingId}` : "/admin/openings");
}
