"use client";

import { type ReactNode, createContext, useMemo, useState } from "react";

import type { PlatformGame } from "@/features/game-analysis/types/platform-game";
import type { PlatformGamesContextValue } from "@/features/game-analysis/types/platform-games-context";

export const PlatformGamesContext = createContext<PlatformGamesContextValue | null>(null);

export function PlatformGamesProvider({ children }: { children: ReactNode }) {
  const [chessComGames, setChessComGames] = useState<PlatformGame[]>([]);
  const [chessComUsername, setChessComUsername] = useState("");
  const [lichessGames, setLichessGames] = useState<PlatformGame[]>([]);
  const [lichessUsername, setLichessUsername] = useState("");

  const value = useMemo<PlatformGamesContextValue>(
    () => ({
      chessComGames,
      setChessComGames,
      chessComUsername,
      setChessComUsername,
      lichessGames,
      setLichessGames,
      lichessUsername,
      setLichessUsername,
      findGame: (uuid) =>
        chessComGames.find((game) => game.uuid === uuid) ?? lichessGames.find((game) => game.uuid === uuid),
    }),
    [chessComGames, chessComUsername, lichessGames, lichessUsername],
  );

  return <PlatformGamesContext.Provider value={value}>{children}</PlatformGamesContext.Provider>;
}
