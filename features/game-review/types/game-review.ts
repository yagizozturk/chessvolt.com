import type { MoveQuality } from "@/lib/utils/getMoveFeedbackClass";

export type CriticalMomentQuality = Extract<MoveQuality, "inaccuracy" | "mistake" | "blunder">;

export type CriticalMoment = {
  ply: number;
  fen: string;
  playedUci: string;
  playedSan: string;
  bestUci: string;
  bestSan: string;
  beforeCp: number;
  afterCp: number;
  deltaCp: number;
  quality: CriticalMomentQuality;
  mate: number | null;
  turn: "w" | "b";
};

export type GameReviewResult = {
  moveCount: number;
  depth: number;
  criticalMoments: CriticalMoment[];
};

export type ReviewGameOptions = {
  depth?: number;
  includeInaccuracies?: boolean;
  concurrency?: number;
};
