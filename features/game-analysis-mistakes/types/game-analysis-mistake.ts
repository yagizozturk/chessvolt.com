export type GameAnalysisMistakeQuality = "mistake" | "blunder";

export type GameAnalysisMistake = {
  id: string;
  userId: string;
  gameAnalysisId: string | null;
  moveSequenceId: string | null;
  gameId: string;
  source: string;
  title: string;
  ply: number;
  quality: GameAnalysisMistakeQuality;
  createdAt: string;
  updatedAt: string;
};

export type GameAnalysisMistakePayload = {
  userId: string;
  gameAnalysisId?: string | null;
  moveSequenceId: string;
  gameId: string;
  source: string;
  title: string;
  ply: number;
  quality: GameAnalysisMistakeQuality;
};
