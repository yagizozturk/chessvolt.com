import { ChesscomGamesProvider } from "@/features/game-analysis/components/chesscom-games-provider";

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <ChesscomGamesProvider>{children}</ChesscomGamesProvider>;
}
