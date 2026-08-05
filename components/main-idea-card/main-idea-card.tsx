"use client";

import Image from "next/image";

import { Highlighter } from "@/components/ui/highlighter";

const DEFAULT_IMAGE_SRC = "/images/avatar/main-idea-avatar-2.png";

type MainIdeaCardProps = {
  mainIdea: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function MainIdeaCard({ mainIdea, imageSrc = DEFAULT_IMAGE_SRC, imageAlt = "Main idea" }: MainIdeaCardProps) {
  const trimmedMainIdea = mainIdea.trim();

  if (!trimmedMainIdea) return null;

  return (
    <div className="relative flex gap-4 rounded-xl p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex">
          <div className="flex-1 truncate text-lg font-semibold">
            <Highlighter action="underline" color="#FF9800">
              Main Idea Of The Variant
            </Highlighter>
          </div>
        </div>
        <div className="text-muted-foreground w-full leading-normal text-pretty">{trimmedMainIdea}</div>
      </div>
      <div className="relative size-[110px] shrink-0 overflow-hidden">
        <Image src={imageSrc} alt={imageAlt} fill className="object-contain" sizes="110px" />
      </div>
    </div>
  );
}
