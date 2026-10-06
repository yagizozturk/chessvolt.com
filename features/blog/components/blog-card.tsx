import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { BlogPostCard } from "@/features/blog/types/blog-post";

type Props = {
  post: BlogPostCard;
};

export function BlogCard({ post }: Props) {
  return (
    <article className="card-border-bottom-shadow h-full overflow-hidden rounded-xl">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-video w-full">
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="line-clamp-2 text-lg font-bold tracking-tight">{post.title}</h2>
          {post.preview ? (
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{post.preview}</p>
          ) : null}
          <span className={buttonVariants({ variant: "voltCompact", className: "mt-auto w-fit self-end" })}>Read</span>
        </div>
      </Link>
    </article>
  );
}
