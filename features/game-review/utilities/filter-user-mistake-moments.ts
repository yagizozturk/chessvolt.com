import type { CriticalMoment } from "@/features/game-review/types/game-review";

export function getPgnPlayerColor(pgn: string, username: string): "w" | "b" | null {
  const focus = username.trim().toLowerCase();
  if (!focus) return null;

  const white = pgn.match(/\[White\s+"([^"]*)"\]/i)?.[1]?.trim().toLowerCase();
  const black = pgn.match(/\[Black\s+"([^"]*)"\]/i)?.[1]?.trim().toLowerCase();

  if (white === focus) return "w";
  if (black === focus) return "b";
  return null;
}

export function filterUserMistakeMoments(
  moments: CriticalMoment[],
  userColor: "w" | "b",
): CriticalMoment[] {
  return moments.filter(
    (moment) =>
      moment.turn === userColor && (moment.quality === "mistake" || moment.quality === "blunder"),
  );
}
