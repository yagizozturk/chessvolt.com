"use client";

import { useContext } from "react";

import { PlatformGamesContext } from "@/features/game-analysis/components/platform-games-provider";

export function usePlatformGames() {
  const context = useContext(PlatformGamesContext);
  if (!context) {
    throw new Error("usePlatformGames must be used within PlatformGamesProvider");
  }
  return context;
}
