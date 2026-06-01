import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatCollectionDifficultyLabel } from "@/features/collection/types/collection-difficulty";
import type { CollectionWithRiddleCount } from "@/features/collection/types/collection";

type CollectionCardProps = {
  collection: CollectionWithRiddleCount;
};

export function CollectionCard({ collection }: CollectionCardProps) {
  const imageSrc = `/images/collections/${collection.coverImageUrl}`;

  return (
    <Link
      href={`/collection/${collection.slug}`}
      className="bg-card border-b-card-shadow items-stretch gap-6 rounded-lg border-b-[6px]"
    >
      <div style={{ backgroundColor: collection.coverImageColor }} className="flex overflow-hidden rounded-lg">
        <div className="flex min-w-0 flex-1 items-end p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="font-normal">
              {formatCollectionDifficultyLabel(collection.difficulty)}
            </Badge>
            <Badge variant="default" className="font-normal">
              {collection.riddleCount} {collection.riddleCount === 1 ? "riddle" : "riddles"}
            </Badge>
          </div>
        </div>
        <div className="overflow-hidden">
          <Image src={imageSrc} alt={collection.title} className="object-contain" width={268} height={200} />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h2 className="text-3xl font-bold">{collection.title}</h2>
        <p className="text-muted-foreground text-base">{collection.description}</p>
      </div>
    </Link>
  );
}
