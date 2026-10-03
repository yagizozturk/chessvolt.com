"use client";

import Image from "next/image";
import Link from "next/link";

import { deleteBlogPostAction } from "@/app/(admin)/admin/blog/actions/blog";
import { EmptyDataMessage } from "@/components/empty-data-message/empty-data-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/features/blog/types/blog-post";

type Props = {
  posts: BlogPost[];
};

export function AdminBlogList({ posts }: Props) {
  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await deleteBlogPostAction(id);
  }

  if (posts.length === 0) {
    return <EmptyDataMessage message="No blog posts yet." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className="border-border flex min-h-0 flex-col gap-3 rounded-lg border p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image src={post.coverImageUrl} alt="" fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
          </div>
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 min-w-0 font-medium">{post.title}</p>
            <Badge variant={post.status === "published" ? "default" : "secondary"}>
              {post.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">/{post.slug}</p>
          <div className="mt-auto flex flex-wrap gap-2">
            <Link href={`/admin/blog/edit/${post.id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDelete(post.id, post.title)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
