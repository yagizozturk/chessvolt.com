/**
 * Puzzle Service
 *
 * Responsibility: Puzzle business logic and orchestration.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import * as profileRepo from "@/features/profile/repository/profile.repository";
import * as puzzleThemeService from "@/features/puzzle-theme/services/puzzle-theme.service";
import {
  RANDOM_PUZZLE_CANDIDATE_COUNT,
  RECENT_SOLVED_PUZZLE_COUNT,
} from "@/features/puzzle/constants/random-puzzle.constants";
import * as puzzleRepo from "@/features/puzzle/repository/puzzle.repository";
import type { Puzzle } from "@/features/puzzle/types/puzzle";
import type { PuzzleRatingRange } from "@/features/puzzle/types/puzzle-rating";
import type { PuzzleWithThemes } from "@/features/puzzle/types/puzzle-with-themes";
import type { RandomActivePuzzleOptions } from "@/features/puzzle/types/random-active-puzzle";
import { getPuzzleRatingSearchRanges } from "@/features/puzzle/utilities/get-puzzle-rating-search-ranges";
import * as userSequenceAttemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";

export async function getPuzzleById(supabase: SupabaseClient, id: string): Promise<Puzzle | null> {
  return puzzleRepo.findById(supabase, id);
}

export async function getPuzzleIdByMoveSequenceId(
  supabase: SupabaseClient,
  moveSequenceId: string,
): Promise<string | null> {
  return puzzleRepo.findIdByMoveSequenceId(supabase, moveSequenceId);
}

type RandomPuzzleSearch = {
  userId: string | null;
  excludePuzzleId?: string;
  excludeSequenceIds: string[];
};

// ================================================================================================
// Aralıktan rastgele adaylar çekilir; giriş yapmış oyuncu için hiç çözmediği ilk aday seçilir.
// anyId: adayların hepsi daha önce çözülmüşse kullanılacak ilk aday.
// ================================================================================================
async function pickRandomPuzzle(
  supabase: SupabaseClient,
  search: RandomPuzzleSearch,
  ratingRange?: PuzzleRatingRange,
): Promise<{ unsolvedId: string | null; anyId: string | null }> {
  const candidates = await puzzleRepo.findRandomActiveCandidates(
    supabase,
    { excludePuzzleId: search.excludePuzzleId, excludeSequenceIds: search.excludeSequenceIds, ratingRange },
    search.userId ? RANDOM_PUZZLE_CANDIDATE_COUNT : 1,
  );
  const anyId = candidates[0]?.id ?? null;
  if (!anyId || !search.userId) return { unsolvedId: anyId, anyId };

  const attempts = await userSequenceAttemptService.getAttemptsByUserAndSequenceIds(
    supabase,
    search.userId,
    candidates.map((candidate) => candidate.moveSequenceId),
  );
  const solvedSequenceIds = new Set(
    attempts.filter((attempt) => attempt.status === "completed").map((attempt) => attempt.sequenceId),
  );
  const unsolved = candidates.find((candidate) => !solvedSequenceIds.has(candidate.moveSequenceId));

  return { unsolvedId: unsolved?.id ?? null, anyId };
}

// ================================================================================================
// Ekranda aktif gözüken ve son çözülen puzzle ları eleyerek oyuncuya random bir puzzle çekilir.
// Oyuncunun rating'i varsa önce ±100, sonra ±200 ve ±400 içinde aranır; her aralıkta hiç çözülmemiş
// puzzle öncelikli. Yakın aralıklarda hepsi çözülmüşse oradan (son çözülenler hariç) biri tekrar gelir.
// Rating yoksa (anonim / onboarding yok) rating'e bakılmaz. Hiç bulunmassa en çözülenlerden biri
// düşürülür ve tekrar onu çözer.
// RandomActivePuzzleOptions ile userId ve alınmayacak puzzleId ler tutulur.
// ================================================================================================
export async function getRandomActivePuzzleId(
  supabase: SupabaseClient,
  options?: RandomActivePuzzleOptions,
): Promise<string | null> {
  const userId = options?.userId ?? null;

  // ================================================================================================
  // Son çözülen puzzle ların sequenceIds alınır (RECENT_SOLVED_PUZZLE_COUNT) ve oyuncunun güncel rating'i.
  // ================================================================================================
  const [excludeSequenceIds, playerRating]: [string[], number | null] = userId
    ? await Promise.all([
        userSequenceAttemptService.getRecentCompletedSequenceIds(supabase, userId, RECENT_SOLVED_PUZZLE_COUNT),
        profileRepo.getProfileCurrentRating(supabase, userId),
      ])
    : [[], null];

  const search: RandomPuzzleSearch = {
    userId,
    excludePuzzleId: options?.activePuzzleIdtoExlude, // Mevcutta ekrandaki puzzle
    excludeSequenceIds,
  };

  let nearRatingSolvedId: string | null = null;
  for (const ratingRange of getPuzzleRatingSearchRanges(playerRating)) {
    const { unsolvedId, anyId } = await pickRandomPuzzle(supabase, search, ratingRange);
    if (unsolvedId) return unsolvedId;
    nearRatingSolvedId ??= anyId;
  }
  if (nearRatingSolvedId) return nearRatingSolvedId;

  const { unsolvedId, anyId } = await pickRandomPuzzle(supabase, search);
  const anyRatingId = unsolvedId ?? anyId;
  if (anyRatingId) return anyRatingId;

  const sequenceIdsToSkip = [...excludeSequenceIds];
  while (sequenceIdsToSkip.length > 0) {
    sequenceIdsToSkip.pop();
    const [candidate] = await puzzleRepo.findRandomActiveCandidates(supabase, {
      excludePuzzleId: search.excludePuzzleId,
      excludeSequenceIds: sequenceIdsToSkip,
    });
    if (candidate) return candidate.id;
  }
  return null;
}

export async function getPuzzleByIdWithThemes(supabase: SupabaseClient, id: string): Promise<PuzzleWithThemes | null> {
  const puzzle = await puzzleRepo.findById(supabase, id);
  if (!puzzle) return null;

  const slugsByPuzzleId = await puzzleThemeService.getThemeSlugsByPuzzleIds(supabase, [id]);
  return puzzleThemeService.withThemeSlugs(puzzle, slugsByPuzzleId.get(id) ?? []);
}

export async function createPuzzle(
  supabase: SupabaseClient,
  input: puzzleRepo.CreatePuzzleInput,
): Promise<Puzzle | null> {
  return puzzleRepo.create(supabase, input);
}

export async function updatePuzzle(
  supabase: SupabaseClient,
  id: string,
  input: puzzleRepo.UpdatePuzzleInput,
): Promise<Puzzle | null> {
  return puzzleRepo.update(supabase, id, input);
}

export async function deletePuzzle(supabase: SupabaseClient, id: string): Promise<boolean> {
  return puzzleRepo.remove(supabase, id);
}
