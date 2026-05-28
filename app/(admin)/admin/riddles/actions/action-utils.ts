import type { SupabaseClient } from "@supabase/supabase-js";

import * as gameRepo from "@/features/game/repository/game.repository";

type RawBulkRiddleInput = {
  title?: string;
  gameType?: string;
  game_type?: string;
  gameId?: string | null;
  game_id?: string | null;
  pgn?: string;
  initial_ply?: number;
  display_ply?: number;
  move_count_for_answer?: number;
  answer_end_ply?: number;
  moves?: string | null;
  themes?: string[] | string | null;
  isActive?: boolean;
  is_active?: boolean;
  goals?: unknown;
};

export type BulkRiddleInput = {
  title?: string;
  gameType?: string;
  gameId?: string | null;
  pgn?: string;
  initialPly?: number;
  displayPly?: number;
  moveCountForAnswer?: number;
  answerEndPly?: number;
  moves?: string | null;
  themes?: string[] | string | null;
  isActive?: boolean;
  goals?: unknown;
};

export function normalizeBulkRiddleInput(item: RawBulkRiddleInput): BulkRiddleInput {
  return {
    title: item.title,
    gameType: item.gameType ?? item.game_type,
    gameId: item.gameId ?? item.game_id,
    pgn: item.pgn,
    initialPly: item.initial_ply,
    displayPly: item.display_ply,
    moveCountForAnswer: item.move_count_for_answer,
    answerEndPly: item.answer_end_ply,
    moves: item.moves,
    themes: item.themes,
    isActive: item.isActive ?? item.is_active,
    goals: item.goals,
  };
}

export function normalizeBulkRiddleInputs(items: unknown): BulkRiddleInput[] {
  const rows = (Array.isArray(items) ? items : [items]) as RawBulkRiddleInput[];
  return rows.map(normalizeBulkRiddleInput);
}

export function parseBulkThemes(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) {
    return v
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (typeof v === "string") {
    return v
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export function parseThemesFromForm(formData: FormData): string[] {
  const raw = (formData.get("themes") as string | null)?.trim() ?? "";
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export function parseIsActiveFromForm(formData: FormData): boolean {
  return formData.get("isActive") === "on";
}

export async function resolvePgnFromFormInput({
  supabase,
  pgnInput,
  gameId,
}: {
  supabase: SupabaseClient;
  pgnInput: string;
  gameId: string | null;
}) {
  let pgn = pgnInput;
  if (!pgn && gameId) {
    const game = await gameRepo.findById(supabase, gameId);
    pgn = game?.pgn?.trim() ?? "";
  }
  return pgn;
}
