/**
 * Converts space-separated SAN moves to minimal PGN format.
 * e.g. "e4 e5 Nf3" -> "1. e4 e5 2. Nf3"
 */
export function movesToPgn(moves: string): string {
  const tokens = moves.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "";

  const pgnParts: string[] = [];
  let moveNum = 1;
  for (let i = 0; i < tokens.length; i++) {
    if (i % 2 === 0) {
      pgnParts.push(`${moveNum}. ${tokens[i]}`);
    } else {
      pgnParts[pgnParts.length - 1] += ` ${tokens[i]}`;
      moveNum++;
    }
  }
  return pgnParts.join(" ");
}
