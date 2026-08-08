import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import { isMoveGoals } from "@/features/move-sequence/validation/move-sequence-goals";
import { parsePuzzleRating } from "@/features/puzzle/types/puzzle-rating";
import { parsePuzzlePopularity } from "@/features/puzzle/utilities/parse-puzzle-popularity";

export type ParsedPuzzleMetadata = {
  title: string;
  rating: number | null;
  popularity: number | null;
  themes: string[];
  studyId: string | null;
  isActive: boolean;
  goals: MoveGoals | null;
  gameId: string | null;
  sourceId: string | null;
  source: string | null;
};

export type ParsePuzzleMetadataResult = { ok: true; data: ParsedPuzzleMetadata } | { ok: false; error: string };

function parseThemesFromForm(formData: FormData): string[] {
  const raw = ((formData.get("themes") as string) || "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseGoalsFromFormData(formData: FormData): { goals: MoveGoals | null; error?: string } {
  const raw = formData.get("goals");
  if (raw === null) return { goals: null };
  const str = typeof raw === "string" ? raw.trim() : "";
  if (str === "") return { goals: null };

  try {
    const parsed = JSON.parse(str) as unknown;
    if (parsed === null) return { goals: null };
    if (!isMoveGoals(parsed)) {
      return {
        goals: null,
        error:
          "Goals must include mainIdea, lessonsLearned, and valid plys with move details.",
      };
    }
    return { goals: parsed };
  } catch {
    return { goals: null, error: "Goals must be valid JSON." };
  }
}

export function parsePuzzleMetadataFromForm(formData: FormData): ParsePuzzleMetadataResult {
  const title = ((formData.get("title") as string) || "").trim();
  if (!title) {
    return { ok: false, error: "Title is required." };
  }

  const goalsResult = parseGoalsFromFormData(formData);
  if (goalsResult.error) {
    return { ok: false, error: goalsResult.error };
  }

  const studyIdRaw = ((formData.get("studyId") as string) || "").trim();
  const gameIdRaw = ((formData.get("gameId") as string) || "").trim();
  const sourceIdRaw = ((formData.get("sourceId") as string) || "").trim();
  const sourceRaw = ((formData.get("source") as string) || "").trim();

  return {
    ok: true,
    data: {
      title,
      rating: parsePuzzleRating(formData.get("rating")),
      popularity: parsePuzzlePopularity(formData.get("popularity")),
      themes: parseThemesFromForm(formData),
      studyId: studyIdRaw || null,
      isActive: formData.get("isActive") === "on",
      goals: goalsResult.goals,
      gameId: gameIdRaw || null,
      sourceId: sourceIdRaw || null,
      source: sourceRaw || null,
    },
  };
}
