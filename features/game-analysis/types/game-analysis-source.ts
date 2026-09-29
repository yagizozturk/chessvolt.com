export type GameAnalysisSource = "chesscom" | "lichess";

export function isGameAnalysisSource(value: unknown): value is GameAnalysisSource {
  return value === "chesscom" || value === "lichess";
}
