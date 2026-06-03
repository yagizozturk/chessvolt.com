import { ChessPawn, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentThemeList } from "@/features/content-theme/components/content-theme-list";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { formatCollectionDifficultyLabel } from "@/features/collection/types/collection-difficulty";

type CollectionCardProps = {
  collection: CollectionWithRiddleCountAndThemes;
};

export function CollectionCard({ collection }: CollectionCardProps) {
  const imageSrc = `/images/collections/${collection.coverImageUrl}`;

  return (
    <Link
      href={`/collection/${collection.slug}`}
      className="bg-card border-b-card-shadow flex h-full flex-col items-stretch gap-2 rounded-lg border-b-[6px]"
    >
      <div style={{ backgroundColor: collection.coverImageColor }} className="flex overflow-hidden rounded-t-lg">
        <div className="flex min-w-0 flex-1 items-end p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">
              <Trophy data-icon="inline-start" />
              {formatCollectionDifficultyLabel(collection.difficulty)}
            </Badge>
            <Badge variant="default" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <ChessPawn data-icon="inline-start" />
              {collection.riddleCount} {collection.riddleCount === 1 ? "riddle" : "riddles"}
            </Badge>
          </div>
        </div>
        <div className="overflow-hidden">
          <Image src={imageSrc} alt={collection.title} className="object-contain" width={268} height={200} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h2 className="text-3xl font-bold">{collection.title}</h2>
        <p className="text-muted-foreground text-base">{collection.description}</p>
        {collection.themes.length > 0 ? <ContentThemeList items={collection.themes} showWeight={false} /> : null}
        <div className="mt-auto flex items-center gap-3">
          <Button variant="voltCompact" size="xs" className="ml-auto shrink-0">
            Play
          </Button>
        </div>
      </div>
    </Link>
  );
}
