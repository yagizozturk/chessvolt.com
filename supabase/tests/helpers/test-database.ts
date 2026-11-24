/**
 * Test database for the SQL migrations.
 *
 * Every call gets an empty database with supabase-shim.sql and all of supabase/migrations applied in order, the way a
 * new Supabase project would get them.
 *
 * - Default: PGlite (Postgres compiled to WASM, in process). It has one connection, so tests that need two
 *   concurrent transactions are skipped.
 * - TEST_DATABASE_URL=postgres://user@localhost:5432/postgres: a real Postgres server. A throwaway database is
 *   created on it and dropped afterwards. Concurrency tests run only here.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type Row = Record<string, unknown>;

export type Queryable = {
  query<T extends Row = Row>(sql: string, params?: unknown[]): Promise<T[]>;
};

export type TestSession = Queryable & { close(): Promise<void> };

export type TestDatabase = Queryable & {
  /** "postgres" = a real server; "pglite" = in-process, one connection. */
  kind: "postgres" | "pglite";
  /** Runs a script with several statements. */
  exec(sql: string): Promise<void>;
  /** A second, independent connection. Real server only. */
  connect(): Promise<TestSession>;
  close(): Promise<void>;
};

export type Role = "anon" | "authenticated" | "service_role";

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");
const SHIM_PATH = join(process.cwd(), "supabase", "tests", "supabase-shim.sql");

export const NEEDS_REAL_POSTGRES = "needs a real Postgres server: set TEST_DATABASE_URL";

export function hasRealPostgres(): boolean {
  return Boolean(process.env.TEST_DATABASE_URL);
}

export function listMigrations(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();
}

async function createPgliteDatabase(): Promise<TestDatabase> {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  await db.waitReady;

  return {
    kind: "pglite",
    query: async <T extends Row>(sql: string, params?: unknown[]) => (await db.query<T>(sql, params)).rows,
    exec: async (sql) => {
      await db.exec(sql);
    },
    connect: async () => {
      throw new Error(`A second connection ${NEEDS_REAL_POSTGRES}`);
    },
    close: async () => {
      await db.close();
    },
  };
}

async function createPostgresDatabase(url: string): Promise<TestDatabase> {
  const { default: pg } = await import("pg");
  const name = `chessvolt_test_${process.pid}_${Date.now().toString(36)}`;

  const admin = new pg.Client({ connectionString: url });
  await admin.connect();
  await admin.query(`create database ${name}`);

  const databaseUrl = new URL(url);
  databaseUrl.pathname = `/${name}`;

  const sessions = new Set<InstanceType<typeof pg.Client>>();
  const open = async () => {
    const client = new pg.Client({ connectionString: databaseUrl.toString() });
    await client.connect();
    sessions.add(client);
    return client;
  };
  const main = await open();

  return {
    kind: "postgres",
    query: async <T extends Row>(sql: string, params?: unknown[]) => (await main.query(sql, params)).rows as T[],
    exec: async (sql) => {
      await main.query(sql);
    },
    connect: async () => {
      const client = await open();
      return {
        query: async <T extends Row>(sql: string, params?: unknown[]) => (await client.query(sql, params)).rows as T[],
        close: async () => {
          sessions.delete(client);
          await client.end();
        },
      };
    },
    close: async () => {
      for (const client of sessions) await client.end().catch(() => undefined);
      await admin.query(`drop database if exists ${name} with (force)`);
      await admin.end();
    },
  };
}

export async function createEmptyDatabase(): Promise<TestDatabase> {
  const url = process.env.TEST_DATABASE_URL;
  return url ? createPostgresDatabase(url) : createPgliteDatabase();
}

/**
 * Applies the shim (unless `shim: false`) and, in file-name order, the migrations from `from` (inclusive) up to
 * `before` (exclusive); all of them by default. Two calls let a test add rows between two migrations.
 */
export async function applyMigrations(
  db: TestDatabase,
  options: { from?: string; before?: string; shim?: boolean } = {},
): Promise<string[]> {
  if (options.shim !== false) await db.exec(readFileSync(SHIM_PATH, "utf8"));

  const applied: string[] = [];
  for (const file of listMigrations()) {
    if (options.from && file < options.from) continue;
    if (options.before && file >= options.before) break;
    try {
      await db.exec(readFileSync(join(MIGRATIONS_DIR, file), "utf8"));
    } catch (error) {
      throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
    applied.push(file);
  }
  return applied;
}

export async function createMigratedDatabase(options: { before?: string } = {}): Promise<TestDatabase> {
  const db = await createEmptyDatabase();
  await applyMigrations(db, options);
  return db;
}

/**
 * Runs `fn` in a transaction as `role`, with the JWT claims PostgREST would set for that user. Rolls back when `fn`
 * throws, so a failed statement does not leak into the next one.
 */
export async function runAs<T>(
  conn: Queryable,
  role: Role,
  userId: string | null,
  fn: (q: Queryable) => Promise<T>,
): Promise<T> {
  await conn.query("begin");
  try {
    await conn.query(`set local role ${role}`);
    await conn.query("select set_config('request.jwt.claims', $1, true)", [
      JSON.stringify(userId ? { sub: userId, role } : { role }),
    ]);
    const result = await fn(conn);
    await conn.query("commit");
    return result;
  } catch (error) {
    await conn.query("rollback").catch(() => undefined);
    throw error;
  }
}

/** The Postgres error message of a failing call, or null when it succeeds. */
export async function errorOf(run: () => Promise<unknown>): Promise<string | null> {
  try {
    await run();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}
