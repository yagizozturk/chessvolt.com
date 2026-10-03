import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateBlogPostAction } from "@/app/(admin)/admin/blog/actions/blog";
import { BlogForm } from "@/app/(admin)/admin/blog/components/blog-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBlogPostById } from "@/features/blog/services/blog.service";
import { getAdminUser } from "@/lib/supabase/auth";

const BLOG_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Title and content are required.",
  invalid_image: "Cover image must be a JPEG, PNG, or WebP under 2MB.",
  invalid_slug: "Enter a slug that uses letters, numbers, and hyphens.",
  slug_taken: "That slug is already used. Choose another one.",
  upload_failed: "Could not upload the cover image. Please try again.",
  update_failed: "Could not save the post. Please try again.",
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminEditBlogPage({ params, searchParams }: Props) {
  const { supabase } = await getAdminUser();
  const { id } = await params;
  const { error } = await searchParams;
  const post = await getBlogPostById(supabase, id);

  if (!post) {
    notFound();
  }

  const errorMessage = error ? (BLOG_ADMIN_ERRORS[error] ?? `An error occurred (${error}).`) : null;

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link
        href="/admin/blog"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All posts
      </Link>
      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Edit post</CardTitle>
          <CardDescription>Changes to a published post show up on /blog/{post.slug}.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm action={updateBlogPostAction} post={post} submitLabel="Save post" />
        </CardContent>
      </Card>
    </div>
  );
}
