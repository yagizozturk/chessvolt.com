/**
 * supabase/migrations must rebuild the database from nothing, in file-name order. The first file is the production
 * baseline (see its header); the files after it are the changes made since.
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";

import { applyMigrations, createEmptyDatabase, listMigrations } from "./helpers/test-database";

describe("supabase/migrations", () => {
  it("have unique versions and start with the production baseline", () => {
    const files = listMigrations();
    const versions = files.map((file) => file.split("_")[0]);

    assert.equal(new Set(versions).size, versions.length);
    assert.match(files[0], /^\d{14}_production_baseline\.sql$/);
  });

  it("apply in order to an empty database", async () => {
    const db = await createEmptyDatabase();
    try {
      assert.deepEqual(await applyMigrations(db), listMigrations());

      // The baseline's auth.users trigger gives every new user a profile.
      const userId = randomUUID();
      await db.query("insert into auth.users (id, raw_user_meta_data) values ($1, $2)", [
        userId,
        JSON.stringify({ full_name: "New Player" }),
      ]);
      const [profile] = await db.query<{ username: string; role: string; onboarding_completed: boolean }>(
        "select username, role, onboarding_completed from public.profiles where id = $1",
        [userId],
      );
      assert.deepEqual(profile, { username: "New Player", role: "user", onboarding_completed: false });
    } finally {
      await db.close();
    }
  });
});
