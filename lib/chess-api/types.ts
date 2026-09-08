export type ChessApiAnalyzeRequest = {
  fen: string;
  variants?: number;
  depth?: number;
  maxThinkingTime?: number;
  searchmoves?: string;
  taskId?: string;
};

/** Raw response fields from chess-api.com (subset we use). */
export type ChessApiRawResponse = {
  type?: string;
  text?: string;
  error?: string;
  eval?: number;
  move?: string;
  fen?: string;
  depth?: number;
  winChance?: number;
  continuationArr?: string[];
  /** API may return mate as number or string (e.g. "1"). */
  mate?: number | string | null;
  centipawns?: string | number | null;
  san?: string;
  lan?: string;
  turn?: "w" | "b";
  color?: "w" | "b";
  piece?: string;
  from?: string;
  to?: string;
  promotion?: string;
  taskId?: string;
  time?: number;
};

/** Normalized position analysis used by game review. */
export type PositionAnalysis = {
  fen: string;
  depth: number;
  /** White-perspective centipawns (mate converted to synthetic cp). */
  whiteCp: number;
  mate: number | null;
  bestUci: string | null;
  bestSan: string | null;
  rawEval: number | null;
};
