export const LICHESS_IMPORT_SOURCE = "lichess";

export type LichessImportConfig = {
  minPopularity: number;
  maxRatingDeviation: number;
};

export const DEFAULT_LICHESS_IMPORT_CONFIG: LichessImportConfig = {
  minPopularity: 70,
  maxRatingDeviation: 100,
};
