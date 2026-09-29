"use client";

import { useContext } from "react";

import { ChesscomGamesContext } from "@/features/game-analysis/components/chesscom-games-provider";

// ====================================================================================================
// Provides the ChesscomGamesContext value to the component by this hook.
// Bu hook provider da export edilen context i, [id] altındaki detay componentine e taşıyacak.
// ====================================================================================================
export function useChesscomGames() {
  const context = useContext(ChesscomGamesContext);
  if (!context) {
    throw new Error("useChesscomGames must be used within ChesscomGamesProvider");
  }
  return context;
}
