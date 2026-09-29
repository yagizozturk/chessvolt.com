"use client";

import { type ReactNode, createContext, useMemo, useState } from "react";

import type { ChesscomGamesContextValue } from "@/features/game-analysis/types/chesscom-games-context";
import type { ChesscomRealGame } from "@/features/game-analysis/types/chesscom-real-game";

export const ChesscomGamesContext = createContext<ChesscomGamesContextValue | null>(null);

// ====================================================================================================
// Keeps the loaded Chess.com games available to every page under /game-analysis.
// The list page stores games here. The detail page looks one up by uuid without fetching again.
// ChesscomGamesContextValue ile bu provider da kullanılacak değerin şeması belli ediliyor. Ve memo da
// tutuluyor. find metodu ile oyun bulabilme, set ile context içinde set edilebilmesi sağlanıyor.
// ====================================================================================================
export function ChesscomGamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<ChesscomRealGame[]>([]);

  const value = useMemo<ChesscomGamesContextValue>(
    () => ({
      games,
      setGames,
      findGame: (uuid) => games.find((game) => game.uuid === uuid),
    }),
    [games],
  );

  return <ChesscomGamesContext.Provider value={value}>{children}</ChesscomGamesContext.Provider>;
}
