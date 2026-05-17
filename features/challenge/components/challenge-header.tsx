import Image from "next/image";

type ChallengeHeaderProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  quote: string;
  author: string;
  itemCount: number;
  itemLabel: string;
};

export function ChallengeHeader({
  title,
  imageSrc,
  imageAlt,
  description,
  quote,
  author,
  itemCount,
  itemLabel,
}: ChallengeHeaderProps) {
  return (
    <div className="flex gap-2 rounded-lg bg-[#5D37BF]">
      <div className="min-w-0 flex-1 space-y-2 p-4">
        <p className="text-primary text-sm font-semibold">{description}</p>
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
        <Image src={imageSrc} alt={imageAlt} width={300} height={180} className="object-contain" />
      </div>
    </div>
  );
}
