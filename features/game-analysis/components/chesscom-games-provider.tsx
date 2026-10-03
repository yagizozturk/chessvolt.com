"use client";

import { type ReactNode, createContext, useMemo, useState } from "react";

import type { ChessComGame } from "@/features/game-analysis/types/chesscom-game";
import type { ChessComGamesContextValue } from "@/features/game-analysis/types/chesscom-games-context";

export const ChesscomGamesContext = createContext<ChessComGamesContextValue | null>(null);

// ====================================================================================================
// Keeps the loaded Chess.com games available to every page under /game-analysis.
// The list page stores games here. The detail page looks one up by uuid without fetching again.
// ChessComGamesContextValue ile bu provider da kullanılacak değerin şeması belli ediliyor. Ve memo da
// tutuluyor. find metodu ile oyun bulabilme, set ile context içinde set edilebilmesi sağlanıyor.
// ====================================================================================================
export function ChesscomGamesProvider({ children }: { children: ReactNode }) {
  const [chessComGames, setChessComGames] = useState<ChessComGame[]>([]);
  const [chessComUsername, setChessComUsername] = useState("");

  const value = useMemo<ChessComGamesContextValue>(
    () => ({
      chessComGames,
      setChessComGames,
      chessComUsername,
      setChessComUsername,
      findGame: (uuid) => chessComGames.find((game) => game.uuid === uuid),
    }),
    [chessComGames, chessComUsername],
  );

  return <ChesscomGamesContext.Provider value={value}>{children}</ChesscomGamesContext.Provider>;
}
