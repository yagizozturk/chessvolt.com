import type { Metadata } from "next";

import { PlatformGamesProvider } from "@/features/game-analysis/components/platform-games-provider";

export const metadata: Metadata = {
  title: "Chess Game Analysis for Chess.com & Lichess | ChessVolt",
  description:
    "Analyze your Chess.com and Lichess games to find mistakes and missed opportunities. Review critical positions and learn from your own play.",
};

export default function GameAnalysisLayout({ children }: { children: React.ReactNode }) {
  return <PlatformGamesProvider>{children}</PlatformGamesProvider>;
}
