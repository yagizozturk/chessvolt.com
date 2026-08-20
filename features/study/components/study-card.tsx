"use client";

import { ChessPawn, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { takeTopStudyThemes } from "@/features/study-theme/mapper/study-theme.mapper";
import type { StudyWithPuzzleCountAndThemes } from "@/features/study/types/study";
import { getStudyCoverImageSrc } from "@/features/study/utilities/study-cover-image.utils";
import { formatStudyDifficultyLabel } from "@/features/study/utilities/study-difficulty.utils";
import { formatStudyPuzzleCount } from "@/features/study/utilities/study-puzzle-count-format.utils";
import { ThemeBadge } from "@/features/theme/components/theme-badge";
import { cn } from "@/lib/utils";

type StudyCardProps = {
  study: StudyWithPuzzleCountAndThemes;
};

export function StudyCard({ study }: StudyCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const imageSrc = getStudyCoverImageSrc(study.coverImageUrl);
  const href = `/studies/${study.slug}`;

  return (
    <div
      aria-busy={isLoading}
      className={cn("card-border-bottom-shadow relative flex h-full flex-col", isLoading && "pointer-events-none")}
    >
      {/* Study main div card. pointer-event-none is for duplicate request block for multiple presses  */}
      {/* flex-flex-col helps flex-1 to work. h-full helps us to make all card share the same height. Because there is a parent div, h-full makes the full equal even if there is a longer description in one of the cards */}
      {/* Loading state in the whole card, on center */}
      {/* inset-0 means top-0 left-0 bottom-0 right-0, makes it fills all the component */}
      {isLoading ? (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : null}
      <div style={{ background: study.coverImageColor }} className="flex overflow-hidden rounded-t-xl">
        {/* Study cover image div */}
        {/* min-w-0: Remove the minimum width constraint of this flex item (set it to 0). No matter how large the inner content is, if the parent div shrinks, you shrink along with
              it and force the inner elements to wrap to the next line (flex-wrap) if necessary.
              In short, min-w-0 maintains the responsive (mobile-friendly) vertical and horizontal balance of the card. 
              It prevents the badges from blowing out the card to the right or squeezing the adjacent Link/Image component until it becomes completely invisible.
           */}
        {/* items-end helps the badges to stich to the bottom of the left div */}
        <div className="flex min-w-0 flex-1 items-end p-4">
          {/* flex-wrap: If the badges don't fit in one line, wrap them to the next line */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">
              <Trophy data-icon="inline-start" />
              {formatStudyDifficultyLabel(study.difficulty)}
            </Badge>
            <Badge variant="default" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <ChessPawn data-icon="inline-start" />
              {formatStudyPuzzleCount(study.puzzleCount)}
            </Badge>
            {takeTopStudyThemes(study.themes).map((item) => (
              <ThemeBadge key={item.id} theme={item.theme} />
            ))}
          </div>
        </div>
        {/* This overflow-hidden is there because the image should not override rounded corners of parent div */}
        {/* Object contain keeps the original image ratio, width is the reference */}
        <Link href={href} onClick={() => setIsLoading(true)} className="overflow-hidden">
          <Image src={imageSrc} alt={study.title} className="object-contain" width={275} height={155} />
        </Link>
      </div>
      {/* Study title, description and play button */}
      {/* flex-1 (critical!) makes the div take the whole space. Different cards can have different long of description. */}
      {/* If flex-1 is not used then mt-auto was not going to work for play button */}
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h2 className="sub-section-header-title">
          <Link href={href} onClick={() => setIsLoading(true)}>
            {study.title}
          </Link>
        </h2>
        <p className="text-muted-foreground text-base">{study.description}</p>
        <div className="mt-auto flex items-center gap-3">
          {/* shrink-0 keeps the size of the button no matter what sizes changeds through the parent size */}
          <Link
            href={href}
            onClick={() => setIsLoading(true)}
            className={cn(buttonVariants({ variant: "voltCompact", size: "xs" }), "ml-auto shrink-0")}
          >
            See Games
          </Link>
        </div>
      </div>
    </div>
  );
}
