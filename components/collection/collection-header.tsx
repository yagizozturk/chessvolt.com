import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type CollectionHeaderProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  quote: string;
  author: string;
  itemCount: number;
  itemLabel: string;
};

export function CollectionHeader({
  title,
  imageSrc,
  imageAlt,
  description,
  quote,
  author,
  itemCount,
  itemLabel,
}: CollectionHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="overflow-hidden rounded-lg bg-muted/30">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={150}
          height={150}
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          {title}
          <Badge variant="default" className="font-normal">
            {itemCount} {itemLabel}
          </Badge>
        </h2>
        <p className="text-muted-foreground text-sm">{description}</p>
        <blockquote className="border-primary/30 border-l-2 pl-3">
          <p className="text-muted-foreground italic">&ldquo;{quote}&rdquo;</p>
          <cite className="text-muted-foreground/80 mt-0.5 block text-xs not-italic">
            — {author}
          </cite>
        </blockquote>
      </div>
    </div>
  );
}
