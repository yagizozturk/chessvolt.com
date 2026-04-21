"use client";

import { useEffect, useMemo, useState } from "react";

import { useMoveEvaluation } from "@/features/openings/hooks/use-move-evaluation";
import { getPlyFromPgnAtFen } from "@/lib/chess/getPlyFromPgnAtFen";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";
import type { MoveEvaluationPayload } from "@/lib/shared/types/move-evaluation-payload";

import { OpeningVariant } from "../types/opening-variant";

type UseOpeningVariantControllerParams = {
  variant: OpeningVariant;
};

export function useOpeningVariantControllerUpdated({ variant }: UseOpeningVariantControllerParams) {
  const moves = variant.moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [hintCount, setHintCount] = useState(0);
  const [activePly, setActivePly] = useState<number | null>(() => variant.ply);
  const { evaluateMove, engineStatus, lastMoveEvaluation } = useMoveEvaluation();

  // ============================================================================
  // Goals variant içinden alınır ve ply sırasına göre yukarıdan aşağıya dizilir.
  // Stepper bu sıralı listeyi kullanır.
  // ============================================================================
  const sortedGoals = useMemo(() => {
    const g = variant.goals;
    if (!g?.length) return [];
    return [...g].sort((a, b) => a.ply - b.ply);
  }, [variant.goals]);

  const nextGoal = useMemo(() => {
    if (activePly == null) return null;
    return sortedGoals.find((goal) => goal.ply === activePly + 1) ?? null;
  }, [sortedGoals, activePly]);

  // ============================================================================
  // Variant değiştiğinde local ekran state'i sıfırlanır:
  // - Hint hakkı yeniden başlar
  // - Aktif ply, variant başlangıç ply'sine döner
  // ============================================================================
  useEffect(() => {
    setHintCount(0);
    setActivePly(variant.ply);
  }, [variant.id, variant.ply]);

  // ============================================================================
  // Oyuncu hamle yapınca önce kontole girer(attempt) ve tetiklenir.
  // ============================================================================
  function _handleMoveCheck(playedMove: MoveAttemptPayload) {
    const expectedMove = moves[moveCount];
    const isCorrect = playedMove.uci === expectedMove;

    return {
      isCorrect,
    };
  }

  // ============================================================================
  // Hamle onaylanıp tahtaya uygulandıktan sonra tetiklenir.
  // Oynandığına göre hamle doğrudur.
  // Sonraki rakip hamlesi varsa index 2 artar; yoksa 1 artar.
  // ============================================================================
  function _handleMovePlayed(playedMove: MoveEvaluationPayload) {
    evaluateMove(playedMove);
    const currentStep = moveCount;
    const nextMove = moves[currentStep + 1];
    const nextUserStep = nextMove ? currentStep + 2 : currentStep + 1;
    setMoveCount(nextUserStep);

    // Tahtadaki güncel konuma göre active ply'i ilerletir.
    // Rakip otomatik hamlesi varsa bir ply daha ileride olur.
    const userMovePly = getPlyFromPgnAtFen(variant.pgn, playedMove.fenAfter);
    if (userMovePly !== null) {
      setActivePly(nextMove ? userMovePly + 1 : userMovePly);
    }

    return {
      nextMove,
    };
  }

  // ============================================================================
  // Moves arrayi içindeki hamleyi bulmak için count ı arttrırır.
  // ============================================================================
  function _incrementMoveCount() {
    setMoveCount((prev) => prev + 1);
  }

  // ============================================================================
  // Move count'u sıfırlar.
  // ============================================================================
  function _resetMoveCount() {
    setMoveCount(0);
  }

  // ============================================================================
  // Hint politikası controller tarafında yönetilir:
  // - Her step için en fazla 2 hint
  // - Kaçıncı hint olduğu board'a parametre olarak gönderilir
  // ============================================================================
  const _hintRequested = () => {
    if (hintCount >= 2) return null;

    const nextHintCount = hintCount + 1;
    setHintCount(nextHintCount);
    return nextHintCount;
  };

  return {
    moves,
    nextGoal,
    engineStatus,
    lastMoveEvaluation,
    _handleMoveCheck,
    _handleMovePlayed,
    _incrementMoveCount,
    _resetMoveCount,
    _hintRequested,
  };
}
