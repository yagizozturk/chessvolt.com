import Image from "next/image";

import type { Study } from "@/features/study/types/study";
import { getStudyCoverImageSrc } from "@/features/study/utilities/study-cover-image.utils";
import { formatStudyDifficultyLabel } from "@/features/study/utilities/study-difficulty.utils";
import { DEFAULT_GAME_TYPE_DETAILS } from "@/lib/shared/constants/game-type-details";

type StudyHeaderStudy = Pick<Study, "title" | "description" | "coverImageUrl" | "coverImageColor" | "difficulty">;

type StudyHeaderQuote = {
  quote: string;
  author: string;
};

type StudyHeaderProps = {
  study: StudyHeaderStudy;
  quote?: StudyHeaderQuote;
};

export function StudyHeader({ study, quote = DEFAULT_GAME_TYPE_DETAILS }: StudyHeaderProps) {
  const difficultyLabel = formatStudyDifficultyLabel(study.difficulty);
  const imageSrc = getStudyCoverImageSrc(study.coverImageUrl);

  return (
    <div className="flex gap-2 rounded-lg" style={{ backgroundColor: study.coverImageColor }}>
      <div className="min-w-0 flex-1 space-y-2 p-4">
        <p className="text-primary text-sm font-semibold">
          {study.description}
          <span className="font-normal text-white/80"> · {difficultyLabel}</span>
        </p>
        <h2 className="text-3xl font-bold">{study.title}</h2>
        <blockquote className="border-primary/30 border-l-2 pl-3">
          <p className="text-sm text-white/60 italic">&ldquo;{quote.quote}&rdquo;</p>
          <cite className="mt-0.5 block text-xs text-white/60 not-italic">— {quote.author}</cite>
        </blockquote>
      </div>
      <div className="overflow-hidden rounded-lg">
        <Image src={imageSrc} alt={study.title} width={300} height={200} className="object-contain" />
      </div>
    </div>
  );
}
