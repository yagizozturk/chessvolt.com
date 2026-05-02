"use client";

import VoltBoard from "@/components/volt-board/volt-board";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

export default function TestBoard() {
  function handleCheckMove(_payload: MoveAttemptPayload) {
    return true;
  }

  function handleMovePlayed(_move: Move) {
    return "";
  }

  return (
    <div className="p-6">
      <VoltBoard sourceId="test-board" onCheckMove={handleCheckMove} onMovePlayed={handleMovePlayed} />
    </div>
  );
}
