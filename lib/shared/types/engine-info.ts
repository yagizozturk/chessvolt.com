export type EngineInfo = {
    depth?: number;
    scoreCp?: number; // centipawn
    scorePawns?: number; // piyon cinsinden
    mateIn?: number;
    pv?: string[];
    bestmove?: string;
    multipv?: number;
  };