import type { CriticalMoment } from "@/features/game-analysis/types/critical-moment";
import type { GameAnalysisResponseData } from "@/features/game-analysis/types/game-analysis-response-data";
import { type ScoredPosition, getCriticalMoments } from "@/features/game-analysis/utilities/get-critical-moments";
import { type NormalizedPgnMove, getMovesFromPgn } from "@/lib/chess/getMovesFromPgn";
import { getPlayerRatingsFromPgn } from "@/lib/chess/getPlayerRatingsFromPgn";
import { getSanFromUci } from "@/lib/chess/getSanFromUci";
import { getTerminalScore, getTurnFromFen, mateToWhiteCp, toSideToMoveCp } from "@/lib/engine/engine-score";
import { parseEngine } from "@/lib/engine/parse-engine";
import type { EngineInfo } from "@/lib/shared/types/engine-info";
import { getWinPercent } from "@/lib/utils/getMoveQuality";

// Stockfish 19 NNUE (lite, single-threaded): runs without cross-origin isolation headers.
const ENGINE_URL = "/stockfish/stockfish-19-lite-single.js";
const HASH_MB = 64;
const POSITION_TIMEOUT_MS = 20_000;

type SearchLimit = { depth: number; movetimeMs: number };

const SCAN: SearchLimit = { depth: 14, movetimeMs: 3_000 };
const VERIFY: SearchLimit = { depth: 20, movetimeMs: 8_000 };
/** Win-percent drop (inaccuracy line) that sends both ends of a move to the deep search. */
const VERIFY_DROP = 5;
/** Progress weight of one deep search relative to one scan search. */
const VERIFY_COST = 6;

const ALTERNATIVE: SearchLimit = { depth: 18, movetimeMs: 6_000 };
/** Engine lines searched per critical moment: the best move and one alternative. */
const ALTERNATIVE_LINE_COUNT = 2;
/** Max win-percent drop from the best line for the alternative to also count as a correct answer. */
const ALTERNATIVE_MAX_WIN_DROP = 7;
/** Progress weight of one alternative search relative to one scan search. */
const ALTERNATIVE_COST = 5;

export type AnalyzePgnWithStockfishOptions = {
  signal?: AbortSignal;
  onProgress?: (completed: number, total: number) => void;
  /** Only this side's critical moments become questions, so only they get an alternative search. Null searches both. */
  playerColor?: "w" | "b" | null;
};

/** One MultiPV line: its first move and the side-to-move score (mate as synthetic cp). */
type EngineLine = { uci: string; cp: number };

function throwIfAborted(signal: AbortSignal | undefined) {
  if (signal?.aborted) {
    throw new DOMException("Analysis aborted", "AbortError");
  }
}

function createStockfish(signal: AbortSignal | undefined): Promise<Worker> {
  throwIfAborted(signal);

  return new Promise((resolve, reject) => {
    const worker = new Worker(ENGINE_URL);

    const fail = (error: Error) => {
      cleanup();
      worker.terminate();
      reject(error);
    };

    const onAbort = () => fail(new DOMException("Analysis aborted", "AbortError"));
    const timeoutId = window.setTimeout(() => fail(new Error("Stockfish failed to start")), 15_000);

    const onMessage = (event: MessageEvent) => {
      if (String(event.data) !== "readyok") return;
      cleanup();
      worker.postMessage("ucinewgame");
      resolve(worker);
    };

    function cleanup() {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onAbort);
      worker.removeEventListener("message", onMessage);
      worker.onerror = null;
    }

    signal?.addEventListener("abort", onAbort);
    worker.onerror = () => fail(new Error("Stockfish failed to start"));
    worker.addEventListener("message", onMessage);
    worker.postMessage("uci");
    worker.postMessage(`setoption name Hash value ${HASH_MB}`);
    worker.postMessage("isready");
  });
}

function whiteScoreFromEngine(info: EngineInfo, turn: "w" | "b"): Pick<ScoredPosition, "whiteCp" | "mate"> | null {
  if (info.mateIn != null) {
    const mate = turn === "w" ? info.mateIn : -info.mateIn;
    return { whiteCp: mateToWhiteCp(mate), mate };
  }

  if (info.scoreCp != null) {
    return { whiteCp: turn === "w" ? info.scoreCp : -info.scoreCp, mate: null };
  }

  return null;
}

