/**
 * Only admins create, edit and delete blog posts and their cover images: RLS on public.blog_posts and on the
 * blog-covers storage bucket (production policies, from the baseline). The admin pages check the role too
 * (getAdminUser in app/(admin)/admin/blog/actions/blog.ts). blog_posts.author_id stays ON DELETE RESTRICT.
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, it } from "node:test";

import { type TestDatabase, createMigratedDatabase, errorOf, runAs } from "./helpers/test-database";

let db: TestDatabase;

before(async () => {
  db = await createMigratedDatabase();
});

after(async () => {
  await db?.close();
});

async function createUser(role: "user" | "admin"): Promise<string> {
  const id = randomUUID();
  await db.query("insert into auth.users (id) values ($1)", [id]);
  await db.query("update public.profiles set role = $2 where id = $1", [id, role]);
  return id;
}

const INSERT_POST =
  "insert into public.blog_posts (slug, title, content, cover_image_path, status, description, author_id) " +
  "values ($1, 'Title', '{}', 'cover.png', $2, 'Description', $3) returning id";

async function createPost(authorId: string, status: "draft" | "published"): Promise<string> {
  const [row] = await db.query<{ id: string }>(INSERT_POST, [`post-${randomUUID()}`, status, authorId]);
  return row.id;
}

describe("blog posts", () => {
  it("a user cannot create, edit or delete posts", async () => {
    const admin = await createUser("admin");
    const user = await createUser("user");
    const postId = await createPost(admin, "published");

    const insert = await errorOf(() =>
      runAs(db, "authenticated", user, (q) => q.query(INSERT_POST, [`post-${randomUUID()}`, "draft", user])),
    );
    assert.match(insert ?? "", /row-level security/);

    const updated = await runAs(db, "authenticated", user, (q) =>
      q.query("update public.blog_posts set title = 'Hacked' where id = $1 returning id", [postId]),
    );
    const deleted = await runAs(db, "authenticated", user, (q) =>
      q.query("delete from public.blog_posts where id = $1 returning id", [postId]),
    );
    assert.equal(updated.length, 0);
    assert.equal(deleted.length, 0);

    const [post] = await db.query<{ title: string }>("select title from public.blog_posts where id = $1", [postId]);
    assert.equal(post.title, "Title");
  });

  it("an admin can create, edit and delete posts", async () => {
    const admin = await createUser("admin");

    const created = await runAs(db, "authenticated", admin, (q) =>
      q.query<{ id: string }>(INSERT_POST, [`post-${randomUUID()}`, "draft", admin]),
    );
    const postId = created[0].id;
    const updated = await runAs(db, "authenticated", admin, (q) =>
      q.query("update public.blog_posts set status = 'published' where id = $1 returning id", [postId]),
    );
    const deleted = await runAs(db, "authenticated", admin, (q) =>
      q.query("delete from public.blog_posts where id = $1 returning id", [postId]),
    );

    assert.equal(updated.length, 1);
    assert.equal(deleted.length, 1);
  });

  it("an admin cannot publish under another user's name", async () => {
    const admin = await createUser("admin");
    const other = await createUser("admin");

    const error = await errorOf(() =>
      runAs(db, "authenticated", admin, (q) => q.query(INSERT_POST, [`post-${randomUUID()}`, "published", other])),
    );
    assert.match(error ?? "", /row-level security/);
  });

  it("visitors and users read published posts only; admins also read drafts", async () => {
    const admin = await createUser("admin");
    const user = await createUser("user");
    const published = await createPost(admin, "published");
    const draft = await createPost(admin, "draft");
    const visible = (role: "anon" | "authenticated", userId: string | null) =>
      runAs(db, role, userId, (q) =>
        q.query<{ id: string }>("select id from public.blog_posts where id in ($1, $2) order by status desc", [
          published,
          draft,
        ]),
      );

    assert.deepEqual(
      (await visible("anon", null)).map((row) => row.id),
      [published],
    );
    assert.deepEqual(
      (await visible("authenticated", user)).map((row) => row.id),
      [published],
    );
    assert.deepEqual((await visible("authenticated", admin)).map((row) => row.id).sort(), [published, draft].sort());
  });

  it("only admins upload blog covers", async () => {
    const admin = await createUser("admin");
    const user = await createUser("user");
    const upload = (userId: string) =>
      runAs(db, "authenticated", userId, (q) =>
        q.query("insert into storage.objects (bucket_id, name) values ('blog-covers', $1)", [`${randomUUID()}.png`]),
      );

    assert.match((await errorOf(() => upload(user))) ?? "", /row-level security/);
    assert.equal(await errorOf(() => upload(admin)), null);
  });

  it("an author with posts cannot be deleted (author_id is RESTRICT)", async () => {
    const admin = await createUser("admin");
    await createPost(admin, "published");

    const error = await errorOf(() => db.query("delete from auth.users where id = $1", [admin]));
    assert.match(error ?? "", /blog_posts_author_id_fkey/);
  });
});
