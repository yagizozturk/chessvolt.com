import type { SupabaseClient } from "@supabase/supabase-js";

import { BLOG_PAGE_SIZE } from "@/features/blog/constants/blog.constants";
import {
  toBlogPost,
  toBlogPostCard,
  toBlogSitemapEntry,
  type DbBlogPost,
} from "@/features/blog/mapper/blog-post.mapper";
import type { CreateBlogPostPayload, UpdateBlogPostPayload } from "@/features/blog/types/blog-payload";
import type { BlogPost, BlogSitemapEntry, PublishedBlogPage } from "@/features/blog/types/blog-post";
import { getBlogCoverPublicUrl } from "@/features/blog/utilities/blog-cover";

const PUBLISHED_CARD_COLUMNS = "id, slug, title, content, cover_image_path, published_at";

function mapPost(supabase: SupabaseClient, row: DbBlogPost): BlogPost {
  return toBlogPost(row, getBlogCoverPublicUrl(supabase, row.cover_image_path));
}

export async function findPublishedBlogPage(
  supabase: SupabaseClient,
  offset: number,
  limit = BLOG_PAGE_SIZE,
): Promise<PublishedBlogPage> {
  const from = Math.max(0, offset);
  const { data, error, count } = await supabase
    .from("blog_posts")
    .select(PUBLISHED_CARD_COLUMNS, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(from, from + limit - 1);

  if (error) {
    console.error("blog.repository.findPublishedBlogPage error:", error);
    return { posts: [], hasMore: false };
  }

  const rows = (data ?? []) as unknown as Pick<
    DbBlogPost,
    "id" | "slug" | "title" | "content" | "cover_image_path" | "published_at"
  >[];

  return {
    posts: rows.map((row) => toBlogPostCard(row as DbBlogPost, getBlogCoverPublicUrl(supabase, row.cover_image_path))),
    hasMore: from + rows.length < (count ?? 0),
  };
}

export async function findPublishedBlogPostBySlug(supabase: SupabaseClient, slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("blog.repository.findPublishedBlogPostBySlug error:", error);
    return null;
  }

  if (!data) return null;
  return mapPost(supabase, data as DbBlogPost);
}

export async function findAllBlogPosts(supabase: SupabaseClient): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("blog.repository.findAllBlogPosts error:", error);
    return [];
  }

  return ((data ?? []) as DbBlogPost[]).map((row) => mapPost(supabase, row));
}

export async function findBlogPostById(supabase: SupabaseClient, id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("blog.repository.findBlogPostById error:", error);
    return null;
  }

  if (!data) return null;
  return mapPost(supabase, data as DbBlogPost);
}

export async function isBlogSlugTaken(
  supabase: SupabaseClient,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  let query = supabase.from("blog_posts").select("id").eq("slug", slug);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("blog.repository.isBlogSlugTaken error:", error);
    return true;
  }

  return Boolean(data);
}

export async function createBlogPost(supabase: SupabaseClient, payload: CreateBlogPostPayload): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      id: payload.id,
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      cover_image_path: payload.coverImagePath,
      status: payload.status,
      published_at: payload.publishedAt,
      author_id: payload.authorId,
    })
    .select()
    .single();

  if (error) {
    console.error("blog.repository.createBlogPost error:", error);
    return null;
  }

  return mapPost(supabase, data as DbBlogPost);
}

export async function updateBlogPost(
  supabase: SupabaseClient,
  id: string,
  payload: UpdateBlogPostPayload,
): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      cover_image_path: payload.coverImagePath,
      status: payload.status,
      published_at: payload.publishedAt,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("blog.repository.updateBlogPost error:", error);
    return null;
  }

  return mapPost(supabase, data as DbBlogPost);
}

export async function removeBlogPost(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    console.error("blog.repository.removeBlogPost error:", error);
    return false;
  }

  return true;
}

export async function findPublishedBlogSitemapEntries(supabase: SupabaseClient): Promise<BlogSitemapEntry[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published");

  if (error) {
    console.error("blog.repository.findPublishedBlogSitemapEntries error:", error);
    return [];
  }

  return ((data ?? []) as Pick<DbBlogPost, "slug" | "updated_at">[]).map(toBlogSitemapEntry);
}
