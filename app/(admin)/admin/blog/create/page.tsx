import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createBlogPostAction } from "@/app/(admin)/admin/blog/actions/blog";
import { BlogForm } from "@/app/(admin)/admin/blog/components/blog-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BLOG_ADMIN_ERRORS: Record<string, string> = {
  missing_fields: "Title, content, and a cover image are required.",
  invalid_content: "The post content could not be read. Please try again.",
  invalid_image: "Cover image must be a JPEG, PNG, or WebP under 2MB.",
  invalid_slug: "Enter a slug that uses letters, numbers, and hyphens.",
  slug_taken: "That slug is already used. Choose another one.",
  upload_failed: "Could not upload the cover image. Please try again.",
  create_failed: "Could not create the post. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminCreateBlogPage({ searchParams }: Props) {
  const { error } = await searchParams;
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
          <CardTitle>New post</CardTitle>
          <CardDescription>Drafts stay off the public blog until you publish them.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm action={createBlogPostAction} submitLabel="Create post" />
        </CardContent>
      </Card>
    </div>
  );
}
