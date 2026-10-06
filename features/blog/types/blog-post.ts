import type { JSONContent } from "@tiptap/core";

export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: JSONContent;
  coverImagePath: string;
  coverImageUrl: string;
  status: BlogPostStatus;
  publishedAt: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostCard = {
  id: string;
  slug: string;
  title: string;
  preview: string;
  coverImageUrl: string;
};

export type PublishedBlogPage = {
  posts: BlogPostCard[];
  hasMore: boolean;
};

export type BlogSitemapEntry = {
  slug: string;
  updatedAt: string;
};
