import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { isMoveGoalsArray } from "@/features/move-sequence/validation/move-sequence-goals";
import { parseRiddlePopularity } from "@/features/riddle/utilities/parse-riddle-popularity";
import { parseRiddleRating } from "@/features/riddle/types/riddle-rating";

export type ParsedRiddleMetadata = {
  title: string;
  description: string | null;
  rating: number | null;
  popularity: number | null;
  themes: string[];
  collectionId: string | null;
  isActive: boolean;
  goals: MoveGoal[] | null;
  gameId: string | null;
  sourceId: string | null;
  source: string | null;
};

export type ParseRiddleMetadataResult =
  | { ok: true; data: ParsedRiddleMetadata }
  | { ok: false; error: string };

function parseThemesFromForm(formData: FormData): string[] {
  const raw = ((formData.get("themes") as string) || "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseGoalsFromFormData(formData: FormData): { goals: MoveGoal[] | null; error?: string } {
  const raw = formData.get("goals");
  if (raw === null) return { goals: null };
  const str = typeof raw === "string" ? raw.trim() : "";
  if (str === "") return { goals: null };

  try {
    const parsed = JSON.parse(str) as unknown;
    if (parsed === null) return { goals: null };
    if (!isMoveGoalsArray(parsed)) {
      return {
        goals: null,
        error: "Goals must be valid JSON with ply, move, title, description, and isCompleted for each item.",
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

  const descriptionRaw = ((formData.get("description") as string) || "").trim();
  const collectionIdRaw = ((formData.get("collectionId") as string) || "").trim();
  const gameIdRaw = ((formData.get("gameId") as string) || "").trim();
  const sourceIdRaw = ((formData.get("sourceId") as string) || "").trim();
  const sourceRaw = ((formData.get("source") as string) || "").trim();

  return {
    ok: true,
    data: {
      title,
      description: descriptionRaw || null,
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
