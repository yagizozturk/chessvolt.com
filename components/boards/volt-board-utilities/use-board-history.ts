"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getFenFromUciMovesAtPly } from "@/lib/chess/getFenFromUciMovesAtPly";

type UseBoardHistoryParams = {
  /** Değişince gezinme canlı pozisyona döner (replay, yeni puzzle vb.). */
  sourceId: string;
  initialFen?: string;
  /** Sequence hamleleri (UCI), initialFen'e göre sıralı. */
  moves: string[];
  /** Oyuncunun ulaştığı ply. Gezinme bunun ilerisine geçemez. */
  revealedPly: number;
};

// ================================================================================================
// Oyuncunun ulaştığı hamleler arasında ileri/geri gezinme state'i.
// viewPly null ise canlı pozisyon gösterilir.
// ================================================================================================
export function useBoardHistory({ sourceId, initialFen, moves, revealedPly }: UseBoardHistoryParams) {
  // sourceId ile birlikte tutulur ki session değişince effect'siz sıfırlansın.
  const [view, setView] = useState<{ sourceId: string; ply: number } | null>(null);

  const maxPly = Math.min(revealedPly, moves.length);
  const viewPly = view?.sourceId === sourceId && view.ply < maxPly ? view.ply : null;
  const currentPly = viewPly ?? maxPly;
  const isBrowsing = viewPly !== null;

  const historyFen = useMemo(
    () => (isBrowsing ? getFenFromUciMovesAtPly(initialFen, moves, currentPly) : null),
    [isBrowsing, initialFen, moves, currentPly],
  );

  const goTo = useCallback(
    (ply: number) => {
      const clamped = Math.max(0, Math.min(ply, maxPly));
      setView(clamped >= maxPly ? null : { sourceId, ply: clamped });
    },
    [maxPly, sourceId],
  );

  const prev = useCallback(() => goTo(currentPly - 1), [goTo, currentPly]);
  const next = useCallback(() => goTo(currentPly + 1), [goTo, currentPly]);
  const reset = useCallback(() => setView(null), []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      event.preventDefault();
      if (event.key === "ArrowLeft") prev();
      else next();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  return {
    historyFen,
    isBrowsing,
    currentPly,
    maxPly,
    canPrev: currentPly > 0,
    canNext: currentPly < maxPly,
    prev,
    next,
    reset,
  };
}

export type BoardHistory = ReturnType<typeof useBoardHistory>;
