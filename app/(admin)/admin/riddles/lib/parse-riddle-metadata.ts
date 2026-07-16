import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import { isMoveGoals } from "@/features/move-sequence/validation/move-sequence-goals";
import { parseRiddleRating } from "@/features/riddle/types/riddle-rating";
import { parseRiddlePopularity } from "@/features/riddle/utilities/parse-riddle-popularity";

export type ParsedRiddleMetadata = {
  title: string;
  rating: number | null;
  popularity: number | null;
  themes: string[];
  collectionId: string | null;
  isActive: boolean;
  goals: MoveGoals | null;
  gameId: string | null;
  sourceId: string | null;
  source: string | null;
};

export type ParseRiddleMetadataResult = { ok: true; data: ParsedRiddleMetadata } | { ok: false; error: string };

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

export function parseRiddleMetadataFromForm(formData: FormData): ParseRiddleMetadataResult {
  const title = ((formData.get("title") as string) || "").trim();
  if (!title) {
    return { ok: false, error: "Title is required." };
  }

  const goalsResult = parseGoalsFromFormData(formData);
  if (goalsResult.error) {
    return { ok: false, error: goalsResult.error };
  }

  const collectionIdRaw = ((formData.get("collectionId") as string) || "").trim();
  const gameIdRaw = ((formData.get("gameId") as string) || "").trim();
  const sourceIdRaw = ((formData.get("sourceId") as string) || "").trim();
  const sourceRaw = ((formData.get("source") as string) || "").trim();

  return {
    ok: true,
    data: {
      title,
      rating: parseRiddleRating(formData.get("rating")),
      popularity: parseRiddlePopularity(formData.get("popularity")),
      themes: parseThemesFromForm(formData),
      collectionId: collectionIdRaw || null,
      isActive: formData.get("isActive") === "on",
      goals: goalsResult.goals,
      gameId: gameIdRaw || null,
      sourceId: sourceIdRaw || null,
      source: sourceRaw || null,
    },
  };
}
