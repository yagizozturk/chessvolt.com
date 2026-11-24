/**
 * Rating and onboarding are decided by the database, not by the client.
 *
 * - A rating change needs a recorded attempt and happens in the same transaction that saves it.
 * - An attempt changes the rating at most once, and a puzzle at most once per user.
 * - Finished attempts (completed / failed / abandoned) are final.
 * - Clients cannot write ratings, onboarding state, attempts or attempt events directly.
 *
 * Written before the change: against the old schema the client could update profiles.current_rating itself and
 * nothing tied a rating change to an attempt, so these fail there.
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, it } from "node:test";
import { setTimeout as sleep } from "node:timers/promises";

import {
  NEEDS_REAL_POSTGRES,
  type Queryable,
  type TestDatabase,
  createMigratedDatabase,
  errorOf,
  hasRealPostgres,
  runAs,
} from "./helpers/test-database";

const FEN = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3";

type AttemptStatus = "started" | "completed" | "failed" | "abandoned";
type Counters = { durationMs?: number; correct?: number; wrong?: number; hints?: number; streak?: number };
type SaveResult = {
  attempt: { id: string; status: AttemptStatus; wrong_move_count: number; rating_delta: number | null };
  rating_delta: number | null;
  current_rating: number | null;
};

let db: TestDatabase;

before(async () => {
  db = await createMigratedDatabase();
});

after(async () => {
  await db?.close();
});

// ------------------------------------------------------------------------------------------------
// Fixtures (written as the table owner, like the app's own setup would be)
// ------------------------------------------------------------------------------------------------
async function createUser(rating: number | null = 1500): Promise<string> {
  const id = randomUUID();
  await db.query("insert into auth.users (id, email) values ($1, $2)", [id, `${id}@example.test`]);
  await db.query("insert into public.profiles (id) values ($1) on conflict (id) do nothing", [id]);
  if (rating !== null) {
    await db.query(
      "update public.profiles set onboarding_completed = true, initial_rating = $2, current_rating = $2 where id = $1",
      [id, rating],
    );
  }
  return id;
}

async function createSequence(): Promise<string> {
  const [row] = await db.query<{ id: string }>(
    "insert into public.move_sequences (initial_fen, moves) values ($1, 'g1f3') returning id",
    [FEN],
  );
  return row.id;
}

async function createPuzzle(): Promise<string> {
  const sequenceId = await createSequence();
  await db.query(
    "insert into public.puzzles (title, move_sequence_id, is_active, rating) values ('Test puzzle', $1, true, 1500)",
    [sequenceId],
  );
  return sequenceId;
}

async function ratingOf(userId: string): Promise<number | null> {
  const [row] = await db.query<{ current_rating: number | null }>(
    "select current_rating from public.profiles where id = $1",
    [userId],
  );
  return row.current_rating;
}

// ------------------------------------------------------------------------------------------------
// The server's calls (service role, user id from the session)
// ------------------------------------------------------------------------------------------------
function asServer<T>(fn: (q: Queryable) => Promise<T>, conn: Queryable = db): Promise<T> {
  return runAs(conn, "service_role", null, fn);
}

function asClient<T>(userId: string, fn: (q: Queryable) => Promise<T>): Promise<T> {
  return runAs(db, "authenticated", userId, fn);
}

async function startAttempt(userId: string, sequenceId: string): Promise<string> {
  const [row] = await asServer((q) =>
    q.query<{ id: string }>("select id from public.start_sequence_attempt($1, $2)", [userId, sequenceId]),
  );
  return row.id;
}

const SAVE_SQL =
  "select public.save_sequence_attempt($1, $2, $3, $4::public.puzzle_attempt_status, $5, $6, $7, $8, $9) as result";

function saveParams(userId: string, attemptId: string, sequenceId: string, status: AttemptStatus, c: Counters) {
  return [
    userId,
    attemptId,
    sequenceId,
    status,
    c.durationMs ?? 1_000,
    c.correct ?? 1,
    c.wrong ?? 0,
    c.hints ?? 0,
    c.streak ?? 1,
  ];
}

async function saveAttempt(
  userId: string,
  attemptId: string,
  sequenceId: string,
  status: AttemptStatus,
  counters: Counters = {},
): Promise<SaveResult> {
  const [row] = await asServer((q) =>
    q.query<{ result: SaveResult }>(SAVE_SQL, saveParams(userId, attemptId, sequenceId, status, counters)),
  );
  return row.result;
}

// ------------------------------------------------------------------------------------------------
describe("an attempt changes the rating at most once", () => {
  it("a clean solve adds 5 once; completing the attempt again is rejected", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    const attempt = await startAttempt(user, puzzle);

    const solved = await saveAttempt(user, attempt, puzzle, "completed");
    assert.equal(solved.rating_delta, 5);
    assert.equal(solved.current_rating, 1505);

    const again = await errorOf(() => saveAttempt(user, attempt, puzzle, "completed"));
    assert.match(again ?? "", /attempt_already_finished/);
    assert.equal(await ratingOf(user), 1505);
  });

  it("a failed attempt cannot be completed afterwards", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    const attempt = await startAttempt(user, puzzle);

    assert.equal((await saveAttempt(user, attempt, puzzle, "failed", { wrong: 1 })).rating_delta, -5);
    assert.equal(await ratingOf(user), 1495);

    const completed = await errorOf(() => saveAttempt(user, attempt, puzzle, "completed", { wrong: 1 }));
    assert.match(completed ?? "", /attempt_already_finished/);
    assert.equal(await ratingOf(user), 1495);
  });

  it("the first mistake costs 5 once, even when the attempt is completed later", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    const attempt = await startAttempt(user, puzzle);

    assert.equal((await saveAttempt(user, attempt, puzzle, "started", { wrong: 1 })).rating_delta, -5);
    assert.equal((await saveAttempt(user, attempt, puzzle, "started", { wrong: 2 })).rating_delta, null);
    const completed = await saveAttempt(user, attempt, puzzle, "completed", { correct: 3, wrong: 2 });

    assert.equal(completed.rating_delta, null);
    assert.equal(completed.attempt.status, "completed");
    assert.equal(await ratingOf(user), 1495);
  });

  it("a puzzle changes the rating once per user, however many attempts", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();

    await saveAttempt(user, await startAttempt(user, puzzle), puzzle, "completed");
    const second = await saveAttempt(user, await startAttempt(user, puzzle), puzzle, "completed");
    const third = await saveAttempt(user, await startAttempt(user, puzzle), puzzle, "failed", { wrong: 1 });

    assert.equal(second.rating_delta, null);
    assert.equal(third.rating_delta, null);
    assert.equal(await ratingOf(user), 1505);
  });

  it("move counters cannot be lowered", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    const attempt = await startAttempt(user, puzzle);

    await saveAttempt(user, attempt, puzzle, "started", { wrong: 1 });
    const completed = await saveAttempt(user, attempt, puzzle, "completed", { wrong: 0 });

    assert.equal(completed.attempt.wrong_move_count, 1);
    assert.equal(await ratingOf(user), 1495);
  });
});

// ------------------------------------------------------------------------------------------------
describe("the rating does not change without a recorded attempt", () => {
  it("an attempt id that does not exist is rejected", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();

    const error = await errorOf(() => saveAttempt(user, randomUUID(), puzzle, "completed"));
    assert.match(error ?? "", /attempt_not_found/);
    assert.equal(await ratingOf(user), 1500);
  });

  it("another user's attempt is rejected", async () => {
    const owner = await createUser(1500);
    const other = await createUser(1500);
    const puzzle = await createPuzzle();
    const attempt = await startAttempt(owner, puzzle);

    const error = await errorOf(() => saveAttempt(other, attempt, puzzle, "completed"));
    assert.match(error ?? "", /attempt_not_found/);
    assert.equal(await ratingOf(other), 1500);
    assert.equal(await ratingOf(owner), 1500);
  });

  it("an attempt only counts for its own sequence", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    const otherPuzzle = await createPuzzle();
    const attempt = await startAttempt(user, puzzle);

    const error = await errorOf(() => saveAttempt(user, attempt, otherPuzzle, "completed"));
    assert.match(error ?? "", /attempt_sequence_mismatch/);
    assert.equal(await ratingOf(user), 1500);
  });

  it("sequences that are not puzzles never change the rating", async () => {
    const user = await createUser(1500);
    const sequence = await createSequence();

    const solved = await saveAttempt(user, await startAttempt(user, sequence), sequence, "completed");
    const failed = await saveAttempt(user, await startAttempt(user, sequence), sequence, "failed", { wrong: 1 });

    assert.equal(solved.rating_delta, null);
    assert.equal(failed.rating_delta, null);
    assert.equal(await ratingOf(user), 1500);
  });

  it("an attempt cannot be started on a sequence that does not exist", async () => {
    const user = await createUser(1500);

    assert.match((await errorOf(() => startAttempt(user, randomUUID()))) ?? "", /sequence_not_found/);
  });
});

// ------------------------------------------------------------------------------------------------
describe("two requests at the same time", { skip: hasRealPostgres() ? false : NEEDS_REAL_POSTGRES }, () => {
  async function waitUntilBlocked(): Promise<void> {
    for (let i = 0; i < 50; i += 1) {
      const [row] = await db.query<{ waiting: number }>(
        "select count(*)::int as waiting from pg_stat_activity where datname = current_database() and wait_event_type = 'Lock'",
      );
      if (row.waiting > 0) return;
      await sleep(50);
    }
    throw new Error("the second request never waited for the first one");
  }

  async function raceTwoSaves(
    user: string,
    first: { attemptId: string; sequenceId: string },
    second: { attemptId: string; sequenceId: string },
  ): Promise<string | null> {
    const a = await db.connect();
    const b = await db.connect();
    try {
      await a.query("begin");
      await a.query("set local role service_role");
      await b.query("begin");
      await b.query("set local role service_role");

      await a.query(SAVE_SQL, saveParams(user, first.attemptId, first.sequenceId, "completed", {}));
      const late = b.query(SAVE_SQL, saveParams(user, second.attemptId, second.sequenceId, "completed", {})).then(
        () => null,
        (error: Error) => error.message,
      );

      await waitUntilBlocked();
      await a.query("commit");
      const lateError = await late;
      await b.query(lateError ? "rollback" : "commit");
      return lateError;
    } finally {
      await a.close();
      await b.close();
    }
  }

  it("completing one attempt from two connections changes the rating once", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    const attempt = await startAttempt(user, puzzle);

    const lateError = await raceTwoSaves(
      user,
      { attemptId: attempt, sequenceId: puzzle },
      { attemptId: attempt, sequenceId: puzzle },
    );

    assert.match(lateError ?? "", /attempt_already_finished/);
    assert.equal(await ratingOf(user), 1505);
  });

  it("finishing two attempts of one puzzle at once changes the rating once", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    const firstAttempt = await startAttempt(user, puzzle);
    const secondAttempt = await startAttempt(user, puzzle);

    const lateError = await raceTwoSaves(
      user,
      { attemptId: firstAttempt, sequenceId: puzzle },
      { attemptId: secondAttempt, sequenceId: puzzle },
    );

    assert.equal(lateError, null);
    assert.equal(await ratingOf(user), 1505);
  });
});

// ------------------------------------------------------------------------------------------------
describe("clients cannot write ratings, onboarding state or attempts directly", () => {
  it("current_rating, initial_rating, onboarding_completed and role are read-only for the user", async () => {
    const user = await createUser(1500);

    for (const change of [
      "current_rating = 3000",
      "initial_rating = 3000",
      "onboarding_completed = false",
      "role = 'admin'",
    ]) {
      const error = await errorOf(() =>
        asClient(user, (q) => q.query(`update public.profiles set ${change} where id = $1`, [user])),
      );
      assert.match(error ?? "", /permission denied/, change);
    }

    const [profile] = await db.query<{ current_rating: number; role: string; onboarding_completed: boolean }>(
      "select current_rating, role, onboarding_completed from public.profiles where id = $1",
      [user],
    );
    assert.deepEqual(profile, { current_rating: 1500, role: "user", onboarding_completed: true });
  });

  it("the user can still change their own usernames", async () => {
    const user = await createUser(1500);

    const rows = await asClient(user, (q) =>
      q.query(
        "update public.profiles set username = 'new name', chesscom_username = 'me', lichess_username = 'me' where id = $1 returning id",
        [user],
      ),
    );
    assert.equal(rows.length, 1);
  });

  it("attempts and attempt events cannot be written directly", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    // Written as the table owner, so the setup works on the old schema too.
    const [{ id: attempt }] = await db.query<{ id: string }>(
      "insert into public.user_sequence_attempts (user_id, sequence_id) values ($1, $2) returning id",
      [user, puzzle],
    );

    const writes = [
      ["insert into public.user_sequence_attempts (user_id, sequence_id) values ($1, $2)", [user, puzzle]],
      ["update public.user_sequence_attempts set status = 'completed' where id = $1", [attempt]],
      ["delete from public.user_sequence_attempts where id = $1", [attempt]],
      ["insert into public.user_sequence_attempt_events (attempt_id, event_type) values ($1, 'start')", [attempt]],
    ] as const;

    for (const [sql, params] of writes) {
      const error = await errorOf(() => asClient(user, (q) => q.query(sql, [...params])));
      assert.match(error ?? "", /permission denied/, sql);
    }
  });

  it("only the server can call the functions that write", async () => {
    const user = await createUser(1500);
    const puzzle = await createPuzzle();
    const attempt = await startAttempt(user, puzzle);

    const calls = [
      ["select public.start_sequence_attempt($1, $2)", [user, puzzle]],
      [SAVE_SQL, saveParams(user, attempt, puzzle, "completed", {})],
      ["select public.record_sequence_attempt_event($1, $2, 'start')", [user, attempt]],
      ["select public.complete_onboarding($1, 3000)", [user]],
    ] as const;

    for (const [sql, params] of calls) {
      for (const role of ["authenticated", "anon"] as const) {
        const error = await errorOf(() =>
          runAs(db, role, role === "anon" ? null : user, (q) => q.query(sql, [...params])),
        );
        assert.match(error ?? "", /permission denied/, `${role}: ${sql}`);
      }
    }
    assert.equal(await ratingOf(user), 1500);
  });
});

// ------------------------------------------------------------------------------------------------
describe("onboarding", () => {
  it("sets the initial rating once; running it again does not reset the rating", async () => {
    const user = await createUser(null);
    const complete = (rating: number) =>
      asServer((q) =>
        q.query<{ initial_rating: number; current_rating: number; onboarding_completed: boolean }>(
          "select initial_rating, current_rating, onboarding_completed from public.complete_onboarding($1, $2, 'me', null)",
          [user, rating],
        ),
      );

    assert.deepEqual((await complete(1800))[0], {
      initial_rating: 1800,
      current_rating: 1800,
      onboarding_completed: true,
    });

    const puzzle = await createPuzzle();
    await saveAttempt(user, await startAttempt(user, puzzle), puzzle, "completed");

    assert.match((await errorOf(() => complete(1200))) ?? "", /onboarding_already_completed/);
    assert.equal(await ratingOf(user), 1805);
  });
});
