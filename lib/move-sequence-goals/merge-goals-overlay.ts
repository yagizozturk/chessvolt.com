import type { MoveGoal, MoveGoals } from "@/features/move-sequence/types/move-goal";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parsePly(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const ply = Number(value);
    if (Number.isFinite(ply)) return ply;
  }
  return null;
}

export type GoalsOverlayPly = {
  ply: number | null;
  move?: string;
  title?: string;
  strategy?: string;
  takeaway?: string;
  checkpointMessage?: string;
};

export type GoalsOverlay = {
  mainIdea?: string;
  lessonsLearned?: string;
  plys: GoalsOverlayPly[];
};

/**
 * Parse enrichment JSON shaped like MoveGoals. Prose + strategy are taken from
 * this payload; visuals/move from this payload are ignored when merging.
 */
export function parseGoalsOverlayJson(raw: string): { overlay: GoalsOverlay | null; error: string | null } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { overlay: null, error: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { overlay: null, error: "Goals JSON is not valid JSON." };
  }

  if (!isRecord(parsed)) {
    return { overlay: null, error: "Goals JSON must be an object." };
  }

  const plysRaw = parsed.plys;
  if (plysRaw !== undefined && !Array.isArray(plysRaw)) {
    return { overlay: null, error: "Goals JSON plys must be an array." };
  }

  const plys: GoalsOverlayPly[] = (Array.isArray(plysRaw) ? plysRaw : []).flatMap((entry) => {
    if (!isRecord(entry)) return [];
    return [
      {
        ply: parsePly(entry.ply),
        move: asString(entry.move),
        title: asString(entry.title),
        strategy: asString(entry.strategy),
        takeaway: asString(entry.takeaway),
        checkpointMessage: asString(entry.checkpointMessage),
      },
    ];
  });

  return {
    overlay: {
      mainIdea: asString(parsed.mainIdea),
      lessonsLearned: asString(parsed.lessonsLearned),
      plys,
    },
    error: null,
  };
}

function findOverlayPly(overlayPlys: GoalsOverlayPly[], goal: MoveGoal): GoalsOverlayPly | undefined {
  const byPly = overlayPlys.find((entry) => entry.ply === goal.ply);
  if (byPly) return byPly;
  return overlayPlys.find((entry) => entry.move === goal.move);
}

/**
 * Keep ply/move/visuals from PGN-built goals; fill strategy + prose from overlay JSON.
 * Overlay strategy falls back to PGN strategy when absent.
 */
export function mergeGoalsWithOverlay(base: MoveGoals, overlay: GoalsOverlay | null): MoveGoals {
  if (!overlay) return base;

  return {
    mainIdea: overlay.mainIdea ?? base.mainIdea,
    lessonsLearned: overlay.lessonsLearned ?? base.lessonsLearned,
    plys: base.plys.map((goal) => {
      const match = findOverlayPly(overlay.plys, goal);
      if (!match) return goal;

      return {
        ...goal,
        title: match.title ?? goal.title,
        strategy: match.strategy ?? goal.strategy,
        takeaway: match.takeaway ?? goal.takeaway,
        checkpointMessage: match.checkpointMessage ?? goal.checkpointMessage,
      };
    }),
  };
}
