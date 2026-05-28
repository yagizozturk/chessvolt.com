import type { SupabaseClient } from "@supabase/supabase-js";

import * as gameRepo from "@/features/game/repository/game.repository";

type RawBulkRiddleInput = {
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
    gameType: item.gameType,
    gameId: item.gameId,
    pgn: item.pgn,
    initialPly: item.initialPly,
    displayPly: item.displayPly,
    moveCountForAnswer: item.moveCountForAnswer,
    answerEndPly: item.answerEndPly,
    moves: item.moves,
    themes: item.themes,
    isActive: item.isActive,
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
