import type { ChessComGameAccuracies } from "@/features/game-analysis/types/chesscom-game-accuracies";
import type { GameAnalysisSource } from "@/features/game-analysis/types/game-analysis-source";
import type { GamePlayer } from "@/features/game-analysis/types/game-player";

export type PlatformGame = {
  source: GameAnalysisSource;
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  white: GamePlayer;
  black: GamePlayer;
  accuracies?: ChessComGameAccuracies;
  tournament?: string;
  match?: string;
  uuid: string;
};
