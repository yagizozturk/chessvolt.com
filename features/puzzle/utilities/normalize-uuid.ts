import { PUZZLE_ID_PATTERN } from "@/features/puzzle/constants/random-puzzle.constants";

export function normalizeUuid(id?: string): string | undefined {
  const trimmed = id?.trim();
  if (!trimmed || !PUZZLE_ID_PATTERN.test(trimmed)) return undefined;
  return trimmed;
}

export function normalizeUuidList(ids?: string[]): string[] {
  if (!ids?.length) return [];
  return [...new Set(ids.map((id) => normalizeUuid(id)).filter((id): id is string => Boolean(id)))];
}
