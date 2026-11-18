import type { SupabaseClient } from "@supabase/supabase-js";

import { normalizeMoveGoals } from "@/features/move-sequence/validation/move-sequence-goals";
import { persistNewPuzzle } from "@/features/puzzle/services/persist-puzzle.service";
import { parsePuzzleRating } from "@/features/puzzle/types/puzzle-rating";
import { parsePuzzlePopularity } from "@/features/puzzle/utilities/parse-puzzle-popularity";
import {
  type ResolvePuzzleSequenceError,
  resolveFromPlySelection,
} from "@/features/puzzle/utilities/resolve-puzzle-sequence";
import { buildStubGoalsFromMoves } from "@/lib/move-sequence-goals/build-stub-goals";

export type CreatePuzzleFromPlyInput = {
  pgn: string;
  initialPly: number;
  displayPly: number;
  endPly: number;
  title: string;
  rating?: unknown;
  popularity?: unknown;
  themes?: string[];
  studyId?: string | null;
  goals?: unknown;
  isActive?: boolean;
  gameId?: string | null;
  source?: string | null;
  sourceId?: string | null;
};

export type CreatePuzzleFromPlyErrorCode =
  | ResolvePuzzleSequenceError["code"]
  | "missing_title"
  | "invalid_goals"
  | "create_failed"
  | "themes_sync_failed"
  | "study_link_failed";

export type CreatePuzzleFromPlyResult =
  | { ok: true; puzzleId: string }
  | { ok: false; error: string; code: CreatePuzzleFromPlyErrorCode };

export type ParseCreatePuzzleFromPlyBodyResult =
  | { ok: true; input: CreatePuzzleFromPlyInput }
  | { ok: false; error: string };

function toPly(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) ? value : -1;
}

export function parseCreatePuzzleFromPlyBody(body: unknown): ParseCreatePuzzleFromPlyBodyResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const raw = body as Record<string, unknown>;

  if (typeof raw.pgn !== "string") {
    return { ok: false, error: "PGN is required." };
  }
  if (raw.title !== undefined && typeof raw.title !== "string") {
    return { ok: false, error: "Title must be a string." };
  }
  if (
    raw.themes !== undefined &&
    raw.themes !== null &&
    (!Array.isArray(raw.themes) || !raw.themes.every((theme) => typeof theme === "string"))
  ) {
    return { ok: false, error: "Themes must be an array of strings." };
  }
  if (raw.studyId !== undefined && raw.studyId !== null && typeof raw.studyId !== "string") {
    return { ok: false, error: "studyId must be a string or null." };
  }
  if (raw.isActive !== undefined && typeof raw.isActive !== "boolean") {
    return { ok: false, error: "isActive must be a boolean." };
  }

  return {
    ok: true,
    input: {
      pgn: raw.pgn,
      initialPly: toPly(raw.initialPly),
      displayPly: toPly(raw.displayPly),
      endPly: toPly(raw.endPly),
      title: (raw.title as string | undefined) ?? "",
      rating: raw.rating,
      popularity: raw.popularity,
      themes: (raw.themes as string[] | null | undefined) ?? [],
      studyId: (raw.studyId as string | null | undefined) ?? null,
      goals: raw.goals,
      isActive: raw.isActive as boolean | undefined,
    },
  };
}

export async function createPuzzleFromPly(
  supabase: SupabaseClient,
  input: CreatePuzzleFromPlyInput,
): Promise<CreatePuzzleFromPlyResult> {
  const resolved = resolveFromPlySelection({
    pgn: input.pgn,
    initialPly: input.initialPly,
    displayPly: input.displayPly,
    endPly: input.endPly,
  });
  if ("code" in resolved) {
    return { ok: false, error: resolved.message, code: resolved.code };
  }

  const title = input.title.trim();
  if (!title) {
    return { ok: false, error: "Title is required.", code: "missing_title" };
  }

  let goals = buildStubGoalsFromMoves(resolved.initialFen, resolved.moves);
  if (input.goals != null) {
    const normalized = normalizeMoveGoals(input.goals);
    if (!normalized) {
      return {
        ok: false,
        error: "Goals must include mainIdea and valid plys with move details.",
        code: "invalid_goals",
      };
    }
    goals = normalized;
  }

  const themes = (input.themes ?? []).map((theme) => theme.trim()).filter(Boolean);

  const result = await persistNewPuzzle(supabase, {
    title,
    rating: parsePuzzleRating(input.rating),
    popularity: parsePuzzlePopularity(input.popularity),
    gameId: input.gameId ?? null,
    sourceId: input.sourceId ?? null,
    source: input.source ?? null,
    pgn: resolved.pgn,
    moves: resolved.moves,
    initialFen: resolved.initialFen,
    displayFen: resolved.displayFen,
    goals,
    isActive: input.isActive ?? true,
    themeSlugs: themes.length > 0 ? themes : undefined,
    studyId: input.studyId || null,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      code: (result.code as CreatePuzzleFromPlyErrorCode | undefined) ?? "create_failed",
    };
  }

  return { ok: true, puzzleId: result.puzzleId };
}
