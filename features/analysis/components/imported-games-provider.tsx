"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type { ApiError } from "@/api-client/client";
import { requestImportedGames } from "@/features/analysis/api/imported-games";
import type { ImportedGame, ImportedGamePlatform } from "@/features/analysis/types/imported-game";
import { useProfile } from "@/features/profile/hooks/use-profile";

type PlatformStatus = "idle" | "loading" | "success" | "error";

type ImportedGamesContextValue = {
  chesscomUsername: string;
  lichessUsername: string;
  setChesscomUsername: (value: string) => void;
  setLichessUsername: (value: string) => void;
  chesscomGames: ImportedGame[];
  lichessGames: ImportedGame[];
  games: ImportedGame[];
  chesscomError: string | null;
  lichessError: string | null;
  chesscomStatus: PlatformStatus;
  lichessStatus: PlatformStatus;
  isLoading: boolean;
  load: () => Promise<void>;
  findGame: (platform: ImportedGamePlatform, id: string) => ImportedGame | undefined;
};

const ImportedGamesContext = createContext<ImportedGamesContextValue | null>(null);

function errorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "error" in err) {
    return String((err as ApiError).error);
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

async function fetchPlatform(
  platform: ImportedGamePlatform,
  username: string,
): Promise<{ games: ImportedGame[]; error: string | null }> {
  const trimmed = username.trim();
  if (!trimmed) {
    return { games: [], error: null };
  }

  try {
    const response = await requestImportedGames(platform, trimmed);
    if (!response.success || !response.data) {
      return { games: [], error: response.error || "Failed to load games" };
    }
    return { games: response.data, error: null };
  } catch (err) {
    return { games: [], error: errorMessage(err, "Failed to load games") };
  }
}

export function ImportedGamesProvider({ children }: { children: ReactNode }) {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const didInit = useRef(false);

  const [chesscomOverride, setChesscomOverride] = useState<string | null>(null);
  const [lichessOverride, setLichessOverride] = useState<string | null>(null);
  const [chesscomGames, setChesscomGames] = useState<ImportedGame[]>([]);
  const [lichessGames, setLichessGames] = useState<ImportedGame[]>([]);
  const [chesscomError, setChesscomError] = useState<string | null>(null);
  const [lichessError, setLichessError] = useState<string | null>(null);
  const [chesscomStatus, setChesscomStatus] = useState<PlatformStatus>("idle");
  const [lichessStatus, setLichessStatus] = useState<PlatformStatus>("idle");

  const chesscomUsername = chesscomOverride ?? profile?.chesscomUsername ?? "";
  const lichessUsername = lichessOverride ?? profile?.lichessUsername ?? "";

  const loadWith = useCallback(async (chesscom: string, lichess: string) => {
    const chess = chesscom.trim();
    const lich = lichess.trim();

    if (chess) setChesscomStatus("loading");
    else {
      setChesscomGames([]);
      setChesscomError(null);
      setChesscomStatus("idle");
    }

    if (lich) setLichessStatus("loading");
    else {
      setLichessGames([]);
      setLichessError(null);
      setLichessStatus("idle");
    }

    const [chessResult, lichResult] = await Promise.all([
      chess ? fetchPlatform("chesscom", chess) : Promise.resolve({ games: [] as ImportedGame[], error: null }),
      lich ? fetchPlatform("lichess", lich) : Promise.resolve({ games: [] as ImportedGame[], error: null }),
    ]);

    if (chess) {
      setChesscomGames(chessResult.games);
      setChesscomError(chessResult.error);
      setChesscomStatus(chessResult.error ? "error" : "success");
    }
    if (lich) {
      setLichessGames(lichResult.games);
      setLichessError(lichResult.error);
      setLichessStatus(lichResult.error ? "error" : "success");
    }
  }, []);

  const load = useCallback(async () => {
    await loadWith(chesscomUsername, lichessUsername);
  }, [chesscomUsername, lichessUsername, loadWith]);

  useEffect(() => {
    if (isProfileLoading || didInit.current) return;
    const chess = profile?.chesscomUsername ?? "";
    const lich = profile?.lichessUsername ?? "";
    if (!chess && !lich) return;

    const timeoutId = window.setTimeout(() => {
      if (didInit.current) return;
      didInit.current = true;
      void loadWith(chess, lich);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [isProfileLoading, profile, loadWith]);

  const games = useMemo(() => [...chesscomGames, ...lichessGames], [chesscomGames, lichessGames]);

  const findGame = useCallback(
    (platform: ImportedGamePlatform, id: string) =>
      games.find((game) => game.platform === platform && game.id === id),
    [games],
  );

  const value = useMemo<ImportedGamesContextValue>(
    () => ({
      chesscomUsername,
      lichessUsername,
      setChesscomUsername: setChesscomOverride,
      setLichessUsername: setLichessOverride,
      chesscomGames,
      lichessGames,
      games,
      chesscomError,
      lichessError,
      chesscomStatus,
      lichessStatus,
      isLoading: chesscomStatus === "loading" || lichessStatus === "loading",
      load,
      findGame,
    }),
    [
      chesscomUsername,
      lichessUsername,
      chesscomGames,
      lichessGames,
      games,
      chesscomError,
      lichessError,
      chesscomStatus,
      lichessStatus,
      load,
      findGame,
    ],
  );

  return <ImportedGamesContext.Provider value={value}>{children}</ImportedGamesContext.Provider>;
}

export function useImportedGames() {
  const context = useContext(ImportedGamesContext);
  if (!context) {
    throw new Error("useImportedGames must be used within ImportedGamesProvider");
  }
  return context;
}
