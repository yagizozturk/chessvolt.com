import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header/page-header";
import { BlogList } from "@/features/blog/components/blog-list";
import { getPublishedBlogPage } from "@/features/blog/services/blog.service";
import { getPublicUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Blog | ChessVolt",
  description: "Notes and updates from ChessVolt.",
};

export default async function BlogPage() {
  const { supabase } = await getPublicUser();
  const page = await getPublishedBlogPage(supabase, 0);

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <PageHeader title="Blog" description="Notes and updates from ChessVolt." />
        <BlogList initialPosts={page.posts} initialHasMore={page.hasMore} />
      </div>
    </div>
  );
}
