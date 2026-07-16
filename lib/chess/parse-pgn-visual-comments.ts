import type { MoveGoals } from "@/features/move-sequence/types/move-goal";
import type { MoveVisual } from "@/features/move-sequence/types/move-visual";
import { getExpectedPlayerGoals, parseMovesFromSequence } from "@/lib/move-sequence-goals/expected-goals";

const RESULT_TOKENS = new Set(["1-0", "0-1", "1/2-1/2", "*"]);

const BRUSH_BY_LICHESS_COLOR: Record<string, string> = {
  B: "blue",
  G: "green",
  R: "red",
  Y: "yellow",
};

type PlyComment = {
  strategy: string;
  visuals: MoveVisual[];
};

type PlyCommentsByPly = Map<number, PlyComment>;

/**
 * Lichess study PGNs emit two comment blocks per move: one for prose and one
 * for `[%csl]`/`[%cal]` markers (e.g. `1. d4 { text } { [%csl ...] }`).
 * chess.js's movetext parser rejects a comment that immediately follows another
 * comment, so we merge adjacent `} {` blocks into a single comment first.
 */
export function normalizeLichessPgnComments(pgn: string): string {
  return pgn.replace(/\}\s*\{/g, " ");
}

function stripPgnHeaders(pgn: string): string {
  return pgn
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("["))
    .join("\n");
}

function isMoveNumberToken(token: string): boolean {
  return /^\d+\.(?:\.\.)?$/.test(token);
}

function normalizeSanToken(token: string): string {
  return token.replace(/^\d+\.(?:\.\.)?/, "");
}

function isMoveToken(token: string): boolean {
  const normalized = normalizeSanToken(token);
  if (!normalized || RESULT_TOKENS.has(normalized)) return false;
  if (isMoveNumberToken(token) || normalized.startsWith("$")) return false;
  return true;
}

function normalizeStrategy(value: string): string {
  return value.replace(/\s+/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();
}

function isSquare(value: string): boolean {
  return /^[a-h][1-8]$/.test(value);
}

function visualFromCslToken(token: string): MoveVisual | null {
  const brush = BRUSH_BY_LICHESS_COLOR[token[0] ?? ""];
  const square = token.slice(1);
  if (!brush || !isSquare(square)) return null;
  return { orig: square, dest: square, brush };
}

function visualFromCalToken(token: string): MoveVisual | null {
  const brush = BRUSH_BY_LICHESS_COLOR[token[0] ?? ""];
  const orig = token.slice(1, 3);
  const dest = token.slice(3, 5);
  if (!brush || !isSquare(orig) || !isSquare(dest)) return null;
  return { orig, dest, brush };
}

export function parseLichessCommentVisuals(comment: string): MoveVisual[] {
  const visuals: MoveVisual[] = [];
  const markerRegex = /\[%c([as])l\s+([^\]]*)\]/g;
  let markerMatch: RegExpExecArray | null;

  while ((markerMatch = markerRegex.exec(comment)) !== null) {
    const markerType = markerMatch[1];
    const tokens = (markerMatch[2] ?? "")
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean);

    for (const token of tokens) {
      const visual = markerType === "s" ? visualFromCslToken(token) : visualFromCalToken(token);
      if (visual) visuals.push(visual);
    }
  }

  return visuals;
}

function parsePlainCommentStrategy(comment: string): string {
  return normalizeStrategy(comment.replace(/\[%c[as]l\s+[^\]]*\]/g, " "));
}

function appendComment(commentsByPly: PlyCommentsByPly, ply: number, comment: string): void {
  const strategy = parsePlainCommentStrategy(comment);
  const visuals = parseLichessCommentVisuals(comment);
  const current = commentsByPly.get(ply) ?? { strategy: "", visuals: [] };

  commentsByPly.set(ply, {
    strategy: normalizeStrategy([current.strategy, strategy].filter(Boolean).join(" ")),
    visuals: [...current.visuals, ...visuals],
  });
}

export function parsePgnCommentsByPly(pgn: string): PlyCommentsByPly {
  const movetext = stripPgnHeaders(normalizeLichessPgnComments(pgn));
  const commentsByPly: PlyCommentsByPly = new Map();
  let ply = 0;
  let lastPly = 0;
  let variationDepth = 0;
  let index = 0;

  while (index < movetext.length) {
    const char = movetext[index];

    if (char === "{") {
      const end = movetext.indexOf("}", index + 1);
      if (end === -1) break;
      if (variationDepth === 0 && lastPly > 0) {
        appendComment(commentsByPly, lastPly, movetext.slice(index + 1, end));
      }
      index = end + 1;
      continue;
    }

    if (char === "(") {
      variationDepth += 1;
      index += 1;
      continue;
    }

    if (char === ")") {
      variationDepth = Math.max(0, variationDepth - 1);
      index += 1;
      continue;
    }

    if (/\s/.test(char ?? "")) {
      index += 1;
      continue;
    }

    const tokenStart = index;
    while (index < movetext.length && !/[\s{}()]/.test(movetext[index] ?? "")) {
      index += 1;
    }

    if (variationDepth > 0) continue;

    const token = movetext.slice(tokenStart, index);
    if (isMoveToken(token)) {
      ply += 1;
      lastPly = ply;
    }
  }

  return commentsByPly;
}

export function buildMoveGoalsFromPgnComments(
  pgn: string,
  initialFen: string,
  moves: string,
  initialPly = 0,
): MoveGoals {
  const commentsByPly = parsePgnCommentsByPly(pgn);
  const uciMoves = parseMovesFromSequence(moves);

  return {
    mainIdea: "",
    lessonsLearned: "",
    plys: getExpectedPlayerGoals(initialFen, uciMoves, initialPly).map(({ ply, move }) => {
      const comment = commentsByPly.get(ply);

      return {
        ply,
        move,
        title: "",
        visuals: comment && comment.visuals.length > 0 ? comment.visuals : "",
        strategy: comment?.strategy ?? "",
        checkpointMessage: "",
        isCompleted: false,
      };
    }),
  };
}
