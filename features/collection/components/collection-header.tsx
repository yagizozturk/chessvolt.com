import Image from "next/image";

type CollectionHeaderProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  quote: string;
  author: string;
  backgroundColor: string;
  itemCount: number;
  itemLabel: string;
  difficultyLabel?: string;
};

export function CollectionHeader({
  title,
  imageSrc,
  imageAlt,
  description,
  quote,
  author,
  backgroundColor,
  itemCount,
  itemLabel,
  difficultyLabel,
}: CollectionHeaderProps) {
  return (
    <div className="flex gap-2 rounded-lg" style={{ backgroundColor }}>
      <div className="min-w-0 flex-1 space-y-2 p-4">
        <p className="text-primary text-sm font-semibold">
          {description}
          {difficultyLabel ? (
            <span className="text-white/80 font-normal"> · {difficultyLabel}</span>
          ) : null}
        </p>
        <h2 className="text-3xl font-bold">{title}</h2>
        <blockquote className="border-primary/30 border-l-2 pl-3">
          <p className="text-sm text-white/60 italic">&ldquo;{quote}&rdquo;</p>
          <cite className="mt-0.5 block text-xs text-white/60 not-italic">— {author}</cite>
        </blockquote>
        {/*<Badge variant="default" className="font-normal">
          {itemCount} {itemLabel}
        </Badge>*/}
      </div>
      <div className="overflow-hidden rounded-lg">
        <Image src={imageSrc} alt={imageAlt} width={300} height={200} className="object-contain" />
      </div>
    </div>
  );
}
