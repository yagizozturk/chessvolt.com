import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { BlogPostCard } from "@/features/blog/types/blog-post";

type Props = {
  post: BlogPostCard;
};

export function BlogCard({ post }: Props) {
  return (
    <article className="bg-card flex h-full flex-col overflow-hidden rounded-xl border">
      <div className="relative aspect-video w-full">
        <Image src={post.coverImageUrl} alt="" fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="line-clamp-2 text-lg font-bold tracking-tight">{post.title}</h2>
        {post.preview ? <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{post.preview}</p> : null}
        <Button variant="volt" className="mt-auto w-fit" asChild>
          <Link href={`/blog/${post.slug}`}>Read details</Link>
        </Button>
      </div>
    </article>
  );
}
