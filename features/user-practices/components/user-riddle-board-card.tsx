"use client";

import { ChessPawn, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { formatCollectionDifficultyLabel } from "@/features/collection/types/collection-difficulty";
import { getCollectionCoverImageSrc } from "@/features/collection/utilities/collection-cover-image.utils";
import { formatCollectionRiddleCount } from "@/features/collection/utilities/collection-riddle-count-format.utils";
import { ThemeBadge } from "@/features/theme/components/theme-badge";
import { DeleteUserListDialog } from "@/features/user-practices/components/delete-user-list-dialog";
import { EditUserListDialog } from "@/features/user-practices/components/edit-user-list-dialog";
import { cn } from "@/lib/utils";

type UserRiddleBoardCardProps = {
  collection: CollectionWithRiddleCountAndThemes;
};

export function UserRiddleBoardCard({ collection }: UserRiddleBoardCardProps) {
  const imageSrc = getCollectionCoverImageSrc(collection.coverImageUrl);

  return (
    <div className="bg-card border-b-card-shadow flex h-full flex-col items-stretch gap-2 rounded-lg border-b-[6px]">
      <div style={{ backgroundColor: collection.coverImageColor }} className="flex overflow-hidden rounded-t-lg">
        <div className="flex min-w-0 flex-1 items-end p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">
              <Trophy data-icon="inline-start" />
              {formatCollectionDifficultyLabel(collection.difficulty)}
            </Badge>
            <Badge variant="default" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <ChessPawn data-icon="inline-start" />
              {formatCollectionRiddleCount(collection.riddleCount)}
            </Badge>
            {collection.themes.map((item) => (
              <ThemeBadge key={item.id} theme={item.theme} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <Image src={imageSrc} alt={collection.title} className="object-contain" width={268} height={200} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h2 className="text-3xl font-bold">{collection.title}</h2>
        <p className="text-muted-foreground text-base">{collection.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <EditUserListDialog collection={collection} />
          <DeleteUserListDialog collection={collection} />
          <Link
            href={`/collection/${collection.slug}`}
            className={cn(buttonVariants({ variant: "voltCompact", size: "xs" }), "ml-auto shrink-0")}
          >
            Play
          </Link>
        </div>
      </div>
    </div>
  );
}