function analyzeFen(
  worker: Worker,
  fen: string,
  limit: SearchLimit,
  signal: AbortSignal | undefined,
): Promise<ScoredPosition> {
  throwIfAborted(signal);

  const terminal = getTerminalScore(fen);
  if (terminal) {
    return Promise.resolve({
      whiteCp: terminal.whiteCp,
      mate: terminal.mate,
      bestUci: null,
      bestSan: null,
    });
  }

  const turn = getTurnFromFen(fen);

  return new Promise((resolve, reject) => {
    let latest: EngineInfo | null = null;
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onAbort);
      worker.onmessage = null;
      callback();
    };

    const onAbort = () => {
      worker.postMessage("stop");
      finish(() => reject(new DOMException("Analysis aborted", "AbortError")));
    };

    const timeoutId = window.setTimeout(() => {
      worker.postMessage("stop");
      finish(() => reject(new Error("Stockfish timed out")));
    }, POSITION_TIMEOUT_MS);

    signal?.addEventListener("abort", onAbort);

    worker.onmessage = (event) => {
      const line = String(event.data);
      if (line.includes("lowerbound") || line.includes("upperbound")) return;

      const info = parseEngine(line);
      if (!info) return;

      if (!info.bestmove) {
        const hasScore = info.scoreCp != null || info.mateIn != null;
        if (!hasScore) return;
        if (latest?.depth != null && info.depth != null && info.depth < latest.depth) return;
        latest = info;
        return;
      }

      const score = latest ? whiteScoreFromEngine(latest, turn) : null;
      const bestUci = info.bestmove === "(none)" ? null : info.bestmove;

      finish(() => {
        if (!score) {
          reject(new Error("Stockfish returned no score"));
          return;
        }

        resolve({
          whiteCp: score.whiteCp,
          mate: score.mate,
          bestUci,
          bestSan: getSanFromUci(fen, bestUci),
        });
      });
    };

    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${limit.depth} movetime ${limit.movetimeMs}`);
  });
}

function sideToMoveCpFromEngine(info: EngineInfo): number | null {
  if (info.mateIn != null) return mateToWhiteCp(info.mateIn);
  return info.scoreCp ?? null;
}

/**
 * Prefers the iteration that reported the most lines, then the deepest one. A search stopped mid-iteration
 * reports the unfinished lines one depth lower, so a deeper but partial set would compare scores across depths.
 */
function pickComparableLines(linesByDepth: Map<number, EngineLine[]>): EngineLine[] {
  let picked: EngineLine[] = [];
  let pickedDepth = -1;

  for (const [depth, lines] of linesByDepth) {
    const leading: EngineLine[] = [];
    for (let i = 0; i < lines.length && lines[i]; i++) leading.push(lines[i]);

    if (leading.length > picked.length || (leading.length === picked.length && depth > pickedDepth)) {
      picked = leading;
      pickedDepth = depth;
    }
  }

  return picked;
}

/** Best lines of one position, best first. The worker must already be set to the wanted MultiPV. */
function analyzeTopLines(
  worker: Worker,
  fen: string,
  limit: SearchLimit,
  signal: AbortSignal | undefined,
): Promise<EngineLine[]> {
  throwIfAborted(signal);

  return new Promise((resolve, reject) => {
    const linesByDepth = new Map<number, EngineLine[]>();
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onAbort);
      worker.onmessage = null;
      callback();
    };

    const onAbort = () => {
      worker.postMessage("stop");
      finish(() => reject(new DOMException("Analysis aborted", "AbortError")));
    };

    const timeoutId = window.setTimeout(() => {
      worker.postMessage("stop");
      finish(() => reject(new Error("Stockfish timed out")));
    }, POSITION_TIMEOUT_MS);

    signal?.addEventListener("abort", onAbort);

    worker.onmessage = (event) => {
      const line = String(event.data);
      if (line.includes("lowerbound") || line.includes("upperbound")) return;

      const info = parseEngine(line);
      if (!info) return;

      if (info.bestmove) {
        finish(() => resolve(pickComparableLines(linesByDepth)));
        return;
      }

      const uci = info.pv?.[0];
      const cp = sideToMoveCpFromEngine(info);
      if (!uci || cp == null || info.depth == null) return;

      const lines = linesByDepth.get(info.depth) ?? [];
      lines[(info.multipv ?? 1) - 1] = { uci, cp };
      linesByDepth.set(info.depth, lines);
    };

    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${limit.depth} movetime ${limit.movetimeMs}`);
  });
}

/**
 * Keeps the stored best move and adds the closest other line as an alternative answer, unless it scores
 * far below the top line (+5 vs +0.5). The move actually played is never an answer.
 */
