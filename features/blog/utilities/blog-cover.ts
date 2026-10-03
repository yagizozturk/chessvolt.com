import type { SupabaseClient } from "@supabase/supabase-js";

import {
  BLOG_COVER_CONTENT_TYPES,
  BLOG_COVER_MAX_BYTES,
  BLOG_COVERS_BUCKET,
  type BlogCoverContentType,
} from "@/features/blog/constants/blog.constants";

export function getBlogCoverPublicUrl(supabase: SupabaseClient, path: string): string {
  const { data } = supabase.storage.from(BLOG_COVERS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function blogCoverExtension(file: File): string | null {
  if (file.size <= 0 || file.size > BLOG_COVER_MAX_BYTES) return null;
  const extension = BLOG_COVER_CONTENT_TYPES[file.type as BlogCoverContentType];
  return extension ?? null;
}

export function blogCoverPath(postId: string, extension: string): string {
  return `${postId}/cover.${extension}`;
}

export async function uploadBlogCover(supabase: SupabaseClient, path: string, file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BLOG_COVERS_BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    console.error("blog-cover.uploadBlogCover error:", error);
    return false;
  }

  return true;
}

export async function removeBlogCover(supabase: SupabaseClient, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(BLOG_COVERS_BUCKET).remove([path]);

  if (error) {
    console.error("blog-cover.removeBlogCover error:", error);
    return false;
  }

  return true;
}
