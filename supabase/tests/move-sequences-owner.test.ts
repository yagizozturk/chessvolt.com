/**
 * move_sequences.user_id (migration 20261123160000_move_sequences_owner.sql): a sequence made from a user's game
 * mistake belongs to that user. Shared content (puzzles, opening variants) keeps user_id null.
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, it } from "node:test";

import { type TestDatabase, applyMigrations, createEmptyDatabase, runAs } from "./helpers/test-database";

const OWNER_MIGRATION = "20261123160000_move_sequences_owner.sql";

let db: TestDatabase;
const userA = randomUUID();
const userB = randomUUID();
const seq = {
  mistake: randomUUID(), // used by a mistake of A
  fromAnalysis: randomUUID(), // no mistake row any more; A's analysis has the same position and best move
  ambiguous: randomUUID(), // both A's and B's analyses match
  puzzle: randomUUID(), // shared content
  unknown: randomUUID(), // nothing matches
};

async function ownerOf(id: string): Promise<string | null | undefined> {
  const rows = await db.query<{ user_id: string | null }>("select user_id from public.move_sequences where id = $1", [
    id,
  ]);
  return rows[0] ? rows[0].user_id : undefined;
}

before(async () => {
  db = await createEmptyDatabase();
  await applyMigrations(db, { before: OWNER_MIGRATION });

  // Rows as they exist before the migration (written as the table owner).
  await db.query("insert into auth.users (id) values ($1), ($2)", [userA, userB]);
  for (const [name, id] of Object.entries(seq)) {
    await db.query("insert into public.move_sequences (id, initial_fen, moves) values ($1, $2, $3)", [
      id,
      `fen-${name}`,
      name === "puzzle" ? "e2e4 e7e5" : "g1f3",
    ]);
  }
  await db.query("insert into public.puzzles (title, move_sequence_id) values ('Puzzle', $1)", [seq.puzzle]);
  await db.query(
    "insert into public.game_analysis_mistakes (user_id, game_id, source, title, ply, quality, move_sequence_id) " +
      "values ($1, 'game-1', 'chesscom', 'Played Nf3', 2, 'mistake', $2)",
    [userA, seq.mistake],
  );
  const moments = (...names: string[]) =>
    JSON.stringify({ criticalMoments: names.map((name) => ({ fen: `fen-${name}`, bestUci: "g1f3" })) });
  await db.query(
    "insert into public.game_analyses (user_id, game_id, source, data) values ($1, 'game-1', 'chesscom', $2)",
    [userA, moments("fromAnalysis", "ambiguous")],
  );
  await db.query(
    "insert into public.game_analyses (user_id, game_id, source, data) values ($1, 'game-2', 'chesscom', $2)",
    [userB, moments("ambiguous")],
  );

  await applyMigrations(db, { from: OWNER_MIGRATION, shim: false });
});

after(async () => {
  await db?.close();
});

describe("move_sequences.user_id", () => {
  it("is backfilled from the user's mistakes and analyses, only when exactly one user matches", async () => {
    assert.equal(await ownerOf(seq.mistake), userA);
    assert.equal(await ownerOf(seq.fromAnalysis), userA);
    assert.equal(await ownerOf(seq.ambiguous), null);
    assert.equal(await ownerOf(seq.puzzle), null);
    assert.equal(await ownerOf(seq.unknown), null);
  });

  it("shows a user's sequences to that user only; shared ones to everyone", async () => {
    const visible = (role: "anon" | "authenticated", userId: string | null, id: string) =>
      runAs(db, role, userId, (q) => q.query("select id from public.move_sequences where id = $1", [id]));

    assert.equal((await visible("authenticated", userA, seq.mistake)).length, 1);
    assert.equal((await visible("authenticated", userB, seq.mistake)).length, 0);
    assert.equal((await visible("anon", null, seq.mistake)).length, 0);
    assert.equal((await visible("anon", null, seq.puzzle)).length, 1);
    assert.equal((await visible("authenticated", userB, seq.puzzle)).length, 1);
  });

  it("goes away with the user's account; shared rows stay", async () => {
    await db.query("delete from auth.users where id = $1", [userA]);

    assert.equal(await ownerOf(seq.mistake), undefined);
    assert.equal(await ownerOf(seq.fromAnalysis), undefined);
    assert.equal(await ownerOf(seq.puzzle), null);
    assert.equal(await ownerOf(seq.ambiguous), null);
  });
});
