import type { Metadata } from "next";

import { PlatformGamesProvider } from "@/features/game-analysis/components/platform-games-provider";

export const metadata: Metadata = {
  title: "Game Analysis | ChessVolt",
  description: "Analyze your Chess.com and Lichess games and find your mistakes.",
};

export default function GameAnalysisLayout({ children }: { children: React.ReactNode }) {
  return <PlatformGamesProvider>{children}</PlatformGamesProvider>;
}
