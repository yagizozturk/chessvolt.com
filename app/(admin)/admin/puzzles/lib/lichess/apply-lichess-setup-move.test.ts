import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Chess } from "chess.js";

import { applyLichessSetupMove } from "./apply-lichess-setup-move";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("applyLichessSetupMove", () => {
  it("applies the setup move and returns remaining moves", () => {
    const result = applyLichessSetupMove(START_FEN, "e2e4 e7e5 g1f3");

    assert.equal(result.ok, true);
    if (!result.ok) return;

    const expected = new Chess(START_FEN);
    expected.move("e2e4");

    assert.equal(result.moves, "e7e5 g1f3");
    assert.equal(result.fen, expected.fen());
  });

  it("handles promotion on the setup move", () => {
    const fen = "8/P7/8/8/8/8/8/4K2k w - - 0 1";
    const result = applyLichessSetupMove(fen, "a7a8q g8h8");

    assert.equal(result.ok, true);
    if (!result.ok) return;

    const expected = new Chess(fen);
    expected.move("a7a8q");

    assert.equal(result.moves, "g8h8");
    assert.equal(result.fen, expected.fen());
  });

  it("rejects empty moves", () => {
    const result = applyLichessSetupMove(START_FEN, "");

    assert.equal(result.ok, false);
    if (result.ok) return;

    assert.match(result.message, /setup move and at least one solution move/);
  });

  it("rejects a single move", () => {
    const result = applyLichessSetupMove(START_FEN, "e2e4");

    assert.equal(result.ok, false);
    if (result.ok) return;

    assert.match(result.message, /setup move and at least one solution move/);
  });

  it("rejects an invalid FEN", () => {
    const result = applyLichessSetupMove("not-a-fen", "e2e4 e7e5");

    assert.equal(result.ok, false);
    if (result.ok) return;

    assert.equal(result.message, "Invalid FEN.");
  });

  it("rejects an illegal setup move", () => {
    const result = applyLichessSetupMove(START_FEN, "a1a2 e7e5");

    assert.equal(result.ok, false);
    if (result.ok) return;

    assert.equal(result.message, "Illegal setup move: a1a2");
  });
});
