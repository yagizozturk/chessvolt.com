"use server";

import {
  getGamesByMonth,
  getGamesPgnByMonth,
  getLatestMonthGames,
  getPlayerMonthlyArchives,
  type ChessGame,
} from "@/lib/chess-com/chess-service";
import { getAdminUser } from "@/lib/supabase/auth";

export type ChessComTestAction = "archives" | "latest-games" | "games-by-month" | "pgn";

export type ChessComTestFormState = {
  error: string | null;
  action: ChessComTestAction | null;
  result: unknown;
};

const initialResult = null;

function parseUsername(formData: FormData): string {
  return ((formData.get("username") as string) || "").trim();
}

function summarizeGames(games: ChessGame[]) {
  return games.map((game) => ({
    url: game.url,
    time_class: game.time_class,
    time_control: game.time_control,
    rated: game.rated,
    end_time: game.end_time,
    white: { username: game.white.username, rating: game.white.rating, result: game.white.result },
    black: { username: game.black.username, rating: game.black.rating, result: game.black.result },
    accuracies: game.accuracies,
    pgnPreview: game.pgn.slice(0, 120) + (game.pgn.length > 120 ? "…" : ""),
  }));
}

export async function chessComTestAction(
  _prevState: ChessComTestFormState,
  formData: FormData,
): Promise<ChessComTestFormState> {
  await getAdminUser();

  const action = formData.get("action") as ChessComTestAction;
  const username = parseUsername(formData);

  if (!username) {
    return { error: "Username is required.", action: null, result: initialResult };
  }

  try {
    switch (action) {
      case "archives": {
        const archives = await getPlayerMonthlyArchives(username);
        return { error: null, action, result: { count: archives.length, archives } };
      }
      case "latest-games": {
        const { archiveUrl, games } = await getLatestMonthGames(username);
        return {
          error: null,
          action,
          result: {
            archiveUrl,
            count: games.length,
            games: summarizeGames(games),
          },
        };
      }
      case "games-by-month": {
        const archiveUrl = ((formData.get("archiveUrl") as string) || "").trim();
        if (!archiveUrl) {
          return { error: "Archive URL is required.", action: null, result: initialResult };
        }
        const games = await getGamesByMonth(archiveUrl);
        return {
          error: null,
          action,
          result: { archiveUrl, count: games.length, games: summarizeGames(games) },
        };
      }
      case "pgn": {
        const year = ((formData.get("year") as string) || "").trim();
        const month = ((formData.get("month") as string) || "").trim();
        if (!year || !month) {
          return { error: "Year and month are required.", action: null, result: initialResult };
        }
        const pgn = await getGamesPgnByMonth(username, year, month);
        return {
          error: null,
          action,
          result: {
            year,
            month,
            length: pgn.length,
            pgnPreview: pgn.slice(0, 2000) + (pgn.length > 2000 ? "\n…(truncated)" : ""),
          },
        };
      }
      default:
        return { error: "Unknown action.", action: null, result: initialResult };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chess.com API request failed";
    return { error: message, action: null, result: initialResult };
  }
}
