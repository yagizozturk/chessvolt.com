"use client";

import VoltBoard from "@/components/boards/volt-board/volt-board";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

export default function TestBoard() {
  function handleCheckMove(_payload: MoveAttemptPayload) {
    return true;
  }

  function handleSuccessMovePlayed(_move: Move) {}

  return (
    <div className="p-6">
      <VoltBoard
        sourceId="test-board"
        onCheckMove={handleCheckMove}
        onSuccessMovePlayed={handleSuccessMovePlayed}
        onNextMoveRequest={() => undefined}
      />
    </div>
  );
}
