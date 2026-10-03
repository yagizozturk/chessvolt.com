"use client";

import Image from "next/image";
import { useState } from "react";

import { BlogEditor } from "@/app/(admin)/admin/blog/components/blog-editor";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BlogPost, BlogPostStatus } from "@/features/blog/types/blog-post";
import { slugifyBlogTitle } from "@/features/blog/utilities/blog-slug";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  post?: BlogPost;
  submitLabel: string;
};

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

export function BlogForm({ action, post, submitLabel }: Props) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [status, setStatus] = useState<BlogPostStatus>(post?.status ?? "draft");

  return (
    <form action={action} className="space-y-4">
      {post ? <input type="hidden" name="postId" value={post.id} /> : null}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="blog-title">Title</FieldLabel>
          <Input
            id="blog-title"
            name="title"
            required
            value={title}
            placeholder="Post title"
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (!slugEdited) setSlug(slugifyBlogTitle(nextTitle));
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="blog-slug">Slug (URL)</FieldLabel>
          <Input
            id="blog-slug"
            name="slug"
            value={slug}
            placeholder="Auto-generated from title if empty"
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(event.target.value);
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="blog-status">Status</FieldLabel>
          <select
            id="blog-status"
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as BlogPostStatus)}
            className="border-input focus-visible:border-primary focus-visible:ring-primary/50 h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field>
          <FieldLabel htmlFor="blog-cover">Cover image</FieldLabel>
          {post ? (
            <div className="relative mb-3 aspect-video w-full max-w-sm overflow-hidden rounded-md">
              <Image src={post.coverImageUrl} alt="" fill className="object-cover" sizes="384px" />
            </div>
          ) : null}
          <Input id="blog-cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp" required={!post} />
          <p className="text-muted-foreground mt-1 text-xs">
            JPEG, PNG, or WebP. Max 2MB.{post ? " Leave empty to keep the current image." : ""}
          </p>
        </Field>
        <Field>
          <FieldLabel>Content</FieldLabel>
          <BlogEditor initialContent={post?.content ?? EMPTY_DOC} />
        </Field>
      </FieldGroup>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
