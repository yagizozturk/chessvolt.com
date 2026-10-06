import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getPublishedBlogPostBySlug } from "@/features/blog/services/blog.service";
import { renderBlogHtml } from "@/features/blog/utilities/blog-html";
import { getPublicUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { supabase } = await getPublicUser();
  const post = await getPublishedBlogPostBySlug(supabase, slug);

  if (!post) {
    return { title: "Blog | ChessVolt" };
  }

  return {
    title: `${post.title} | ChessVolt`,
    description: post.description ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { supabase } = await getPublicUser();
  const post = await getPublishedBlogPostBySlug(supabase, slug);

  if (!post) {
    notFound();
  }

  const html = renderBlogHtml(post.content);

  return (
    <div className="page-container">
      <article className="mx-auto flex max-w-3xl flex-col gap-8">
        <Button variant="voltIcon" className="w-fit" asChild>
          <Link href="/blog" aria-label="Back">
            <ChevronLeft className="size-5" />
          </Link>
        </Button>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        </div>
        <h1 className="section-header-title">{post.title}</h1>
        {post.description ? <p className="text-muted-foreground text-lg leading-relaxed">{post.description}</p> : null}
        <div
          className="[&_a]:text-primary space-y-4 text-lg leading-relaxed [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  );
}
