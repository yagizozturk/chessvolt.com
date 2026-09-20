import type { ChessComGame } from "@/lib/chess-com/types";
import type { LichessGame, LichessGamePlayer } from "@/lib/lichess/types";

import type { ImportedGame, ImportedGamePlayer } from "@/features/analysis/types/imported-game";

function chessComPlayer(player: ChessComGame["white"]): ImportedGamePlayer {
  return {
    username: player.username,
    rating: player.rating,
    result: player.result.replaceAll("_", " "),
  };
}

export function toImportedGameFromChessCom(game: ChessComGame): ImportedGame | null {
  const pgn = game.pgn?.trim() ?? "";
  if (!pgn) return null;

  return {
    id: game.uuid ?? game.url,
    platform: "chesscom",
    url: game.url,
    endTime: game.end_time,
    timeClass: game.time_class,
    rated: game.rated,
    white: chessComPlayer(game.white),
    black: chessComPlayer(game.black),
    pgn,
  };
}

function lichessPlayerName(player: LichessGamePlayer | undefined): string {
  if (player?.user?.name) return player.user.name;
  if (player?.aiLevel != null) return `AI ${player.aiLevel}`;
  return "Anonymous";
}

function lichessResult(game: LichessGame, color: "white" | "black"): string {
  if (game.winner === color) return "win";
  if (game.winner && game.winner !== color) return "loss";
  if (game.status === "draw" || game.status === "stalemate") return "draw";
  return (game.status ?? "unknown").replaceAll("_", " ");
}

function lichessPlayer(game: LichessGame, color: "white" | "black"): ImportedGamePlayer {
  const player = game.players?.[color];
  return {
    username: lichessPlayerName(player),
    rating: player?.rating ?? null,
    result: lichessResult(game, color),
  };
}

export function toImportedGameFromLichess(game: LichessGame): ImportedGame | null {
  const pgn = game.pgn?.trim() ?? "";
  if (!pgn || !game.id) return null;

  const endMs = game.lastMoveAt ?? game.createdAt ?? 0;

  return {
    id: game.id,
    platform: "lichess",
    url: `https://lichess.org/${game.id}`,
    endTime: Math.floor(endMs / 1000),
    timeClass: game.speed ?? game.perf ?? "unknown",
    rated: game.rated,
    white: lichessPlayer(game, "white"),
    black: lichessPlayer(game, "black"),
    pgn,
  };
}
