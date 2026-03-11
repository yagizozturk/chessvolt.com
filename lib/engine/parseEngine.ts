import { EngineInfo } from "@/lib/shared/types/engine-info";

//==============================================================================
// Each move info from Stockfish engine is validated and added to infos.
//==============================================================================
export function parseEngine(line: string): EngineInfo | null {
  const trimmed = line.trim();

  // bestmove
  if (trimmed.startsWith("bestmove")) {
    const parts = trimmed.split(" ");
    const bestmove = parts[1];
    return { bestmove };
  }

  // info
  if (!trimmed.startsWith("info")) return null;

  const engineInfo: EngineInfo = {};

  // depth
  const depthMatch = trimmed.match(/ depth (\d+)/);
  if (depthMatch) {
    engineInfo.depth = parseInt(depthMatch[1], 10);
  }

  // multipv
  const multiMatch = trimmed.match(/ multipv (\d+)/);
  if (multiMatch) {
    engineInfo.multipv = parseInt(multiMatch[1], 10);
  }

  // score
  const scoreMatch = trimmed.match(/ score (cp|mate) (-?\d+)/);
  if (scoreMatch) {
    const type = scoreMatch[1]; // "cp" | "mate"
    const value = parseInt(scoreMatch[2], 10);

    if (type === "cp") {
      engineInfo.scoreCp = value;
      engineInfo.scorePawns = value / 100;
    } else if (type === "mate") {
      engineInfo.mateIn = value;
    }
  }

  // pv (principal variation)
  const pvMatch = trimmed.match(/ pv (.+)$/);
  if (pvMatch) {
    engineInfo.pv = pvMatch[1].trim().split(" ");
  }

  return engineInfo;
}
