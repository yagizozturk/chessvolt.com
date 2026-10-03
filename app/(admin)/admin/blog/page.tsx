import { Plus } from "lucide-react";
import Link from "next/link";

import { AdminBlogList } from "@/app/(admin)/admin/blog/components/admin-blog-list";
import { getAllBlogPosts } from "@/features/blog/services/blog.service";
import { getAdminUser } from "@/lib/supabase/auth";

const BLOG_ADMIN_ERRORS: Record<string, string> = {
  delete_failed: "Could not delete the post. Please try again.",
  update_failed: "Could not save the post. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminBlogPage({ searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const posts = await getAllBlogPosts(supabase);
  const { error } = await searchParams;
  const errorMessage = error ? (BLOG_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Blog</h2>
            <p className="text-muted-foreground text-sm">{posts.length} posts</p>
          </div>
          <Link
            href="/admin/blog/create"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            New post
          </Link>
        </div>
        <AdminBlogList posts={posts} />
      </section>
    </div>
  );
}
