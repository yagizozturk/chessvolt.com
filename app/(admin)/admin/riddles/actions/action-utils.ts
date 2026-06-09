import type { SupabaseClient } from "@supabase/supabase-js";

import * as gameRepo from "@/features/game/repository/game.repository";
import {
  addRiddleToCollection,
  deleteCollectionRiddlesForRiddle,
  getCollectionRiddlesByRiddleId,
} from "@/features/collection-riddles/services/collection-riddles.service";
import { parseRiddleRating } from "@/features/riddle/types/riddle-rating";
import { syncRiddleThemesFromSlugs } from "@/features/riddle-theme/services/riddle-theme.service";

export { syncRiddleThemesFromSlugs };

type RawBulkRiddleInput = {
  title?: string;
  description?: string | null;
  rating?: string | number | null;
  collectionId?: string | null;
  gameId?: string | null;
  sourceId?: string | null;
  source?: string | null;
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
  description?: string | null;
  rating?: string | number | null;
  collectionId?: string | null;
  gameId?: string | null;
  sourceId?: string | null;
  source?: string | null;
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
    description: item.description,
    rating: item.rating,
    collectionId: item.collectionId,
    gameId: item.gameId,
    sourceId: item.sourceId,
    source: item.source,
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

export function parseDescriptionFromForm(formData: FormData): string | null {
  const raw = (formData.get("description") as string | null)?.trim() ?? "";
  return raw || null;
}

export function parseSourceIdFromForm(formData: FormData): string | null {
  const raw = (formData.get("sourceId") as string | null)?.trim() ?? "";
  return raw || null;
}

export function parseSourceFromForm(formData: FormData): string | null {
  const raw = (formData.get("source") as string | null)?.trim() ?? "";
  return raw || null;
}

export function parseRatingFromForm(formData: FormData): number | null {
  return parseRiddleRating(formData.get("rating"));
}

export function parseCollectionIdFromForm(formData: FormData): string | null {
  const raw = (formData.get("collectionId") as string | null)?.trim() ?? "";
  return raw || null;
}

export function parseBulkCollectionId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export async function linkRiddleToCollection(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string | null,
): Promise<boolean> {
  if (!collectionId) return true;

  const link = await addRiddleToCollection(supabase, { riddleId, collectionId });
  return link != null;
}

export async function syncCollectionRiddle(
  supabase: SupabaseClient,
  riddleId: string,
  collectionId: string | null,
): Promise<boolean> {
  if (!collectionId) return true;

  const existing = await getCollectionRiddlesByRiddleId(supabase, riddleId);
  if (existing.some((row) => row.collectionId === collectionId) && existing.length === 1) {
    return true;
  }

  if (existing.length > 0) {
    const removed = await deleteCollectionRiddlesForRiddle(supabase, riddleId);
    if (!removed) return false;
  }

  return linkRiddleToCollection(supabase, riddleId, collectionId);
}

export function parseBulkRating(value: unknown): number | null {
  return parseRiddleRating(value);
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
