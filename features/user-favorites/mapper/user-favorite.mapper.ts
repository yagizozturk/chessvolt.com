import {
  type DbGameAnalysisMistake,
  toGameAnalysisMistake,
} from "@/features/game-analysis-mistakes/mapper/game-analysis-mistake.mapper";
import {
  toOpeningVariant,
  type DbOpeningVariant,
} from "@/features/openings/mapper/opening-variant.mapper";
import { type DbPuzzle, toPuzzle } from "@/features/puzzle/mapper/puzzle.mapper";
import type {
  UserFavorite,
  UserFavoriteWithDetails,
} from "@/features/user-favorites/types/user-favorite";

export type DbUserFavorite = {
  id: string;
  user_id: string;
  opening_variant_id: string | null;
  puzzle_id: string | null;
  game_analysis_mistake_id: string | null;
  is_pinned: boolean;
  note: string | null;
  created_at: string;
};

type DbGameAnalysisEmbed = {
  data?: {
    criticalMoments?: { ply: number; fen: string }[];
  };
} | null;

export type DbGameAnalysisMistakeWithAnalysis = DbGameAnalysisMistake & {
  game_analyses?: DbGameAnalysisEmbed;
};

export type DbUserFavoriteWithDetails = DbUserFavorite & {
  opening_variants: DbOpeningVariant | null;
  puzzles: DbPuzzle | null;
  game_analysis_mistakes: DbGameAnalysisMistakeWithAnalysis | null;
};

function fenAtPly(analysis: DbGameAnalysisEmbed, ply: number): string | null {
  const fen = analysis?.data?.criticalMoments?.find((moment) => moment.ply === ply)?.fen?.trim();
  return fen || null;
}

export function toUserFavorite(db: DbUserFavorite): UserFavorite {
  return {
    id: db.id,
    userId: db.user_id,
    openingVariantId: db.opening_variant_id,
    puzzleId: db.puzzle_id,
    gameAnalysisMistakeId: db.game_analysis_mistake_id,
    isPinned: db.is_pinned,
    note: db.note,
    createdAt: db.created_at,
  };
}

export function toUserFavoriteWithDetails(
  db: DbUserFavoriteWithDetails,
): UserFavoriteWithDetails | null {
  const row = toUserFavorite(db);
  const openingVariant = db.opening_variants ? toOpeningVariant(db.opening_variants) : null;
  const puzzle = db.puzzles ? toPuzzle(db.puzzles) : null;
  const gameAnalysisMistake = db.game_analysis_mistakes ? toGameAnalysisMistake(db.game_analysis_mistakes) : null;
  const positionFen = gameAnalysisMistake
    ? fenAtPly(db.game_analysis_mistakes?.game_analyses ?? null, gameAnalysisMistake.ply)
    : null;

  if (!openingVariant && !puzzle && !gameAnalysisMistake) return null;

  return {
    ...row,
    openingVariant,
    puzzle,
    gameAnalysisMistake,
    positionFen,
  };
}

export function toUserFavoritesWithDetails(
  rows: DbUserFavoriteWithDetails[],
): UserFavoriteWithDetails[] {
  const items: UserFavoriteWithDetails[] = [];
  for (const row of rows) {
    const item = toUserFavoriteWithDetails(row);
    if (item) items.push(item);
  }
  return items;
}
