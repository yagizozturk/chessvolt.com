import type { GameAnalysis, GameAnalysisData, GameAnalysisSource } from "@/features/game-analysis/types/game-analysis";

export type DbGameAnalysis = {
  id: string;
  user_id: string;
  game_id: string;
  source: string;
  data: GameAnalysisData;
  created_at: string;
  updated_at: string;
};

export function toGameAnalysis(db: DbGameAnalysis): GameAnalysis {
  return {
    id: db.id,
    userId: db.user_id,
    gameId: db.game_id,
    source: db.source as GameAnalysisSource,
    data: db.data,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}
