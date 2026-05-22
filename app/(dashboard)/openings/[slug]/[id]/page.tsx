import type { DrawShape } from "@lichess-org/chessground/draw";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArrowsBoardCard } from "@/features/arrows/components/arrows-board-card/arrows-board-card";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import {
  getOpeningById,
  getOpeningVariantsByOpeningId,
} from "@/features/openings/services/openings.service";
import { flattenOpeningArrowGroups } from "@/features/openings/types/opening";
import * as attemptService from "@/features/user-sequence-attempt/services/user-sequence-attempt.service";
import { buildAttemptByVariantId } from "@/features/user-sequence-attempt/utilities/build-attempt-by-variant-id";
import { getPublicUser } from "@/lib/supabase/auth";

type Params = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function OpeningBySlugAndIdPage({ params }: Params) {
  const { slug, id } = await params;
  const { user, supabase } = await getPublicUser();

  const opening = await getOpeningById(supabase, id);
  if (!opening) {
    notFound();
  }

  const variants = await getOpeningVariantsByOpeningId(supabase, opening.id);

  const sequenceIds = [...new Set(variants.map((v) => v.moveSequence.id))];
  const summaries = user
    ? await attemptService.getLatestSummariesForSequences(supabase, user.id, sequenceIds)
    : [];
  const attemptByVariantId = buildAttemptByVariantId(variants, summaries);

  const total = variants.length;
  const correct = Object.values(attemptByVariantId).filter((v) => v === true).length;
  const solveRate = total > 0 ? Math.round((correct / total) * 100) : 0;
  const boardArrows = (opening.arrows ? flattenOpeningArrowGroups(opening.arrows) : []) as DrawShape[];

  return (
    <div className="container mx-auto max-w-6xl pt-10 pb-16">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 rounded-lg bg-[#FDCB15]">
          <div className="min-w-0 flex-1 space-y-2 p-4">
            <ArrowsBoardCard
              openingId={opening.id}
              name={opening.name}
              description={opening.description ?? ""}
              arrows={boardArrows}
              size={160}
            />
          </div>
          <div className="overflow-hidden rounded-lg">
            <Image
              src="/images/openings/bg-london-opening-5.png"
              alt={opening.name}
              width={400}
              height={300}
              className="object-contain"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {variants.map((variant) => {
            return (
              <OpeningBoardCard
                key={variant.id}
                id={variant.id}
                name={variant.title ?? ""}
                group={variant.group}
                size={240}
                href={`/openings/variant/${variant.id}`}
                fen={variant.moveSequence.displayFen ?? variant.moveSequence.initialFen}
                isComplete={attemptByVariantId[variant.id]}
                description={variant.description}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
