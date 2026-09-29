import { ChesscomGamesProvider } from "@/features/game-analysis/components/chesscom-games-provider";

export default function GameAnalysisLayout({ children }: { children: React.ReactNode }) {
  return <ChesscomGamesProvider>{children}</ChesscomGamesProvider>;
}
