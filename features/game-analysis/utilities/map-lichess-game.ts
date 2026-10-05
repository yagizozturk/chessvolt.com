import type { PlatformGame } from "@/features/game-analysis/types/platform-game";
import type { LichessGame, LichessGamePlayer } from "@/lib/lichess/types";

function playerUsername(player: LichessGamePlayer | undefined, fallback: string): string {
  if (player?.user?.name) return player.user.name;
  if (player?.user?.id) return player.user.id;
  if (player?.aiLevel != null) return `AI level ${player.aiLevel}`;
  return fallback;
}

function playerResult(color: "white" | "black", game: LichessGame): string {
  if (game.winner === color) return "win";
  if (!game.winner) {
    if (game.status === "draw" || game.status === "stalemate") return "draw";
    return game.status ?? "";
  }
  if (game.status === "resign") return "resigned";
  if (game.status === "mate") return "checkmated";
  if (game.status === "timeout" || game.status === "outoftime") return "timeout";
  return game.status ?? "";
}

export function mapLichessGame(game: LichessGame): PlatformGame | null {
  if (!game.pgn || (game.variant && game.variant !== "standard")) return null;

  const playedAtMs = game.lastMoveAt ?? game.createdAt ?? 0;

  return {
    url: `https://lichess.org/${game.id}`,
    pgn: game.pgn,
    time_control: "",
    end_time: Math.floor(playedAtMs / 1000),
    rated: game.rated,
    fen: "",
    time_class: game.speed ?? game.perf ?? "",
    rules: "chess",
    white: {
      username: playerUsername(game.players?.white, "White"),
      rating: game.players?.white?.rating ?? null,
      result: playerResult("white", game),
    },
    black: {
      username: playerUsername(game.players?.black, "Black"),
      rating: game.players?.black?.rating ?? null,
      result: playerResult("black", game),
    },
    uuid: game.id,
    source: "lichess",
  };
}
