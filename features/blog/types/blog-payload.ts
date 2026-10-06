import type { JSONContent } from "@tiptap/core";

import type { BlogPostStatus } from "@/features/blog/types/blog-post";

export type CreateBlogPostPayload = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: JSONContent;
  coverImagePath: string;
  status: BlogPostStatus;
  publishedAt: string | null;
  authorId: string;
};

export type UpdateBlogPostPayload = {
  title: string;
  slug: string;
  description: string | null;
  content: JSONContent;
  coverImagePath: string;
  status: BlogPostStatus;
  publishedAt: string | null;
};
