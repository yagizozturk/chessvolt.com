import { createEngine } from "@/lib/engine/create-engine";
import { parseEngine } from "@/lib/engine/parse-engine";
import type { EngineInfo } from "@/lib/shared/types/engine-info";

const DEFAULT_TIMEOUT_MS = 45_000;
const DEFAULT_DEPTH = 12;

export type EngineSearchResult = {
  bestmove: string;
  infos: EngineInfo[];
};

export type AnalysisSession = {
  search(fen: string, depth?: number): Promise<EngineSearchResult>;
  terminate(): void;
};

/**
 * Persistent Stockfish worker for sequential MultiPV searches (Skill 20).
 */
export function createAnalysisSession(options?: {
  timeoutMs?: number;
  signal?: AbortSignal;
}): AnalysisSession {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const signal = options?.signal;

  let lineHandler: ((line: string) => void) | null = null;
  let readyResolve: (() => void) | null = null;
  const ready = new Promise<void>((resolve) => {
    readyResolve = resolve;
  });

  const worker = createEngine({
    skillLevel: 20,
    onReady: () => {
      worker.postMessage("setoption name MultiPV value 3");
      readyResolve?.();
    },
    onMessage: (line) => {
      lineHandler?.(line);
    },
  });

  let terminated = false;
  let searchChain: Promise<unknown> = Promise.resolve();
  let pendingReject: ((reason: Error) => void) | null = null;

  function terminate() {
    if (terminated) return;
    terminated = true;
    signal?.removeEventListener("abort", abortListener);
    const rejectPending = pendingReject;
    pendingReject = null;
    lineHandler = null;
    try {
      worker.terminate();
    } catch {
      /* ignore */
    }
    rejectPending?.(new Error("Analysis cancelled"));
  }

  const abortListener = () => {
    terminate();
  };
  signal?.addEventListener("abort", abortListener, { once: true });

  function search(fen: string, depth = DEFAULT_DEPTH): Promise<EngineSearchResult> {
    const run = async (): Promise<EngineSearchResult> => {
      if (terminated || signal?.aborted) {
        throw new Error("Analysis cancelled");
      }

      await ready;

      if (terminated || signal?.aborted) {
        throw new Error("Analysis cancelled");
      }

      return new Promise<EngineSearchResult>((resolve, reject) => {
        const infos: EngineInfo[] = [];
        let settled = false;

        const finish = (fn: () => void) => {
          if (settled) return;
          settled = true;
          pendingReject = null;
          window.clearTimeout(timer);
          lineHandler = null;
          fn();
        };

        pendingReject = (err) => {
          finish(() => reject(err));
        };

        const timer = window.setTimeout(() => {
          finish(() => reject(new Error("Stockfish timed out")));
        }, timeoutMs);

        lineHandler = (line: string) => {
          const parsed = parseEngine(line);
          if (!parsed) return;

          if (parsed.bestmove !== undefined) {
            finish(() =>
              resolve({
                bestmove: parsed.bestmove ?? "(none)",
                infos: [...infos],
              }),
            );
            return;
          }

          if (parsed.multipv !== undefined) {
            infos.push(parsed);
          }
        };

        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${depth}`);
      });
    };

    const next = searchChain.then(run, run);
    searchChain = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  return { search, terminate };
}

/**
 * One-shot search: opens a worker, searches, then terminates.
 */
export function runEngineSearch(options: {
  fen: string;
  depth?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}): Promise<EngineSearchResult> {
  const session = createAnalysisSession({
    timeoutMs: options.timeoutMs,
    signal: options.signal,
  });

  return session
    .search(options.fen, options.depth)
    .finally(() => session.terminate());
}
