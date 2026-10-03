"use server";

import { getPublishedBlogPage } from "@/features/blog/services/blog.service";
import type { PublishedBlogPage } from "@/features/blog/types/blog-post";
import { getPublicUser } from "@/lib/supabase/auth";

export async function loadMoreBlogPosts(offset: number): Promise<PublishedBlogPage> {
  const safeOffset = Number.isFinite(offset) && offset > 0 ? Math.floor(offset) : 0;
  const { supabase } = await getPublicUser();
  return getPublishedBlogPage(supabase, safeOffset);
}
