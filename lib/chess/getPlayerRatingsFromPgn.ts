export type PlayerRatings = { w: number | null; b: number | null };

export function getPlayerRatingsFromPgn(pgn: string): PlayerRatings {
  const rating = (tag: string) => {
    const value = Number(pgn.match(new RegExp(`\\[${tag}\\s+"(\\d+)"\\]`, "i"))?.[1]);
    return Number.isFinite(value) && value > 0 ? value : null;
  };

  return { w: rating("WhiteElo"), b: rating("BlackElo") };
}
