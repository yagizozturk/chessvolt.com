import type { EngineInfo } from "@/lib/shared/types/engine-info";

/** Summary of one MultiPV line at the deepest depth seen in a search. */
export type MultipvSummaryRow = {
  /** Stockfish multipv rank (1 = best line). */
  rank: number;
  depth: number;
  /** Score for the side to move: pawns or mate. */
  scoreLabel: string;
  /** First move of the PV (UCI). */
  firstUci: string | null;
  /** First few UCI moves (preview). */
  pvPreview: string;
};

/** Deepest `info` record for a given MultiPV line. */
export function getDeepestInfoForMultipv(
  infos: EngineInfo[],
  multipv: number,
): EngineInfo | null {
  const list = infos.filter((i) => i.multipv === multipv);
  if (list.length === 0) return null;
  return list.reduce((acc, cur) => {
    const da = acc.depth ?? 0;
    const dc = cur.depth ?? 0;
    return dc >= da ? cur : acc;
  });
}

export function summarizeMultipvLines(infos: EngineInfo[]): MultipvSummaryRow[] {
  const byMp = new Map<number, EngineInfo[]>();
  for (const info of infos) {
    if (info.multipv === undefined) continue;
    const list = byMp.get(info.multipv) ?? [];
    list.push(info);
    byMp.set(info.multipv, list);
  }

  const sortedKeys = [...byMp.keys()].sort((a, b) => a - b);
  const rows: MultipvSummaryRow[] = [];

  for (const mp of sortedKeys) {
    const list = byMp.get(mp)!;
    const best = list.reduce((acc, cur) => {
      const da = acc.depth ?? 0;
      const dc = cur.depth ?? 0;
      if (dc > da) return cur;
      if (dc < da) return acc;
      return cur;
    });

    rows.push({
      rank: mp,
      depth: best.depth ?? 0,
      scoreLabel: formatScoreLine(best),
      firstUci: best.pv?.[0] ?? null,
      pvPreview: formatPvPreview(best.pv, 8),
    });
  }

  return rows;
}

function formatScoreLine(info: EngineInfo): string {
  if (info.mateIn !== undefined) {
    const m = info.mateIn;
    if (m > 0) return `Mate #${m}`;
    if (m < 0) return `Mate #${m}`;
    return "Mate 0";
  }
  if (info.scoreCp !== undefined) {
    const pawns = info.scoreCp / 100;
    const sign = pawns > 0 ? "+" : "";
    return `${sign}${pawns.toFixed(2)}`;
  }
  return "—";
}

function formatPvPreview(pv: string[] | undefined, maxPlies: number): string {
  if (!pv?.length) return "—";
  return pv.slice(0, maxPlies).join(" ");
}