function withAlternative(moment: CriticalMoment, lines: EngineLine[], rating: number | null): CriticalMoment {
  const [top] = lines;
  // Scores are measured against the top line; if that is the played move, this search disagrees it was a mistake.
  if (!top || top.uci === moment.playedUci) return moment;

  const topWin = getWinPercent(top.cp, rating);
  const alternative = lines.find(
    (line) =>
      line.uci !== moment.bestUci &&
      line.uci !== moment.playedUci &&
      topWin - getWinPercent(line.cp, rating) <= ALTERNATIVE_MAX_WIN_DROP,
  );
  const alternativeSan = alternative ? getSanFromUci(moment.fen, alternative.uci) : null;
  if (!alternative || !alternativeSan) return moment;

  return { ...moment, alternativeUci: alternative.uci, alternativeSan };
}

/** Positions on either side of a move that lost enough to matter, not yet searched deeply. Latest first. */
function getUnverifiedSuspects(moves: NormalizedPgnMove[], scores: ScoredPosition[], verified: Set<number>): number[] {
  const suspects = new Set<number>();

  for (let i = 0; i < moves.length; i++) {
    const turn = moves[i].turn;
    const winBefore = getWinPercent(toSideToMoveCp(scores[i].whiteCp, turn));
    const winAfter = getWinPercent(toSideToMoveCp(scores[i + 1].whiteCp, turn));
    if (winBefore - winAfter < VERIFY_DROP) continue;
    if (!verified.has(i)) suspects.add(i);
    if (!verified.has(i + 1)) suspects.add(i + 1);
  }

  return [...suspects].sort((a, b) => b - a);
}

export async function analyzePgnWithStockfish(
  pgn: string,
  options: AnalyzePgnWithStockfishOptions = {},
): Promise<GameAnalysisResponseData> {
  const moves = getMovesFromPgn(pgn);
  if (!moves?.length) {
    throw new Error("Invalid or empty PGN");
  }

  const fens = [moves[0].fenBefore, ...moves.map((move) => move.fenAfter)];
  const scores: ScoredPosition[] = new Array(fens.length);
  const verified = new Set<number>();
  const ratings = getPlayerRatingsFromPgn(pgn);
  const criticalMoments: CriticalMoment[] = [];

  const needsAlternative = (moment: CriticalMoment) =>
    moment.bestUci !== "" && (!options.playerColor || moment.turn === options.playerColor);
  // Moments only shift with deeper evals, so the current set sizes the last phase while verifying.
  const countAlternativeSearches = () => getCriticalMoments(moves, scores, ratings).filter(needsAlternative).length;

  // Deep-search count is unknown until the scan ends; assume about a third of the positions.
  let completed = 0;
  let total = fens.length + Math.ceil(fens.length / 3) * VERIFY_COST;
  const reportProgress = () => options.onProgress?.(Math.min(completed, total), total);

  const worker = await createStockfish(options.signal);

  try {
    // Backward, so each search reuses the hash of the position after it and sees the game's refutations sooner.
    for (let i = fens.length - 1; i >= 0; i--) {
      reportProgress();
      scores[i] = await analyzeFen(worker, fens[i], SCAN, options.signal);
      completed += 1;
    }

    // A deeper eval can turn a neighbouring move into a suspect, so repeat until nothing new shows up.
    for (
      let pending = getUnverifiedSuspects(moves, scores, verified);
      pending.length > 0;
      pending = getUnverifiedSuspects(moves, scores, verified)
    ) {
      total = completed + pending.length * VERIFY_COST + countAlternativeSearches() * ALTERNATIVE_COST;
      for (const i of pending) {
        reportProgress();
        scores[i] = await analyzeFen(worker, fens[i], VERIFY, options.signal);
        verified.add(i);
        completed += VERIFY_COST;
      }
    }

    // Second line per question, so a close alternative to the best move also counts. The worker is terminated
    // right after, so MultiPV is not reset.
    const moments = getCriticalMoments(moves, scores, ratings);
    total = completed + moments.filter(needsAlternative).length * ALTERNATIVE_COST;
    worker.postMessage(`setoption name MultiPV value ${ALTERNATIVE_LINE_COUNT}`);

    for (const moment of moments) {
      if (!needsAlternative(moment)) {
        criticalMoments.push(moment);
        continue;
      }

      reportProgress();
      const lines = await analyzeTopLines(worker, moment.fen, ALTERNATIVE, options.signal);
      criticalMoments.push(withAlternative(moment, lines, ratings[moment.turn]));
      completed += ALTERNATIVE_COST;
    }

    options.onProgress?.(total, total);
  } finally {
    worker.terminate();
  }

  return {
    moveCount: moves.length,
    depth: VERIFY.depth,
    criticalMoments,
  };
}
