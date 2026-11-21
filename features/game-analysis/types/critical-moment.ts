import type { MoveQuality } from "@/lib/utils/getMoveFeedbackClass";

export type CriticalMomentQuality = Extract<MoveQuality, "inaccuracy" | "mistake" | "miss" | "blunder">;

export type CriticalMoment = {
  ply: number;
  fen: string;
  playedUci: string;
  playedSan: string;
  bestUci: string;
  bestSan: string;
  /** Second engine line close enough to the best move to also count as a correct answer. Absent on older analyses. */
  alternativeUci?: string;
  alternativeSan?: string;
  beforeCp: number;
  afterCp: number;
  deltaCp: number;
  quality: CriticalMomentQuality;
  mate: number | null;
  turn: "w" | "b";
};
