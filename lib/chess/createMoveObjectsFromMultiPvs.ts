import { EngineInfo } from "@/lib/shared/types/engine-info";
import { Move } from "@/lib/shared/types/move";

import { parseUciParts } from "./createMoveFromUci";

export function createMoveObjectsFromMultiPvs(
  engineInfos: EngineInfo[],
): Move[] {
  const moves: Move[] = [];

  for (let multipv = 1; multipv <= 3; multipv++) {
    const pv = engineInfos.find((i) => i.multipv === multipv)?.pv?.[0];

    if (pv && pv.length >= 4) {
      moves.push({
        ...parseUciParts(pv),
        uci: pv,
        san: pv,
      });
    }
  }

  return moves;
}
