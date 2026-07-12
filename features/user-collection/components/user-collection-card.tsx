// TODO: Refactor
"use client";

import { ChessPawn, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { getCollectionCoverImageSrc } from "@/features/collection/utilities/collection-cover-image.utils";
import { formatCollectionDifficultyLabel } from "@/features/collection/utilities/collection-difficulty.utils";
import { formatCollectionRiddleCount } from "@/features/collection/utilities/collection-riddle-count-format.utils";
import { ThemeBadge } from "@/features/theme/components/theme-badge";
import { DeleteUserListDialog } from "@/features/user-collection/components/delete-user-list-dialog";
import { EditUserListDialog } from "@/features/user-collection/components/edit-user-list-dialog";
import { cn } from "@/lib/utils";

type UserCollectionCardProps = {
  collection: CollectionWithRiddleCountAndThemes;
};

export function UserCollectionCard({ collection }: UserCollectionCardProps) {
  const imageSrc = getCollectionCoverImageSrc(collection.coverImageUrl);

  return (
    <div className="bg-card border-b-card-shadow flex h-full flex-col rounded-lg border-b-[6px]">
      <div style={{ background: collection.coverImageColor }} className="flex overflow-hidden rounded-t-lg">
        {/* Note: min-w-0, prevents badge text overflow in flex. can be used with trncate also */}
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
          <Image src={imageSrc} alt={collection.title} className="object-contain" width={170} height={100} />
        </div>
      </div>
      {/* 
        Note: flex-1, pushes the content to the bottom of the card, takes the full size
        flex-1 makes The bottom section stretches to fill remaining space, 
        and mt-auto pushes the action bar to the bottom. All cards in a row get their buttons aligned,
        regardless of content length. 
      */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="sub-section-header-title">{collection.title}</h2>
        <p className="text-muted-foreground text-sm md:text-base">{collection.description}</p>
        {/* Note: mt-auto, pushes the buttons to the bottom of the card */}
        <div className="mt-auto flex flex-wrap items-center gap-3">
          <EditUserListDialog collection={collection} />
          <DeleteUserListDialog collection={collection} />
          {/* Note: shrink-0, prevents the button from shrinking */}
          <Link
            href={`/user-collection/${collection.slug}`}
            className={cn(buttonVariants({ variant: "voltCompact", size: "xs" }), "ml-auto shrink-0")}
          >
            Play
          </Link>
        </div>
      </div>
    </div>
  );
}
