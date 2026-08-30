import type { EngineInfo } from "@/lib/shared/types/engine-info";

/**
 * Converts a UCI root score into a single comparable number (side to move).
 * Mate scores use a rough ±32000 band so they always outrank normal centipawn evals.
 */
export function evalCpEquivalent(info: EngineInfo | null): number {
  if (!info) return 0;
  if (info.mateIn !== undefined) {
    const m = info.mateIn;
    if (m > 0) return 32_000 - m;
    if (m < 0) return -32_000 - m;
    return 0;
  }
  return info.scoreCp ?? 0;
}
