import { EngineInfo } from "@/lib/model/engine-info";
import { Move } from "@/lib/model/move";

export function createMoveObjectsFromMultiPvs(engineInfos: EngineInfo[]): Move[] {
  const moves: Move[] = [];

  // Process MultiPV 1, 2, 3
  for (let multipv = 1; multipv <= 3; multipv++) {
    const pv = engineInfos.find((i) => i.multipv === multipv)?.pv?.[0];

    if (pv && pv.length >= 4) {
      const from = pv.slice(0, 2);
      const to = pv.slice(2, 4);
      const promotion = pv.length > 4 ? pv.slice(4) : undefined;

      moves.push({
        from,
        to,
        promotion,
        uci: pv,
        san: pv,
      });
    }
  }

  return moves;
}
