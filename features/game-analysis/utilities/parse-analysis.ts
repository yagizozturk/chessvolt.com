import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";
import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import { getSanFromUci } from "@/lib/chess/getSanFromUci";

// Optional; when present it must be a legal move other than the best and the played one, with matching SAN.
function hasValidAlternative(moment: CriticalMoment): boolean {
  if (moment.alternativeUci === undefined && moment.alternativeSan === undefined) return true;
  if (typeof moment.alternativeUci !== "string" || typeof moment.alternativeSan !== "string") return false;
  if (moment.alternativeUci === moment.bestUci || moment.alternativeUci === moment.playedUci) return false;
  return getSanFromUci(moment.fen, moment.alternativeUci) === moment.alternativeSan;
}

function isCriticalMoment(value: unknown): value is CriticalMoment {
  if (!value || typeof value !== "object") return false;

  const moment = value as CriticalMoment;
  return (
    Number.isInteger(moment.ply) &&
    typeof moment.fen === "string" &&
    typeof moment.playedUci === "string" &&
    typeof moment.playedSan === "string" &&
    typeof moment.bestUci === "string" &&
    typeof moment.bestSan === "string" &&
    typeof moment.beforeCp === "number" &&
    typeof moment.afterCp === "number" &&
    typeof moment.deltaCp === "number" &&
    (moment.quality === "mistake" || moment.quality === "miss" || moment.quality === "blunder") &&
    (moment.mate === null || typeof moment.mate === "number") &&
    (moment.turn === "w" || moment.turn === "b") &&
    hasValidAlternative(moment)
  );
}

export function parseAnalysis(value: unknown, moveCount: number): GameAnalysisResponseData | null {
  if (!value || typeof value !== "object") return null;

  const analysis = value as GameAnalysisResponseData;
  if (analysis.moveCount !== moveCount) return null;
  if (typeof analysis.depth !== "number" || analysis.depth < 1 || analysis.depth > 30) return null;
  if (!Array.isArray(analysis.criticalMoments) || analysis.criticalMoments.length > moveCount) return null;
  if (!analysis.criticalMoments.every(isCriticalMoment)) return null;

  return {
    moveCount,
    depth: analysis.depth,
    criticalMoments: analysis.criticalMoments,
  };
}
