import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getMovesFromPgn } from "@/lib/chess/getMovesFromPgn";

import { MAX_CRITICAL_MOMENTS } from "../constants/analysis-limits";
import type { CriticalMoment } from "../types/critical-moment";
import { parseAnalysis } from "./parse-analysis";

const PGN = '[White "Me"]\n[Black "Opponent"]\n[Result "1-0"]\n\n1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7# 1-0';
const moves = getMovesFromPgn(PGN)!;

// 2. Bc4 (ply 2) instead of the engine's Nf3, shaped like analyzePgnWithStockfish's output.
function moment(overrides: Partial<CriticalMoment> = {}): CriticalMoment {
  const move = moves[2];
  return {
    ply: 2,
    fen: move.fenBefore,
    playedUci: move.playedUci,
    playedSan: move.playedSan,
    bestUci: "g1f3",
    bestSan: "Nf3",
    beforeCp: 30,
    afterCp: -80,
    deltaCp: -110,
    quality: "mistake",
    mate: null,
    turn: "w",
    ...overrides,
  };
}

function analysis(criticalMoments: unknown[]) {
  return { moveCount: moves.length, depth: 20, criticalMoments };
}

describe("parseAnalysis", () => {
  it("accepts a moment that matches the game", () => {
    const parsed = parseAnalysis(analysis([moment()]), moves);

    assert.ok(parsed);
    assert.deepEqual(parsed.criticalMoments, [moment()]);
  });

  it("keeps an alternative answer that is legal", () => {
    const parsed = parseAnalysis(analysis([moment({ alternativeUci: "b1c3", alternativeSan: "Nc3" })]), moves);

    assert.equal(parsed?.criticalMoments[0].alternativeUci, "b1c3");
  });

  it("stores the game's FEN and drops fields it does not know", () => {
    const sent = {
      ...moment(),
      fen: `${moves[2].fenBefore.split(" ").slice(0, 3).join(" ")} - 0 9`,
      note: "x".repeat(1000),
    };
    const parsed = parseAnalysis(analysis([sent]), moves);

    assert.ok(parsed);
    assert.equal(parsed.criticalMoments[0].fen, moves[2].fenBefore);
    assert.equal("note" in parsed.criticalMoments[0], false);
  });

  it("rejects a moment whose position is not the game's", () => {
    assert.equal(parseAnalysis(analysis([moment({ fen: moves[3].fenBefore })]), moves), null);
  });

  it("rejects a moment whose played move is not the game's", () => {
    assert.equal(parseAnalysis(analysis([moment({ playedUci: "d2d4" })]), moves), null);
  });

  it("rejects a best move that is illegal or not UCI", () => {
    assert.equal(parseAnalysis(analysis([moment({ bestUci: "e1e8" })]), moves), null);
    assert.equal(parseAnalysis(analysis([moment({ bestUci: "Nf3" })]), moves), null);
  });

  it("rejects plies outside the game and repeated plies", () => {
    assert.equal(parseAnalysis(analysis([moment({ ply: moves.length })]), moves), null);
    assert.equal(parseAnalysis(analysis([moment({ ply: -1 })]), moves), null);
    assert.equal(parseAnalysis(analysis([moment(), moment()]), moves), null);
  });

  it("rejects oversized strings", () => {
    assert.equal(parseAnalysis(analysis([moment({ playedSan: "B".repeat(50) })]), moves), null);
  });

  it("rejects more moments than the limit, even for a long game", () => {
    const longGame = Array.from({ length: MAX_CRITICAL_MOMENTS + 1 }, () => moves[0]);

    assert.equal(parseAnalysis({ moveCount: longGame.length, depth: 20, criticalMoments: longGame }, longGame), null);
  });

  it("rejects a move count that does not match the PGN", () => {
    assert.equal(parseAnalysis({ ...analysis([]), moveCount: moves.length + 1 }, moves), null);
  });
});
