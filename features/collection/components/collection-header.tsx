import Image from "next/image";

import type { Collection } from "@/features/collection/types/collection";
import { formatCollectionDifficultyLabel } from "@/features/collection/types/collection-difficulty";
import { getCollectionCoverImageSrc } from "@/features/collection/utilities/collection-cover-image.utils";
import { DEFAULT_GAME_TYPE_DETAILS } from "@/lib/shared/constants/game-type-details";

type CollectionHeaderCollection = Pick<
  Collection,
  "title" | "description" | "coverImageUrl" | "coverImageColor" | "difficulty"
>;

type CollectionHeaderQuote = {
  quote: string;
  author: string;
};

type CollectionHeaderProps = {
  collection: CollectionHeaderCollection;
  quote?: CollectionHeaderQuote;
};

export function CollectionHeader({ collection, quote = DEFAULT_GAME_TYPE_DETAILS }: CollectionHeaderProps) {
  const difficultyLabel = formatCollectionDifficultyLabel(collection.difficulty);
  const imageSrc = getCollectionCoverImageSrc(collection.coverImageUrl);

  return (
    <div className="flex gap-2 rounded-lg" style={{ backgroundColor: collection.coverImageColor }}>
      <div className="min-w-0 flex-1 space-y-2 p-4">
        <p className="text-primary text-sm font-semibold">
          {collection.description}
          <span className="font-normal text-white/80"> · {difficultyLabel}</span>
        </p>
        <h2 className="text-3xl font-bold">{collection.title}</h2>
        <blockquote className="border-primary/30 border-l-2 pl-3">
          <p className="text-sm text-white/60 italic">&ldquo;{quote.quote}&rdquo;</p>
          <cite className="mt-0.5 block text-xs text-white/60 not-italic">— {quote.author}</cite>
        </blockquote>
      </div>
      <div className="overflow-hidden rounded-lg">
        <Image src={imageSrc} alt={collection.title} width={300} height={200} className="object-contain" />
      </div>
    </div>
  );
}
