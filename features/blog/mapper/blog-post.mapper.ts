import type { JSONContent } from "@tiptap/core";

import type { BlogPost, BlogPostCard, BlogPostStatus, BlogSitemapEntry } from "@/features/blog/types/blog-post";
import { truncateBlogPreview } from "@/features/blog/utilities/blog-content";

export type DbBlogPost = {
  id: string;
  slug: string;
  title: string;
  content: JSONContent;
  cover_image_path: string;
  status: BlogPostStatus;
  published_at: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
};

export function toBlogPost(db: DbBlogPost, coverImageUrl: string): BlogPost {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    content: db.content,
    coverImagePath: db.cover_image_path,
    coverImageUrl,
    status: db.status,
    publishedAt: db.published_at,
    authorId: db.author_id,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function toBlogPostCard(db: DbBlogPost, coverImageUrl: string): BlogPostCard {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    preview: truncateBlogPreview(db.content),
    coverImageUrl,
  };
}

export function toBlogSitemapEntry(db: Pick<DbBlogPost, "slug" | "updated_at">): BlogSitemapEntry {
  return {
    slug: db.slug,
    updatedAt: db.updated_at,
  };
}
