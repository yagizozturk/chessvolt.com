"use client";

import { useState } from "react";

import { loadMoreBlogPosts } from "@/app/(dashboard)/blog/actions";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/features/blog/components/blog-card";
import type { BlogPostCard } from "@/features/blog/types/blog-post";

type Props = {
  initialPosts: BlogPostCard[];
  initialHasMore: boolean;
};

export function BlogList({ initialPosts, initialHasMore }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLoadMore() {
    setIsLoading(true);
    const next = await loadMoreBlogPosts(posts.length);
    setPosts((current) => [...current, ...next.posts]);
    setHasMore(next.hasMore);
    setIsLoading(false);
  }

  if (posts.length === 0) {
    return <p className="text-muted-foreground text-center">No posts yet.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      {hasMore ? (
        <div className="flex justify-center">
          <Button type="button" variant="volt" onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
