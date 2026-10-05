import { PlatformGamesProvider } from "@/features/game-analysis/components/platform-games-provider";

export default function GameAnalysisLayout({ children }: { children: React.ReactNode }) {
  return <PlatformGamesProvider>{children}</PlatformGamesProvider>;
}
