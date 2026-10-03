"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  publishedAtForStatus,
  resolveBlogSlug,
  updateBlogPost,
} from "@/features/blog/services/blog.service";
import type { BlogPostStatus } from "@/features/blog/types/blog-post";
import { isBlogContentEmpty, parseBlogContent } from "@/features/blog/utilities/blog-content";
import { blogCoverExtension, blogCoverPath, removeBlogCover, uploadBlogCover } from "@/features/blog/utilities/blog-cover";
import { getAdminUser } from "@/lib/supabase/auth";

function parseStatus(raw: FormDataEntryValue | null): BlogPostStatus | null {
  if (raw === "draft" || raw === "published") return raw;
  return null;
}

function readCoverFile(formData: FormData): File | null {
  const value = formData.get("cover");
  if (!value || typeof value === "string") return null;
  if (!("size" in value) || !("arrayBuffer" in value) || value.size <= 0) return null;
  return value;
}

function revalidateBlog(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createBlogPostAction(formData: FormData) {
  const { supabase, user } = await getAdminUser();
  const title = (formData.get("title") as string)?.trim() ?? "";
  const requestedSlug = ((formData.get("slug") as string) || "").trim();
  const status = parseStatus(formData.get("status"));
  const content = parseBlogContent(String(formData.get("content") ?? ""));
  const cover = readCoverFile(formData);

  if (!title || !status || !content || isBlogContentEmpty(content) || !cover) {
    redirect("/admin/blog/create?error=missing_fields");
  }

  const extension = blogCoverExtension(cover);
  if (!extension) {
    redirect("/admin/blog/create?error=invalid_image");
  }

  const resolved = await resolveBlogSlug(supabase, { title, requestedSlug });
  if ("error" in resolved) {
    redirect(`/admin/blog/create?error=${resolved.error}`);
  }

  const id = crypto.randomUUID();
  const coverImagePath = blogCoverPath(id, extension);
  const uploaded = await uploadBlogCover(supabase, coverImagePath, cover);
  if (!uploaded) {
    redirect("/admin/blog/create?error=upload_failed");
  }

  const post = await createBlogPost(supabase, {
    id,
    title,
    slug: resolved.slug,
    content,
    coverImagePath,
    status,
    publishedAt: publishedAtForStatus(status, null),
    authorId: user.id,
  });

  if (!post) {
    await removeBlogCover(supabase, coverImagePath);
    redirect("/admin/blog/create?error=create_failed");
  }

  revalidateBlog(post.slug);
  redirect("/admin/blog");
}

export async function updateBlogPostAction(formData: FormData) {
  const { supabase } = await getAdminUser();
  const id = (formData.get("postId") as string)?.trim() ?? "";
  const existing = id ? await getBlogPostById(supabase, id) : null;
  const editPath = `/admin/blog/edit/${id}`;

  if (!existing) {
    redirect("/admin/blog?error=update_failed");
  }

  const title = (formData.get("title") as string)?.trim() ?? "";
  const requestedSlug = ((formData.get("slug") as string) || "").trim();
  const status = parseStatus(formData.get("status"));
  const content = parseBlogContent(String(formData.get("content") ?? ""));
  const cover = readCoverFile(formData);

  if (!title || !status || !content || isBlogContentEmpty(content)) {
    redirect(`${editPath}?error=missing_fields`);
  }

  const resolved = await resolveBlogSlug(supabase, { title, requestedSlug, excludeId: existing.id });
  if ("error" in resolved) {
    redirect(`${editPath}?error=${resolved.error}`);
  }

  let coverImagePath = existing.coverImagePath;
  if (cover) {
    const extension = blogCoverExtension(cover);
    if (!extension) {
      redirect(`${editPath}?error=invalid_image`);
    }
    const nextPath = blogCoverPath(existing.id, extension);
    const uploaded = await uploadBlogCover(supabase, nextPath, cover);
    if (!uploaded) {
      redirect(`${editPath}?error=upload_failed`);
    }
    coverImagePath = nextPath;
  }

  const post = await updateBlogPost(supabase, existing.id, {
    title,
    slug: resolved.slug,
    content,
    coverImagePath,
    status,
    publishedAt: publishedAtForStatus(status, existing.publishedAt),
  });

  if (!post) {
    if (coverImagePath !== existing.coverImagePath) {
      await removeBlogCover(supabase, coverImagePath);
    }
    redirect(`${editPath}?error=update_failed`);
  }

  if (coverImagePath !== existing.coverImagePath) {
    await removeBlogCover(supabase, existing.coverImagePath);
  }

  revalidateBlog(existing.slug);
  if (post.slug !== existing.slug) revalidateBlog(post.slug);
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(id: string): Promise<void> {
  const { supabase } = await getAdminUser();
  const existing = await getBlogPostById(supabase, id);
  if (!existing) {
    redirect("/admin/blog?error=delete_failed");
  }

  const ok = await deleteBlogPost(supabase, id);
  if (!ok) {
    redirect("/admin/blog?error=delete_failed");
  }

  await removeBlogCover(supabase, existing.coverImagePath);
  revalidateBlog(existing.slug);
  redirect("/admin/blog");
}
