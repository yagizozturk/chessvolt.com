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

export function useOpeningVariantControllerUpdated({ variant: _variant }: UseOpeningVariantControllerParams) {
  const _moves = _variant.moves
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);
  const [_moveCount, _setMoveCount] = useState<number>(0);
  const [_hintCount, _setHintCount] = useState(0);
  const [_activePly, _setActivePly] = useState<number | null>(() => _variant.ply);
  const {
    evaluateMove: _evaluateMove,
    engineStatus: _engineStatus,
    lastMoveEvaluation: _lastMoveEvaluation,
  } = useMoveEvaluation();

  // ============================================================================
  // Goals variant içinden alınır ve ply sırasına göre yukarıdan aşağıya dizilir.
  // Stepper bu sıralı listeyi kullanır.
  // ============================================================================
  const _sortedGoals = useMemo(() => {
    const _goals = _variant.goals;
    if (!_goals?.length) return [];
    return [..._goals].sort((a, b) => a.ply - b.ply);
  }, [_variant.goals]);

  const _nextGoal = useMemo(() => {
    if (_activePly == null) return null;
    return _sortedGoals.find((goal) => goal.ply === _activePly + 1) ?? null;
  }, [_sortedGoals, _activePly]);
  const _totalGoals = _sortedGoals.length;
  const _currentGoalIndex = useMemo(() => {
    if (_totalGoals === 0) return 0;
    if (!_nextGoal) return _totalGoals;

    const _goalIndex = _sortedGoals.findIndex((goal) => goal.ply === _nextGoal.ply);
    return _goalIndex >= 0 ? _goalIndex + 1 : 1;
  }, [_nextGoal, _sortedGoals, _totalGoals]);

  // ============================================================================
  // Variant içindneki Progress value'u hesaplar.
  // ============================================================================
  const _progressValue = useMemo(() => {
    if (!_sortedGoals.length) return 0;

    const _completedGoalsCount = _sortedGoals.filter(
      (goal) => goal.isCompleted || (_activePly != null && _activePly >= goal.ply),
    ).length;

    return Math.round((_completedGoalsCount / _sortedGoals.length) * 100);
  }, [_sortedGoals, _activePly]);

  // ============================================================================
  // Variant değiştiğinde local ekran state'i sıfırlanır:
  // - Hint hakkı yeniden başlar
  // - Aktif ply, variant başlangıç ply'sine döner
  // ============================================================================
  useEffect(() => {
    _setHintCount(0);
    _setMoveCount(0);
    _setActivePly(_variant.ply);
  }, [_variant.id, _variant.ply]);

  // ============================================================================
  // Oyuncu hamle yapınca önce kontole girer(attempt) ve tetiklenir.
  // ============================================================================
  function _handleMoveCheck(_playedMove: MoveAttemptPayload) {
    const _expectedMove = _moves[_moveCount];
    const _isCorrect = _playedMove.uci === _expectedMove;

    return {
      isCorrect: _isCorrect,
    };
  }

  // ============================================================================
  // Hamle onaylanıp tahtaya uygulandıktan sonra tetiklenir.
  // Oynandığına göre hamle doğrudur.
  // Sonraki rakip hamlesi varsa index 2 artar; yoksa 1 artar.
  // ============================================================================
  function _handleMovePlayed(_playedMove: MoveEvaluationPayload) {
    _evaluateMove(_playedMove);
    const _currentStep = _moveCount;
    const _nextMove = _moves[_currentStep + 1];
    const _nextUserStep = _nextMove ? _currentStep + 2 : _currentStep + 1;
    _setMoveCount(_nextUserStep);
    _setHintCount(0);

    // Tahtadaki güncel konuma göre active ply'i ilerletir.
    // Rakip otomatik hamlesi varsa bir ply daha ileride olur.
    const _userMovePly = getPlyFromPgnAtFen(_variant.pgn, _playedMove.fenAfter);
    if (_userMovePly !== null) {
      _setActivePly(_nextMove ? _userMovePly + 1 : _userMovePly);
    }

    return {
      nextMove: _nextMove,
    };
  }

  // ============================================================================
  // Moves arrayi içindeki hamleyi bulmak için count ı arttrırır.
  // ============================================================================
  function _incrementMoveCount() {
    _setMoveCount((_prev) => _prev + 1);
  }

  // ============================================================================
  // Move count'u sıfırlar.
  // ============================================================================
  function _resetMoveCount() {
    _setMoveCount(0);
  }

  // ============================================================================
  // Hint politikası controller tarafında yönetilir:
  // - Her step için en fazla 2 hint
  // - Kaçıncı hint olduğu board'a parametre olarak gönderilir
  // ============================================================================
  const _hintRequested = () => {
    if (_hintCount >= 2) return null;

    const _nextHintCount = _hintCount + 1;
    _setHintCount(_nextHintCount);
    return _nextHintCount;
  };

  // ============================================================================
  // Sıradaki oynanması gereken hamle
  // _currentExpectedMove bir derived value:
  // _moveCount’a göre otomatik hesaplanıyor.
  // ============================================================================
  const _currentExpectedMove = _moves[_moveCount] ?? null;

  return {
    _moves,
    _nextGoal,
    _totalGoals,
    _currentGoalIndex,
    _hintCount,
    _progressValue,
    _engineStatus,
    _lastMoveEvaluation,
    _handleMoveCheck,
    _handleMovePlayed,
    _incrementMoveCount,
    _resetMoveCount,
    _hintRequested,
    _currentExpectedMove,
  };
}
