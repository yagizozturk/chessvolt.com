import type { SupabaseClient } from "@supabase/supabase-js";

import * as blogRepo from "@/features/blog/repository/blog.repository";
import type { CreateBlogPostPayload, UpdateBlogPostPayload } from "@/features/blog/types/blog-payload";
import type { BlogPost, BlogSitemapEntry, PublishedBlogPage } from "@/features/blog/types/blog-post";
import { slugifyBlogTitle } from "@/features/blog/utilities/blog-slug";

export async function getPublishedBlogPage(supabase: SupabaseClient, offset: number): Promise<PublishedBlogPage> {
  return blogRepo.findPublishedBlogPage(supabase, offset);
}

export async function getPublishedBlogPostBySlug(supabase: SupabaseClient, slug: string): Promise<BlogPost | null> {
  return blogRepo.findPublishedBlogPostBySlug(supabase, slug);
}

export async function getAllBlogPosts(supabase: SupabaseClient): Promise<BlogPost[]> {
  return blogRepo.findAllBlogPosts(supabase);
}

export async function getBlogPostById(supabase: SupabaseClient, id: string): Promise<BlogPost | null> {
  return blogRepo.findBlogPostById(supabase, id);
}

export async function getPublishedBlogSitemapEntries(supabase: SupabaseClient): Promise<BlogSitemapEntry[]> {
  return blogRepo.findPublishedBlogSitemapEntries(supabase);
}

export async function resolveBlogSlug(
  supabase: SupabaseClient,
  input: { title: string; requestedSlug: string; excludeId?: string },
): Promise<{ slug: string } | { error: "invalid_slug" | "slug_taken" }> {
  const requested = input.requestedSlug.trim();

  if (requested) {
    const slug = slugifyBlogTitle(requested);
    if (!slug) return { error: "invalid_slug" };
    const taken = await blogRepo.isBlogSlugTaken(supabase, slug, input.excludeId);
    if (taken) return { error: "slug_taken" };
    return { slug };
  }

  const base = slugifyBlogTitle(input.title) || "post";
  const baseTaken = await blogRepo.isBlogSlugTaken(supabase, base, input.excludeId);
  if (!baseTaken) return { slug: base };

  for (let suffix = 2; suffix <= 50; suffix += 1) {
    const candidate = `${base}-${suffix}`;
    const taken = await blogRepo.isBlogSlugTaken(supabase, candidate, input.excludeId);
    if (!taken) return { slug: candidate };
  }

  return { error: "slug_taken" };
}

export async function createBlogPost(supabase: SupabaseClient, payload: CreateBlogPostPayload): Promise<BlogPost | null> {
  return blogRepo.createBlogPost(supabase, payload);
}

export async function updateBlogPost(
  supabase: SupabaseClient,
  id: string,
  payload: UpdateBlogPostPayload,
): Promise<BlogPost | null> {
  return blogRepo.updateBlogPost(supabase, id, payload);
}

export async function deleteBlogPost(supabase: SupabaseClient, id: string): Promise<boolean> {
  return blogRepo.removeBlogPost(supabase, id);
}

export function publishedAtForStatus(status: "draft" | "published", current: string | null): string | null {
  if (status !== "published") return current;
  return current ?? new Date().toISOString();
}
